package com.example.data.model

import androidx.compose.ui.graphics.Color

enum class Condition(
    val displayName: String,
    val description: String,
    val badgeColor: Long
) {
    BLINDED(
        "Blinded",
        "Can't see and automatically fails checks requiring sight. Attacks against have advantage, attack rolls have disadvantage.",
        0xFF64748B
    ),
    CHARMED(
        "Charmed",
        "Can't attack the charmer. Charmer has advantage on social ability checks.",
        0xFFEC4899
    ),
    CONCENTRATING(
        "Concentrating",
        "Must make Con save (DC 10 or half damage) when taking damage to maintain spell.",
        0xFFA855F7
    ),
    DEAFENED(
        "Deafened",
        "Can't hear and automatically fails checks requiring hearing.",
        0xFF94A3B8
    ),
    EXHAUSTION(
        "Exhaustion",
        "Suffers penalties ranging from disadvantage to speed halving or death.",
        0xFFF97316
    ),
    FRIGHTENED(
        "Frightened",
        "Disadvantage on ability checks and attack rolls while source of fear is in sight. Can't willingly move closer.",
        0xFF8B5CF6
    ),
    GRAPPLED(
        "Grappled",
        "Speed becomes 0 and can't benefit from any bonuses to speed.",
        0xFFEAB308
    ),
    HASTE(
        "Haste",
        "Double speed, +2 AC, advantage on Dex saves, and an additional action each turn.",
        0xFF06B6D4
    ),
    INCAPACITATED(
        "Incapacitated",
        "Can't take actions or reactions.",
        0xFFEF4444
    ),
    INVISIBLE(
        "Invisible",
        "Impossible to see without magic or special senses. Attacks against have disadvantage, attack rolls have advantage.",
        0xFF38BDF8
    ),
    PARALYZED(
        "Paralyzed",
        "Incapacitated, can't move or speak. Auto-fails Str/Dex saves. Attacks against have advantage; melee attacks within 5ft are auto-crits.",
        0xFFDC2626
    ),
    PETRIFIED(
        "Petrified",
        "Transformed into solid stone. Incapacitated, unaware of surroundings, resistance to all damage.",
        0xFF78716C
    ),
    POISONED(
        "Poisoned",
        "Disadvantage on attack rolls and ability checks.",
        0xFF10B981
    ),
    PRONE(
        "Prone",
        "Only movement is crawling. Disadvantage on attack rolls. Attacks against within 5ft have advantage; ranged attacks have disadvantage.",
        0xFFD97706
    ),
    RESTRAINED(
        "Restrained",
        "Speed becomes 0. Attacks against have advantage, attack rolls have disadvantage. Disadvantage on Dex saves.",
        0xFFB45309
    ),
    STUNNED(
        "Stunned",
        "Incapacitated, can't move, speaks falteringly. Auto-fails Str/Dex saves. Attacks against have advantage.",
        0xFFF59E0B
    ),
    UNCONSCIOUS(
        "Unconscious",
        "Incapacitated, can't move/speak, unaware. Drops whatever holding, falls prone. Auto-fails Str/Dex saves. Attacks against have advantage and melee is auto-crit.",
        0xFF991B1B
    ),
    DEAD(
        "Dead",
        "💀 Character has died (3 failed death saves). Skipped in combat turn order until revived.",
        0xFF475569
    ),
    BLESSED(
        "Blessed",
        "Add 1d4 to attack rolls and saving throws.",
        0xFFFACC15
    ),
    BANE(
        "Bane",
        "Subtract 1d4 from attack rolls and saving throws.",
        0xFF7C3AED
    ),
    DIFFICULT_TERRAIN(
        "Difficult Terrain",
        "Moving through difficult terrain costs 1 extra foot per foot moved (halves movement speed).",
        0xFFD97706
    ),
    HALF_COVER(
        "Half Cover",
        "+2 bonus to AC and Dexterity saving throws.",
        0xFF3B82F6
    ),
    THREE_QUARTERS_COVER(
        "3/4 Cover",
        "+5 bonus to AC and Dexterity saving throws.",
        0xFF6366F1
    ),
    TOTAL_COVER(
        "Total Cover",
        "Completely concealed by an obstacle. Can't be targeted directly by attacks or spells.",
        0xFF8B5CF6
    );

    val color: Color get() = Color(badgeColor)
}
