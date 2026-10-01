package com.example.data.model

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "player_characters")
data class PlayerCharacter(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val name: String,
    val playerName: String = "",
    val characterClass: String = "Fighter",
    val level: Int = 1,
    val maxHp: Int = 10,
    val currentHp: Int = 10,
    val tempHp: Int = 0,
    val armorClass: Int = 10,
    val initiativeModifier: Int = 0,
    val passivePerception: Int = 10,
    val speed: Int = 30,
    val spellDc: Int? = null,
    val notes: String = "",
    val abilitiesAndFeats: String = "",
    val colorHex: Long = 0xFF3B82F6
)
