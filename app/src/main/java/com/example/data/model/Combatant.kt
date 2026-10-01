package com.example.data.model

import java.util.UUID

data class Combatant(
    val id: String = UUID.randomUUID().toString(),
    val characterId: Long? = null,
    val name: String,
    val isPlayer: Boolean,
    val characterClassOrType: String = "",
    val maxHp: Int,
    val currentHp: Int,
    val tempHp: Int = 0,
    val armorClass: Int,
    val baseArmorClass: Int = armorClass,
    val coverType: CoverType = CoverType.NONE,
    val initiativeModifier: Int = 0,
    val initiativeRoll: Int = 0,
    val passivePerception: Int = 10,
    val speed: Int = 30,
    val baseSpeed: Int = speed,
    val isDifficultTerrain: Boolean = false,
    val spellDc: Int? = null,
    val notes: String = "",
    val abilitiesAndFeats: String = "",
    val conditions: Set<Condition> = emptySet(),
    val deathSavesSuccess: Int = 0,
    val deathSavesFailure: Int = 0,
    val isStabilized: Boolean = false,
    val isDead: Boolean = false
) {
    val isDeadOrDying: Boolean get() = currentHp <= 0
    val isDyingPlayer: Boolean get() = isPlayer && currentHp <= 0 && !isStabilized && !isDead && deathSavesFailure < 3 && deathSavesSuccess < 3
    val isDeadPlayer: Boolean get() = isPlayer && (isDead || deathSavesFailure >= 3)
    val isStabilizedPlayer: Boolean get() = isPlayer && currentHp <= 0 && (isStabilized || deathSavesSuccess >= 3)

    val hpPercentage: Float
        get() {
            if (maxHp <= 0) return 0f
            return (currentHp.coerceAtLeast(0).toFloat() / maxHp.toFloat()).coerceIn(0f, 1f)
        }
}
