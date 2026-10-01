package com.example.ui.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.example.data.local.AppDatabase
import com.example.data.model.CombatLogEntry
import com.example.data.model.Combatant
import com.example.data.model.Condition
import com.example.data.model.CoverType
import com.example.data.model.LogType
import com.example.data.model.MonsterPreset
import com.example.data.model.PlayerCharacter
import com.example.data.repository.CharacterRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import kotlin.random.Random

class CombatTrackerViewModel(application: Application) : AndroidViewModel(application) {

    private val database = AppDatabase.getDatabase(application, viewModelScope)
    private val repository = CharacterRepository(database.characterDao())

    val characters: StateFlow<List<PlayerCharacter>> = repository.allCharacters
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5000),
            initialValue = emptyList()
        )

    private val _encounterState = MutableStateFlow(EncounterState())
    val encounterState: StateFlow<EncounterState> = _encounterState.asStateFlow()

    private val _diceHistory = MutableStateFlow<List<DiceRollResult>>(emptyList())
    val diceHistory: StateFlow<List<DiceRollResult>> = _diceHistory.asStateFlow()

    private val _lastRoll = MutableStateFlow<DiceRollResult?>(null)
    val lastRoll: StateFlow<DiceRollResult?> = _lastRoll.asStateFlow()

    // --- Character Persistence Operations ---
    fun addCharacter(character: PlayerCharacter) {
        viewModelScope.launch {
            repository.insert(character)
        }
    }

    fun updateCharacter(character: PlayerCharacter) {
        viewModelScope.launch {
            repository.update(character)
            // If in active combat, update matching combatant name, AC, etc.
            _encounterState.update { current ->
                val updatedCombatants = current.combatants.map { combatant ->
                    if (combatant.characterId == character.id) {
                        combatant.copy(
                            name = character.name,
                            armorClass = character.armorClass,
                            maxHp = character.maxHp,
                            initiativeModifier = character.initiativeModifier,
                            passivePerception = character.passivePerception,
                            speed = character.speed,
                            spellDc = character.spellDc
                        )
                    } else combatant
                }
                current.copy(combatants = updatedCombatants)
            }
        }
    }

    fun deleteCharacter(character: PlayerCharacter) {
        viewModelScope.launch {
            repository.delete(character)
            // Remove from active encounter if present
            _encounterState.update { current ->
                val filtered = current.combatants.filterNot { it.characterId == character.id }
                current.copy(
                    combatants = filtered,
                    currentTurnIndex = if (filtered.isEmpty()) 0 else current.currentTurnIndex.coerceIn(0, filtered.size - 1)
                )
            }
        }
    }

    // --- Encounter Setup & Management ---
    fun addPlayerToEncounter(character: PlayerCharacter, rollInit: Boolean = false, manualInit: Int? = null) {
        val initRoll = when {
            manualInit != null -> manualInit
            rollInit -> rollD20() + character.initiativeModifier
            else -> 0
        }
        val combatant = Combatant(
            characterId = character.id,
            name = character.name,
            isPlayer = true,
            characterClassOrType = "${character.characterClass} (Lvl ${character.level})",
            maxHp = character.maxHp,
            currentHp = character.currentHp,
            tempHp = character.tempHp,
            armorClass = character.armorClass,
            initiativeModifier = character.initiativeModifier,
            initiativeRoll = initRoll,
            passivePerception = character.passivePerception,
            speed = character.speed,
            spellDc = character.spellDc,
            notes = character.notes,
            abilitiesAndFeats = character.abilitiesAndFeats.ifBlank { character.notes }
        )
        _encounterState.update { current ->
            // Prevent duplicate of the same PC
            val filtered = current.combatants.filterNot { it.characterId == character.id }
            val updated = filtered + combatant
            val sorted = if (current.isCombatStarted) sortCombatants(updated) else updated
            current.copy(combatants = sorted)
        }
        logEvent("Added ${character.name} to encounter", LogType.INFO)
    }

    fun addAllPartyToEncounter() {
        val currentParty = characters.value
        currentParty.forEach { pc ->
            addPlayerToEncounter(pc, rollInit = false, manualInit = 0)
        }
        logEvent("Added party to encounter (enter initiatives when ready)", LogType.INFO)
    }

    fun addEnemyToEncounter(
        name: String,
        hp: Int,
        ac: Int,
        initMod: Int,
        count: Int = 1,
        rollInit: Boolean = true,
        cr: String = "",
        notes: String = "",
        speed: Int = 30,
        spellDc: Int? = null
    ) {
        val newCombatants = mutableListOf<Combatant>()
        for (i in 1..count) {
            val enemyName = if (count > 1) "$name #$i" else name
            val initScore = if (rollInit) rollD20() + initMod else (10 + initMod)
            newCombatants.add(
                Combatant(
                    name = enemyName,
                    isPlayer = false,
                    characterClassOrType = if (cr.isNotBlank()) "Enemy ($cr)" else "Enemy",
                    maxHp = hp,
                    currentHp = hp,
                    tempHp = 0,
                    armorClass = ac,
                    initiativeModifier = initMod,
                    initiativeRoll = initScore,
                    speed = speed,
                    spellDc = spellDc,
                    notes = notes,
                    abilitiesAndFeats = notes
                )
            )
        }
        _encounterState.update { current ->
            val updated = current.combatants + newCombatants
            val sorted = if (current.isCombatStarted) sortCombatants(updated) else updated
            current.copy(combatants = sorted)
        }
        logEvent("Added ${if (count > 1) "$count x $name" else name} to encounter", LogType.INFO)
    }

    fun addMonsterPreset(preset: MonsterPreset, count: Int = 1, rollInit: Boolean = true) {
        addEnemyToEncounter(
            name = preset.name,
            hp = preset.maxHp,
            ac = preset.armorClass,
            initMod = preset.initiativeModifier,
            count = count,
            rollInit = rollInit,
            cr = preset.cr,
            notes = preset.notes,
            speed = preset.speed,
            spellDc = preset.spellDc
        )
    }

    fun removeCombatant(id: String) {
        _encounterState.update { current ->
            val combatant = current.combatants.find { it.id == id }
            val filtered = current.combatants.filterNot { it.id == id }
            val nextTurnIndex = if (filtered.isEmpty()) 0 else current.currentTurnIndex.coerceIn(0, filtered.size - 1)
            combatant?.let { logEvent("Removed ${it.name} from combat", LogType.INFO) }
            current.copy(
                combatants = filtered,
                currentTurnIndex = nextTurnIndex
            )
        }
    }

    fun clearEncounter() {
        _encounterState.value = EncounterState()
        logEvent("Encounter reset", LogType.INFO)
    }

    fun setInitiative(combatantId: String, score: Int) {
        _encounterState.update { current ->
            val currentActiveId = current.activeCombatant?.id
            val updated = current.combatants.map {
                if (it.id == combatantId) it.copy(initiativeRoll = score) else it
            }
            val sorted = if (current.isCombatStarted) sortCombatants(updated) else updated
            val newActiveIndex = if (current.isCombatStarted && currentActiveId != null) {
                val idx = sorted.indexOfFirst { it.id == currentActiveId }
                if (idx >= 0) idx else current.currentTurnIndex
            } else current.currentTurnIndex

            current.copy(combatants = sorted, currentTurnIndex = newActiveIndex)
        }
        val targetName = _encounterState.value.combatants.find { it.id == combatantId }?.name ?: "Combatant"
        logEvent("Set $targetName initiative to $score", LogType.INFO)
    }

    fun setMultipleInitiatives(initiativeMap: Map<String, Int>) {
        _encounterState.update { current ->
            val currentActiveId = current.activeCombatant?.id
            val updated = current.combatants.map { combatant ->
                val newScore = initiativeMap[combatant.id]
                if (newScore != null) combatant.copy(initiativeRoll = newScore) else combatant
            }
            val sorted = if (current.isCombatStarted) sortCombatants(updated) else updated
            val newActiveIndex = if (current.isCombatStarted && currentActiveId != null) {
                val idx = sorted.indexOfFirst { it.id == currentActiveId }
                if (idx >= 0) idx else current.currentTurnIndex
            } else current.currentTurnIndex

            current.copy(combatants = sorted, currentTurnIndex = newActiveIndex)
        }
        logEvent("Applied party initiative rolls", LogType.INFO)
    }

    fun rollMonstersInitiative() {
        _encounterState.update { current ->
            val currentActiveId = current.activeCombatant?.id
            val updated = current.combatants.map { combatant ->
                if (!combatant.isPlayer) {
                    combatant.copy(initiativeRoll = rollD20() + combatant.initiativeModifier)
                } else combatant
            }
            val sorted = if (current.isCombatStarted) sortCombatants(updated) else updated
            val newActiveIndex = if (current.isCombatStarted && currentActiveId != null) {
                val idx = sorted.indexOfFirst { it.id == currentActiveId }
                if (idx >= 0) idx else current.currentTurnIndex
            } else current.currentTurnIndex

            current.copy(combatants = sorted, currentTurnIndex = newActiveIndex)
        }
        logEvent("Rolled initiative for all monsters", LogType.INFO)
    }

    fun rerollAllInitiatives() {
        _encounterState.update { current ->
            val rerolled = current.combatants.map {
                it.copy(initiativeRoll = rollD20() + it.initiativeModifier)
            }
            val sorted = sortCombatants(rerolled)
            current.copy(combatants = sorted, currentTurnIndex = 0)
        }
        logEvent("Rerolled initiative for all combatants", LogType.INFO)
    }

    fun startCombat(autoRollMonsters: Boolean = true) {
        _encounterState.update { current ->
            if (current.combatants.isEmpty()) return@update current
            // Automatically roll initiative for monsters, keeping player rolls intact
            val updated = current.combatants.map { combatant ->
                if (!combatant.isPlayer && autoRollMonsters) {
                    combatant.copy(initiativeRoll = rollD20() + combatant.initiativeModifier)
                } else {
                    combatant
                }
            }
            val sorted = sortCombatants(updated)
            val firstLivingIdx = sorted.indexOfFirst { !it.isDead }.let { if (it >= 0) it else 0 }
            current.copy(
                round = 1,
                currentTurnIndex = firstLivingIdx,
                combatants = sorted,
                isCombatStarted = true
            )
        }
        val firstActor = _encounterState.value.activeCombatant?.name ?: "Unknown"
        logEvent("⚔️ Combat Started! Monsters rolled initiative. Round 1: $firstActor's turn.", LogType.TURN)
    }

    fun nextTurn() {
        _encounterState.update { current ->
            if (current.combatants.isEmpty()) return@update current
            val total = current.combatants.size
            val hasLiving = current.combatants.any { !it.isDead }
            if (!hasLiving) return@update current

            var nextIndex = current.currentTurnIndex
            var nextRound = current.round
            var attempts = 0

            do {
                nextIndex++
                if (nextIndex >= total) {
                    nextIndex = 0
                    nextRound++
                    logEvent("🛡️ Round $nextRound begins!", LogType.TURN)
                }
                attempts++
            } while (current.combatants[nextIndex].isDead && attempts < total)

            val nextActor = current.combatants.getOrNull(nextIndex)
            if (nextActor != null && !nextActor.isDead) {
                logEvent("Turn passed to ${nextActor.name}", LogType.TURN)
            }

            current.copy(
                round = nextRound,
                currentTurnIndex = nextIndex
            )
        }
    }

    fun previousTurn() {
        _encounterState.update { current ->
            if (current.combatants.isEmpty()) return@update current
            val total = current.combatants.size
            val hasLiving = current.combatants.any { !it.isDead }
            if (!hasLiving) return@update current

            var prevIndex = current.currentTurnIndex
            var prevRound = current.round
            var attempts = 0

            do {
                prevIndex--
                if (prevIndex < 0) {
                    if (prevRound > 1) {
                        prevRound--
                        prevIndex = total - 1
                    } else {
                        prevIndex = 0
                        break
                    }
                }
                attempts++
            } while (current.combatants[prevIndex].isDead && attempts < total)

            current.copy(
                round = prevRound,
                currentTurnIndex = prevIndex
            )
        }
    }

    fun endCombat() {
        _encounterState.update { current ->
            current.copy(isCombatStarted = false)
        }
        logEvent("🏁 Combat ended.", LogType.INFO)
    }

    // --- Damage, Healing, Temp HP ---
    fun applyDamage(combatantId: String, amount: Int) {
        if (amount <= 0) return
        var targetName = ""
        var wasPlayer = false
        var newCurrentHp = 0
        var charId: Long? = null

        _encounterState.update { current ->
            val updated = current.combatants.map { c ->
                if (c.id == combatantId) {
                    targetName = c.name
                    wasPlayer = c.isPlayer
                    charId = c.characterId

                    var damageRemaining = amount
                    var currentTemp = c.tempHp
                    if (currentTemp > 0) {
                        if (damageRemaining <= currentTemp) {
                            currentTemp -= damageRemaining
                            damageRemaining = 0
                        } else {
                            damageRemaining -= currentTemp
                            currentTemp = 0
                        }
                    }

                    val afterHp = (c.currentHp - damageRemaining).coerceAtLeast(0)
                    newCurrentHp = afterHp

                    // Check if player took damage at 0 HP -> automatic failed death save
                    var fails = c.deathSavesFailure
                    var isDead = c.isDead
                    var isStabilized = c.isStabilized
                    val conditions = c.conditions.toMutableSet()

                    if (c.isPlayer && c.currentHp == 0 && afterHp == 0) {
                        fails = (fails + 1).coerceAtMost(3)
                        isStabilized = false
                        if (fails >= 3) {
                            isDead = true
                            conditions.add(Condition.DEAD)
                        }
                    }

                    c.copy(
                        currentHp = afterHp,
                        tempHp = currentTemp,
                        deathSavesFailure = fails,
                        isStabilized = isStabilized,
                        isDead = isDead,
                        conditions = conditions
                    )
                } else c
            }
            current.copy(combatants = updated)
        }

        // Sync HP back to character database if player
        charId?.let { id ->
            viewModelScope.launch {
                val pc = repository.getCharacterById(id)
                pc?.let { repository.update(it.copy(currentHp = newCurrentHp)) }
            }
        }

        logEvent("$targetName took $amount damage! (HP: $newCurrentHp)", LogType.DAMAGE)
        if (newCurrentHp == 0) {
            logEvent("💀 $targetName dropped to 0 HP!", LogType.DEATH)
        }
    }

    fun applyHealing(combatantId: String, amount: Int) {
        if (amount <= 0) return
        var targetName = ""
        var newCurrentHp = 0
        var charId = null as Long?

        _encounterState.update { current ->
            val updated = current.combatants.map { c ->
                if (c.id == combatantId) {
                    targetName = c.name
                    charId = c.characterId
                    val healed = (c.currentHp + amount).coerceAtMost(c.maxHp)
                    newCurrentHp = healed
                    // Reset death saves and revive/wake up when healed above 0
                    val conditions = if (healed > 0) c.conditions - Condition.DEAD - Condition.UNCONSCIOUS else c.conditions
                    c.copy(
                        currentHp = healed,
                        deathSavesSuccess = if (healed > 0) 0 else c.deathSavesSuccess,
                        deathSavesFailure = if (healed > 0) 0 else c.deathSavesFailure,
                        isStabilized = if (healed > 0) false else c.isStabilized,
                        isDead = if (healed > 0) false else c.isDead,
                        conditions = conditions
                    )
                } else c
            }
            current.copy(combatants = updated)
        }

        charId?.let { id ->
            viewModelScope.launch {
                val pc = repository.getCharacterById(id)
                pc?.let { repository.update(it.copy(currentHp = newCurrentHp)) }
            }
        }

        logEvent("✨ $targetName healed $amount HP! (HP: $newCurrentHp)", LogType.HEAL)
    }

    fun setTempHp(combatantId: String, amount: Int) {
        var targetName = ""
        _encounterState.update { current ->
            val updated = current.combatants.map { c ->
                if (c.id == combatantId) {
                    targetName = c.name
                    c.copy(tempHp = amount.coerceAtLeast(0))
                } else c
            }
            current.copy(combatants = updated)
        }
        logEvent("$targetName gained $amount Temp HP", LogType.INFO)
    }

    fun setCurrentHpDirect(combatantId: String, newHp: Int) {
        var targetName = ""
        var charId: Long? = null
        var finalHp = 0

        _encounterState.update { current ->
            val updated = current.combatants.map { c ->
                if (c.id == combatantId) {
                    targetName = c.name
                    charId = c.characterId
                    finalHp = newHp.coerceIn(0, c.maxHp)
                    c.copy(
                        currentHp = finalHp,
                        deathSavesSuccess = if (finalHp > 0) 0 else c.deathSavesSuccess,
                        deathSavesFailure = if (finalHp > 0) 0 else c.deathSavesFailure
                    )
                } else c
            }
            current.copy(combatants = updated)
        }

        charId?.let { id ->
            viewModelScope.launch {
                val pc = repository.getCharacterById(id)
                pc?.let { repository.update(it.copy(currentHp = finalHp)) }
            }
        }

        logEvent("Set $targetName HP to $finalHp", LogType.INFO)
    }

    // --- Conditions ---
    fun toggleCondition(combatantId: String, condition: Condition) {
        var targetName = ""
        var added = false
        _encounterState.update { current ->
            val updated = current.combatants.map { c ->
                if (c.id == combatantId) {
                    targetName = c.name
                    val conditions = c.conditions.toMutableSet()
                    var newSpeed = c.speed
                    var newIsDiff = c.isDifficultTerrain
                    var newAc = c.armorClass
                    var newCover = c.coverType

                    if (conditions.contains(condition)) {
                        conditions.remove(condition)
                        added = false
                        when (condition) {
                            Condition.DIFFICULT_TERRAIN -> {
                                newIsDiff = false
                                newSpeed = c.baseSpeed
                            }
                            Condition.HALF_COVER, Condition.THREE_QUARTERS_COVER, Condition.TOTAL_COVER -> {
                                newCover = CoverType.NONE
                                newAc = c.baseArmorClass
                            }
                            else -> {}
                        }
                    } else {
                        conditions.add(condition)
                        added = true
                        when (condition) {
                            Condition.DIFFICULT_TERRAIN -> {
                                newIsDiff = true
                                newSpeed = c.baseSpeed / 2
                            }
                            Condition.HALF_COVER -> {
                                conditions.remove(Condition.THREE_QUARTERS_COVER)
                                conditions.remove(Condition.TOTAL_COVER)
                                newCover = CoverType.HALF
                                newAc = c.baseArmorClass + 2
                            }
                            Condition.THREE_QUARTERS_COVER -> {
                                conditions.remove(Condition.HALF_COVER)
                                conditions.remove(Condition.TOTAL_COVER)
                                newCover = CoverType.THREE_QUARTERS
                                newAc = c.baseArmorClass + 5
                            }
                            Condition.TOTAL_COVER -> {
                                conditions.remove(Condition.HALF_COVER)
                                conditions.remove(Condition.THREE_QUARTERS_COVER)
                                newCover = CoverType.TOTAL
                                newAc = c.baseArmorClass + 10
                            }
                            else -> {}
                        }
                    }
                    c.copy(
                        conditions = conditions,
                        speed = newSpeed,
                        isDifficultTerrain = newIsDiff,
                        armorClass = newAc,
                        coverType = newCover
                    )
                } else c
            }
            current.copy(combatants = updated)
        }
        if (added) {
            logEvent("Applied ${condition.displayName} to $targetName", LogType.CONDITION)
        } else {
            logEvent("Removed ${condition.displayName} from $targetName", LogType.CONDITION)
        }
    }

    fun clearConditions(combatantId: String) {
        _encounterState.update { current ->
            val updated = current.combatants.map { c ->
                if (c.id == combatantId) {
                    c.copy(
                        conditions = emptySet(),
                        speed = c.baseSpeed,
                        isDifficultTerrain = false,
                        armorClass = c.baseArmorClass,
                        coverType = CoverType.NONE
                    )
                } else c
            }
            current.copy(combatants = updated)
        }
    }

    // --- Armor Class & Cover ---
    fun updateArmorClass(combatantId: String, newBaseAc: Int, coverType: CoverType) {
        var targetName = ""
        var totalAc = newBaseAc
        _encounterState.update { current ->
            val updated = current.combatants.map { c ->
                if (c.id == combatantId) {
                    targetName = c.name
                    val safeBaseAc = newBaseAc.coerceAtLeast(1)
                    val effectiveAc = safeBaseAc + coverType.acBonus
                    totalAc = effectiveAc
                    val conditions = c.conditions.toMutableSet()
                    conditions.remove(Condition.HALF_COVER)
                    conditions.remove(Condition.THREE_QUARTERS_COVER)
                    conditions.remove(Condition.TOTAL_COVER)
                    when (coverType) {
                        CoverType.HALF -> conditions.add(Condition.HALF_COVER)
                        CoverType.THREE_QUARTERS -> conditions.add(Condition.THREE_QUARTERS_COVER)
                        CoverType.TOTAL -> conditions.add(Condition.TOTAL_COVER)
                        CoverType.NONE -> { /* no cover */ }
                    }
                    c.copy(
                        armorClass = effectiveAc,
                        baseArmorClass = safeBaseAc,
                        coverType = coverType,
                        conditions = conditions
                    )
                } else c
            }
            current.copy(combatants = updated)
        }
        val coverNote = if (coverType != CoverType.NONE) " (${coverType.displayName})" else ""
        logEvent("Updated $targetName AC to $totalAc$coverNote", LogType.INFO)
    }

    // --- Movement Speed & Difficult Terrain ---
    fun updateSpeed(combatantId: String, newBaseSpeed: Int, isDifficultTerrain: Boolean) {
        var targetName = ""
        var totalSpeed = newBaseSpeed
        _encounterState.update { current ->
            val updated = current.combatants.map { c ->
                if (c.id == combatantId) {
                    targetName = c.name
                    val safeBaseSpeed = newBaseSpeed.coerceAtLeast(0)
                    val effectiveSpeed = if (isDifficultTerrain) (safeBaseSpeed / 2) else safeBaseSpeed
                    totalSpeed = effectiveSpeed
                    val conditions = c.conditions.toMutableSet()
                    if (isDifficultTerrain) {
                        conditions.add(Condition.DIFFICULT_TERRAIN)
                    } else {
                        conditions.remove(Condition.DIFFICULT_TERRAIN)
                    }
                    c.copy(
                        speed = effectiveSpeed,
                        baseSpeed = safeBaseSpeed,
                        isDifficultTerrain = isDifficultTerrain,
                        conditions = conditions
                    )
                } else c
            }
            current.copy(combatants = updated)
        }
        val terrainNote = if (isDifficultTerrain) " (Difficult Terrain halved from ${newBaseSpeed}ft)" else ""
        logEvent("Updated $targetName Speed to ${totalSpeed}ft$terrainNote", LogType.INFO)
    }

    // --- Death Saves ---
    fun recordDeathSave(combatantId: String, isSuccess: Boolean) {
        var targetName = ""
        var finalSuccesses = 0
        var finalFailures = 0
        var becameStabilized = false
        var becameDead = false

        _encounterState.update { current ->
            val updated = current.combatants.map { c ->
                if (c.id == combatantId) {
                    targetName = c.name
                    val succ = if (isSuccess) (c.deathSavesSuccess + 1).coerceAtMost(3) else c.deathSavesSuccess
                    val fail = if (!isSuccess) (c.deathSavesFailure + 1).coerceAtMost(3) else c.deathSavesFailure
                    finalSuccesses = succ
                    finalFailures = fail

                    val conditions = c.conditions.toMutableSet()
                    var isStabilized = c.isStabilized
                    var isDead = c.isDead

                    if (succ >= 3) {
                        isStabilized = true
                        becameStabilized = true
                        conditions.add(Condition.UNCONSCIOUS)
                    }
                    if (fail >= 3) {
                        isDead = true
                        becameDead = true
                        conditions.add(Condition.DEAD)
                    }

                    c.copy(
                        deathSavesSuccess = succ,
                        deathSavesFailure = fail,
                        isStabilized = isStabilized,
                        isDead = isDead,
                        conditions = conditions
                    )
                } else c
            }
            current.copy(combatants = updated)
        }

        if (isSuccess) {
            logEvent("💚 $targetName passed a Death Save ($finalSuccesses/3)", LogType.INFO)
            if (becameStabilized) {
                logEvent("🌟 $targetName has STABILIZED at 0 HP with the Unconscious condition!", LogType.HEAL)
            }
        } else {
            logEvent("💔 $targetName FAILED a Death Save ($finalFailures/3)", LogType.DAMAGE)
            if (becameDead) {
                logEvent("💀 $targetName has DIED (3 Failed Death Saves) and will be skipped in turn order!", LogType.DEATH)
            }
        }
    }

    fun resetDeathSaves(combatantId: String) {
        _encounterState.update { current ->
            val updated = current.combatants.map { c ->
                if (c.id == combatantId) c.copy(deathSavesSuccess = 0, deathSavesFailure = 0, isStabilized = false) else c
            }
            current.copy(combatants = updated)
        }
    }

    fun reviveCombatant(combatantId: String) {
        var targetName = ""
        _encounterState.update { current ->
            val updated = current.combatants.map { c ->
                if (c.id == combatantId) {
                    targetName = c.name
                    c.copy(
                        currentHp = 1,
                        isDead = false,
                        isStabilized = false,
                        deathSavesSuccess = 0,
                        deathSavesFailure = 0,
                        conditions = c.conditions - Condition.DEAD - Condition.UNCONSCIOUS
                    )
                } else c
            }
            current.copy(combatants = updated)
        }
        logEvent("✨ $targetName has been REVIVED with 1 HP!", LogType.HEAL)
    }

    // --- Dice Roller ---
    fun rollDice(sides: Int, count: Int = 1, modifier: Int = 0, rollMode: RollMode = RollMode.NORMAL) {
        val rolls = mutableListOf<Int>()
        var discarded: Int? = null

        if (sides == 20 && count == 1 && rollMode != RollMode.NORMAL) {
            val r1 = Random.nextInt(1, 21)
            val r2 = Random.nextInt(1, 21)
            val chosen = if (rollMode == RollMode.ADVANTAGE) maxOf(r1, r2) else minOf(r1, r2)
            discarded = if (rollMode == RollMode.ADVANTAGE) minOf(r1, r2) else maxOf(r1, r2)
            rolls.add(chosen)
        } else {
            for (i in 1..count) {
                rolls.add(Random.nextInt(1, sides + 1))
            }
        }

        val total = rolls.sum() + modifier
        val isNat20 = sides == 20 && rolls.contains(20)
        val isNat1 = sides == 20 && rolls.contains(1)

        val result = DiceRollResult(
            dice = "${count}d$sides",
            total = total,
            rolls = rolls,
            modifier = modifier,
            rollMode = rollMode,
            discardedRoll = discarded,
            isNat20 = isNat20,
            isNat1 = isNat1
        )

        _lastRoll.value = result
        _diceHistory.update { listOf(result) + it.take(25) }
    }

    private fun rollD20(): Int = Random.nextInt(1, 21)

    private fun sortCombatants(list: List<Combatant>): List<Combatant> {
        return list.sortedWith(
            compareByDescending<Combatant> { it.initiativeRoll }
                .thenByDescending { it.initiativeModifier }
                .thenBy { it.name }
        )
    }

    private fun logEvent(text: String, type: LogType) {
        _encounterState.update { current ->
            val entry = CombatLogEntry(
                round = current.round,
                text = text,
                type = type
            )
            current.copy(log = (listOf(entry) + current.log).take(50))
        }
    }
}
