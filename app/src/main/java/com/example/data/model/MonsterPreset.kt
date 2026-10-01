package com.example.data.model

data class MonsterPreset(
    val name: String,
    val cr: String,
    val type: String,
    val maxHp: Int,
    val armorClass: Int,
    val initiativeModifier: Int,
    val speed: Int = 30,
    val passivePerception: Int = 10,
    val spellDc: Int? = null,
    val notes: String = ""
)

object MonsterPresets {
    val list = listOf(
        MonsterPreset("Bandit", "CR 1/8", "Humanoid", 11, 12, 1, 30, 10, null, "Scimitar +3 (1d6+1), Light Crossbow"),
        MonsterPreset("Cultist", "CR 1/8", "Humanoid", 9, 12, 1, 30, 10, null, "Dark Devotion (adv vs charm/fright)"),
        MonsterPreset("Goblin", "CR 1/4", "Humanoid", 7, 15, 2, 30, 9, null, "Nimble Escape: Disengage or Hide as bonus action"),
        MonsterPreset("Skeleton", "CR 1/4", "Undead", 13, 13, 2, 30, 9, null, "Vulnerable to bludgeoning, immune to poison"),
        MonsterPreset("Zombie", "CR 1/4", "Undead", 22, 8, -2, 20, 8, null, "Undead Fortitude (Con save to drop to 1 HP)"),
        MonsterPreset("Wolf", "CR 1/4", "Beast", 11, 13, 2, 40, 13, null, "Pack Tactics (adv if ally within 5ft), Keen Hearing/Smell"),
        MonsterPreset("Orc", "CR 1/2", "Humanoid", 15, 13, 1, 30, 10, null, "Aggressive: Bonus action move up to speed toward enemy"),
        MonsterPreset("Hobgoblin", "CR 1/2", "Humanoid", 11, 18, 1, 30, 10, null, "Martial Advantage (+2d6 damage if ally within 5ft)"),
        MonsterPreset("Bugbear", "CR 1", "Humanoid", 27, 16, 2, 30, 10, null, "Surprise Attack (+2d6), Brute (+1 die melee)"),
        MonsterPreset("Ghoul", "CR 1", "Undead", 22, 12, 2, 30, 10, null, "Claws: DC 10 Con save or paralyzed for 1 min"),
        MonsterPreset("Bandit Captain", "CR 2", "Humanoid", 65, 15, 3, 30, 14, null, "Multiattack (3 melee), Parry reaction (+2 AC)"),
        MonsterPreset("Cult Fanatic", "CR 2", "Humanoid", 33, 13, 2, 30, 11, 11, "Spellcaster: Hold Person, Spiritual Weapon"),
        MonsterPreset("Ogre", "CR 2", "Giant", 59, 11, -1, 40, 8, null, "Greatclub +6 (2d8+4)"),
        MonsterPreset("Wight", "CR 3", "Undead", 45, 14, 2, 30, 13, null, "Life Drain (reduces max HP on failed Con save)"),
        MonsterPreset("Troll", "CR 5", "Giant", 84, 15, 1, 30, 12, null, "Regeneration 10 HP per turn unless fire/acid damage"),
        MonsterPreset("Vampire Spawn", "CR 5", "Undead", 82, 15, 3, 30, 13, null, "Regeneration 10 HP, Spider Climb, Bite attack"),
        MonsterPreset("Mage", "CR 6", "Humanoid", 40, 15, 2, 30, 11, 14, "Spells: Fireball, Greater Invisibility, Shield"),
        MonsterPreset("Young Red Dragon", "CR 10", "Dragon", 178, 18, 0, 40, 18, 17, "Fire Breath (16d6 fire, DC 17 Dex), Fly 80ft"),
        MonsterPreset("Beholder", "CR 13", "Aberration", 180, 18, 2, 20, 22, 16, "Antimagic Cone, 3 random Eye Rays per turn"),
        MonsterPreset("Lich", "CR 21", "Undead", 135, 17, 3, 30, 19, 20, "Legendary Actions, Power Word Kill, Disrupt Life")
    )
}
