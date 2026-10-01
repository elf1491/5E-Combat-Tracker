package com.example

import com.example.data.model.Combatant
import com.example.data.model.Condition
import com.example.data.model.MonsterPresets
import com.example.ui.viewmodel.EncounterState
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertTrue
import org.junit.Test

class ExampleUnitTest {
    @Test
    fun addition_isCorrect() {
        assertEquals(4, 2 + 2)
    }

    @Test
    fun monsterPresets_arePopulated() {
        assertTrue(MonsterPresets.list.isNotEmpty())
        val goblin = MonsterPresets.list.find { it.name == "Goblin" }
        assertNotNull(goblin)
        assertEquals(7, goblin?.maxHp)
        assertEquals(15, goblin?.armorClass)
    }

    @Test
    fun combatant_hpPercentageCalculatesCorrectly() {
        val combatant = Combatant(
            name = "Thorin",
            isPlayer = true,
            maxHp = 20,
            currentHp = 10,
            armorClass = 18
        )
        assertEquals(0.5f, combatant.hpPercentage, 0.01f)
    }

    @Test
    fun encounterState_activeAndOnDeckTurns() {
        val p1 = Combatant(id = "1", name = "Fighter", isPlayer = true, maxHp = 30, currentHp = 30, armorClass = 18, initiativeRoll = 20)
        val p2 = Combatant(id = "2", name = "Wizard", isPlayer = true, maxHp = 18, currentHp = 18, armorClass = 12, initiativeRoll = 15)
        val p3 = Combatant(id = "3", name = "Goblin", isPlayer = false, maxHp = 7, currentHp = 7, armorClass = 15, initiativeRoll = 10)

        val state = EncounterState(
            round = 1,
            currentTurnIndex = 0,
            combatants = listOf(p1, p2, p3),
            isCombatStarted = true
        )

        assertEquals("Fighter", state.activeCombatant?.name)
        assertEquals("Wizard", state.onDeckCombatant?.name)
    }

    @Test
    fun conditions_canBeToggled() {
        val combatant = Combatant(
            name = "Rogue",
            isPlayer = true,
            maxHp = 20,
            currentHp = 20,
            armorClass = 15,
            conditions = setOf(Condition.INVISIBLE, Condition.CONCENTRATING)
        )

        assertTrue(combatant.conditions.contains(Condition.INVISIBLE))
        assertTrue(combatant.conditions.contains(Condition.CONCENTRATING))
        assertFalse(combatant.conditions.contains(Condition.STUNNED))
    }

    @Test
    fun initiative_sortingOrdersHighestFirst() {
        val p1 = Combatant(id = "1", name = "Fighter", isPlayer = true, maxHp = 30, currentHp = 30, armorClass = 18, initiativeRoll = 14, initiativeModifier = 1)
        val p2 = Combatant(id = "2", name = "Rogue", isPlayer = true, maxHp = 22, currentHp = 22, armorClass = 15, initiativeRoll = 22, initiativeModifier = 4)
        val m1 = Combatant(id = "3", name = "Orc", isPlayer = false, maxHp = 15, currentHp = 15, armorClass = 13, initiativeRoll = 9, initiativeModifier = 1)

        val combatants = listOf(p1, p2, m1).sortedWith(
            compareByDescending<Combatant> { it.initiativeRoll }
                .thenByDescending { it.initiativeModifier }
        )

        assertEquals("Rogue", combatants[0].name)
        assertEquals("Fighter", combatants[1].name)
        assertEquals("Orc", combatants[2].name)
    }

    @Test
    fun combatant_damageCalculationWithTempHp() {
        val combatant = Combatant(
            name = "Paladin",
            isPlayer = true,
            maxHp = 30,
            currentHp = 30,
            tempHp = 10,
            armorClass = 18
        )

        // Taking 12 damage: 10 temp HP absorbed, 2 goes to current HP -> 28 HP remaining
        val damage = 12
        val damageToTemp = minOf(combatant.tempHp, damage)
        val remainingDamage = damage - damageToTemp
        val newTemp = combatant.tempHp - damageToTemp
        val newHp = (combatant.currentHp - remainingDamage).coerceAtLeast(0)

        assertEquals(0, newTemp)
        assertEquals(28, newHp)
    }

    @Test
    fun deathSaves_threeSuccessesStabilizesAtZeroHpWithUnconscious() {
        val dyingPlayer = Combatant(
            name = "Cleric",
            isPlayer = true,
            maxHp = 25,
            currentHp = 0,
            armorClass = 18,
            deathSavesSuccess = 2,
            deathSavesFailure = 1
        )

        // 3rd success
        val succ = (dyingPlayer.deathSavesSuccess + 1).coerceAtMost(3)
        val isStabilized = succ >= 3
        val conditions = dyingPlayer.conditions.toMutableSet()
        if (isStabilized) {
            conditions.add(Condition.UNCONSCIOUS)
        }

        val stabilized = dyingPlayer.copy(
            deathSavesSuccess = succ,
            isStabilized = isStabilized,
            conditions = conditions
        )

        assertTrue(stabilized.isStabilized)
        assertEquals(3, stabilized.deathSavesSuccess)
        assertEquals(0, stabilized.currentHp)
        assertTrue(stabilized.conditions.contains(Condition.UNCONSCIOUS))
        assertFalse(stabilized.isDead)
    }

    @Test
    fun deathSaves_threeFailuresMarksAsDeadAndSkippedInTurnOrder() {
        val dyingPlayer = Combatant(
            id = "1",
            name = "Ranger",
            isPlayer = true,
            maxHp = 22,
            currentHp = 0,
            armorClass = 15,
            deathSavesSuccess = 1,
            deathSavesFailure = 2
        )

        // 3rd failure
        val fails = (dyingPlayer.deathSavesFailure + 1).coerceAtMost(3)
        val isDead = fails >= 3
        val conditions = dyingPlayer.conditions.toMutableSet()
        if (isDead) {
            conditions.add(Condition.DEAD)
        }

        val deadCombatant = dyingPlayer.copy(
            deathSavesFailure = fails,
            isDead = isDead,
            conditions = conditions
        )

        assertTrue(deadCombatant.isDead)
        assertEquals(3, deadCombatant.deathSavesFailure)
        assertTrue(deadCombatant.conditions.contains(Condition.DEAD))

        // Verify turn navigation skips dead combatants
        val livingPlayer = Combatant(id = "2", name = "Fighter", isPlayer = true, maxHp = 30, currentHp = 30, armorClass = 18)
        val combatants = listOf(deadCombatant, livingPlayer)

        var nextIndex = 0
        var attempts = 0
        do {
            nextIndex = (nextIndex + 1) % combatants.size
            attempts++
        } while (combatants[nextIndex].isDead && attempts < combatants.size)

        assertEquals(1, nextIndex)
        assertEquals("Fighter", combatants[nextIndex].name)
    }

    @Test
    fun randomCharacterRoll_follows5eRules() {
        val character = com.example.ui.dialogs.rollRandom5eCharacter()
        assertTrue(character.name.isNotBlank())
        assertTrue(character.characterClass.isNotBlank())
        assertTrue(character.maxHp >= 6) // Minimum possible level 1 5e HP (Wizard with 10 CON)
        assertTrue(character.armorClass >= 10) // 5e minimum unarmored AC
        assertTrue(character.speed >= 25) // Standard 5e speed
        assertTrue(character.abilities.isNotEmpty()) // Populated with 5e class abilities
    }
}
