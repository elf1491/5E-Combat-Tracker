package com.example.data.repository

import com.example.data.local.CharacterDao
import com.example.data.model.PlayerCharacter
import kotlinx.coroutines.flow.Flow

class CharacterRepository(private val characterDao: CharacterDao) {
    val allCharacters: Flow<List<PlayerCharacter>> = characterDao.getAllCharacters()

    suspend fun getCharacterById(id: Long): PlayerCharacter? {
        return characterDao.getCharacterById(id)
    }

    suspend fun insert(character: PlayerCharacter): Long {
        return characterDao.insertCharacter(character)
    }

    suspend fun update(character: PlayerCharacter) {
        characterDao.updateCharacter(character)
    }

    suspend fun delete(character: PlayerCharacter) {
        characterDao.deleteCharacter(character)
    }

    suspend fun deleteById(id: Long) {
        characterDao.deleteCharacterById(id)
    }
}
