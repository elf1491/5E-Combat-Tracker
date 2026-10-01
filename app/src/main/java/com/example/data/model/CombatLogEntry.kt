package com.example.data.model

data class CombatLogEntry(
    val round: Int,
    val text: String,
    val type: LogType,
    val timestamp: Long = System.currentTimeMillis()
)

enum class LogType {
    INFO,
    DAMAGE,
    HEAL,
    TURN,
    CONDITION,
    DEATH
}
