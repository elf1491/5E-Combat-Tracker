package com.example.ui.viewmodel

import com.example.data.model.CombatLogEntry
import com.example.data.model.Combatant

data class EncounterState(
    val round: Int = 1,
    val currentTurnIndex: Int = 0,
    val combatants: List<Combatant> = emptyList(),
    val isCombatStarted: Boolean = false,
    val log: List<CombatLogEntry> = emptyList()
) {
    val activeCombatant: Combatant?
        get() = if (combatants.isNotEmpty() && currentTurnIndex in combatants.indices) {
            combatants[currentTurnIndex]
        } else null

    val onDeckCombatant: Combatant?
        get() {
            if (combatants.size <= 1 || currentTurnIndex !in combatants.indices) return null
            val total = combatants.size
            for (offset in 1 until total) {
                val candidate = combatants[(currentTurnIndex + offset) % total]
                if (!candidate.isDead) return candidate
            }
            return null
        }

    val playerCount: Int get() = combatants.count { it.isPlayer }
    val enemyCount: Int get() = combatants.count { !it.isPlayer }
}

enum class RollMode {
    NORMAL,
    ADVANTAGE,
    DISADVANTAGE
}

data class DiceRollResult(
    val dice: String,
    val total: Int,
    val rolls: List<Int>,
    val modifier: Int,
    val rollMode: RollMode = RollMode.NORMAL,
    val discardedRoll: Int? = null,
    val isNat20: Boolean = false,
    val isNat1: Boolean = false,
    val timestamp: Long = System.currentTimeMillis()
)
