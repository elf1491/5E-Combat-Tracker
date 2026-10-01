package com.example.data.local

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import androidx.sqlite.db.SupportSQLiteDatabase
import com.example.data.model.PlayerCharacter
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

@Database(entities = [PlayerCharacter::class], version = 2, exportSchema = false)
abstract class AppDatabase : RoomDatabase() {
    abstract fun characterDao(): CharacterDao

    companion object {
        @Volatile
        private var INSTANCE: AppDatabase? = null

        fun getDatabase(context: Context, scope: CoroutineScope): AppDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    AppDatabase::class.java,
                    "dnd_combat_tracker_db"
                )
                    .fallbackToDestructiveMigration()
                    .addCallback(DatabaseCallback(scope))
                    .build()
                INSTANCE = instance
                instance
            }
        }

        private class DatabaseCallback(
            private val scope: CoroutineScope
        ) : RoomDatabase.Callback() {
            override fun onCreate(db: SupportSQLiteDatabase) {
                super.onCreate(db)
                INSTANCE?.let { database ->
                    scope.launch(Dispatchers.IO) {
                        prepopulateStarterParty(database.characterDao())
                    }
                }
            }

            suspend fun prepopulateStarterParty(dao: CharacterDao) {
                if (dao.getCount() == 0) {
                    val starterParty = listOf(
                        PlayerCharacter(
                            name = "Thorin Ironbreaker",
                            playerName = "Dave",
                            characterClass = "Fighter (Champion)",
                            level = 3,
                            maxHp = 28,
                            currentHp = 28,
                            tempHp = 0,
                            armorClass = 18,
                            initiativeModifier = 1,
                            passivePerception = 11,
                            speed = 25,
                            spellDc = null,
                            notes = "Heavy armor master, dwarven resilience vs poison",
                            abilitiesAndFeats = "Action Surge (Extra action 1/short rest)\nSecond Wind (Bonus Action: heal 1d10+3 HP)\nImproved Critical (Crit on 19 or 20)\nGreat Weapon Master (-5 to hit / +10 damage)",
                            colorHex = 0xFFEF4444
                        ),
                        PlayerCharacter(
                            name = "Elara Moonwhisper",
                            playerName = "Alice",
                            characterClass = "Wizard (Evoker)",
                            level = 3,
                            maxHp = 18,
                            currentHp = 18,
                            tempHp = 0,
                            armorClass = 12,
                            initiativeModifier = 2,
                            passivePerception = 13,
                            speed = 30,
                            spellDc = 14,
                            notes = "High intelligence spellcaster",
                            abilitiesAndFeats = "Sculpt Spells (Allies auto-succeed AoE saves & take no damage)\nArcane Recovery (Regain spell slots on short rest)\nShield Spell (Reaction: +5 AC)\nMisty Step (Bonus Action: 30ft teleport)",
                            colorHex = 0xFFA855F7
                        ),
                        PlayerCharacter(
                            name = "Lyra Swiftfoot",
                            playerName = "Sam",
                            characterClass = "Rogue (Thief)",
                            level = 3,
                            maxHp = 21,
                            currentHp = 21,
                            tempHp = 0,
                            armorClass = 15,
                            initiativeModifier = 3,
                            passivePerception = 15,
                            speed = 30,
                            spellDc = null,
                            notes = "Expert in stealth and lockpicking",
                            abilitiesAndFeats = "Sneak Attack (+2d6 damage with advantage or ally in 5ft)\nCunning Action (Bonus Action: Dash, Disengage, or Hide)\nFast Hands (Bonus Action: Sleight of Hand / Use Object)\nSecond-Story Work (Climbing doesn't cost extra movement)",
                            colorHex = 0xFF10B981
                        ),
                        PlayerCharacter(
                            name = "Brother Cedric",
                            playerName = "Chris",
                            characterClass = "Cleric (Life Domain)",
                            level = 3,
                            maxHp = 24,
                            currentHp = 24,
                            tempHp = 0,
                            armorClass = 18,
                            initiativeModifier = 0,
                            passivePerception = 14,
                            speed = 30,
                            spellDc = 13,
                            notes = "Devoted healer and frontline divine caster",
                            abilitiesAndFeats = "Disciple of Life (+2 + spell level bonus healing on healing spells)\nChannel Divinity: Preserve Life (Action: heal up to 15 HP to allies below half)\nHealing Word (Bonus Action: 60ft ranged heal)\nSpiritual Weapon (Bonus Action: 1d8+3 force attack)",
                            colorHex = 0xFFF59E0B
                        )
                    )
                    dao.insertCharacters(starterParty)
                }
            }
        }
    }
}
