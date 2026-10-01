package com.example.data.local

import androidx.room.Dao
import androidx.room.Delete
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Update
import com.example.data.model.PlayerCharacter
import kotlinx.coroutines.flow.Flow

@Dao
interface CharacterDao {
    @Query("SELECT * FROM player_characters ORDER BY name ASC")
    fun getAllCharacters(): Flow<List<PlayerCharacter>>

    @Query("SELECT * FROM player_characters WHERE id = :id LIMIT 1")
    suspend fun getCharacterById(id: Long): PlayerCharacter?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertCharacter(character: PlayerCharacter): Long

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertCharacters(characters: List<PlayerCharacter>)

    @Update
    suspend fun updateCharacter(character: PlayerCharacter)

    @Delete
    suspend fun deleteCharacter(character: PlayerCharacter)

    @Query("DELETE FROM player_characters WHERE id = :id")
    suspend fun deleteCharacterById(id: Long)

    @Query("SELECT COUNT(*) FROM player_characters")
    suspend fun getCount(): Int
}
