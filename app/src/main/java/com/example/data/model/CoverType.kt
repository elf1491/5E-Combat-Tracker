package com.example.data.model

enum class CoverType(val displayName: String, val acBonus: Int) {
    NONE("No Cover", 0),
    HALF("Half Cover (+2 AC)", 2),
    THREE_QUARTERS("3/4 Cover (+5 AC)", 5),
    TOTAL("Total Cover (+10 AC)", 10)
}
