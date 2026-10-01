package com.example.ui.dialogs

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.ArrowDropDown
import androidx.compose.material.icons.filled.ArrowDropUp
import androidx.compose.material.icons.filled.Casino
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.model.PlayerCharacter
import com.example.ui.theme.BloodiedRed
import com.example.ui.theme.DndGold
import com.example.ui.theme.DungeonBorder
import com.example.ui.theme.DungeonCard
import com.example.ui.theme.DungeonCardElevated
import com.example.ui.theme.HealthGreen
import com.example.ui.theme.ParchmentMuted
import com.example.ui.theme.ParchmentWhite
import com.example.ui.theme.PlayerShieldBlue
import java.util.UUID
import kotlin.random.Random

data class CharacterAbilityItem(
    val id: String = UUID.randomUUID().toString(),
    var name: String = "",
    var type: String = "Action",
    var description: String = ""
)

private val ACTION_TYPES = listOf("Action", "Bonus Action", "Reaction", "Feat / Trait", "Spell")

private val OFFICIAL_5E_CLASSES = listOf(
    "Barbarian", "Bard", "Cleric", "Druid", "Fighter",
    "Monk", "Paladin", "Ranger", "Rogue", "Sorcerer",
    "Warlock", "Wizard", "Artificer"
)

@Composable
fun AddCharacterDialog(
    characterToEdit: PlayerCharacter? = null,
    onDismiss: () -> Unit,
    onSave: (PlayerCharacter) -> Unit
) {
    var name by remember { mutableStateOf(characterToEdit?.name ?: "") }
    var playerName by remember { mutableStateOf(characterToEdit?.playerName ?: "") }
    var selectedClass by remember { mutableStateOf(characterToEdit?.characterClass ?: "Fighter") }
    var levelText by remember { mutableStateOf((characterToEdit?.level ?: 1).toString()) }
    var maxHpText by remember { mutableStateOf((characterToEdit?.maxHp ?: 12).toString()) }
    var acText by remember { mutableStateOf((characterToEdit?.armorClass ?: 14).toString()) }
    var initModText by remember { mutableStateOf((characterToEdit?.initiativeModifier ?: 0).toString()) }
    var passivePercText by remember { mutableStateOf((characterToEdit?.passivePerception ?: 10).toString()) }
    var speedText by remember { mutableStateOf((characterToEdit?.speed ?: 30).toString()) }
    var spellDcText by remember { mutableStateOf(characterToEdit?.spellDc?.toString() ?: "") }
    var notes by remember { mutableStateOf(characterToEdit?.notes ?: "") }

    var isClassDropdownExpanded by remember { mutableStateOf(false) }

    // Parse separate items for abilities & feats
    var abilityItems by remember {
        val initialText = characterToEdit?.abilitiesAndFeats?.ifBlank { characterToEdit.notes } ?: ""
        val parsed = parseExistingAbilities(initialText)
        mutableStateOf(if (parsed.isEmpty() && characterToEdit == null) getDefaultClassAbilityItems("Fighter") else parsed)
    }

    AlertDialog(
        onDismissRequest = onDismiss,
        containerColor = DungeonCard,
        title = {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = if (characterToEdit == null) "Add Player Character" else "Edit ${characterToEdit.name}",
                    color = ParchmentWhite,
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold
                )
            }
        },
        text = {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .heightIn(max = 480.dp)
                    .verticalScroll(rememberScrollState())
            ) {
                // --- 🎲 Roll Random 5e Character Button ---
                Button(
                    onClick = {
                        val rolled = rollRandom5eCharacter()
                        name = rolled.name
                        selectedClass = rolled.characterClass
                        levelText = rolled.level.toString()
                        maxHpText = rolled.maxHp.toString()
                        acText = rolled.armorClass.toString()
                        initModText = rolled.initiativeModifier.toString()
                        passivePercText = rolled.passivePerception.toString()
                        speedText = rolled.speed.toString()
                        spellDcText = rolled.spellDc?.toString() ?: ""
                        abilityItems = rolled.abilities.toMutableList()
                        notes = rolled.notes
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = DungeonCardElevated),
                    border = ButtonDefaults.outlinedButtonBorder.copy(
                        brush = Brush.linearGradient(listOf(DungeonBorder, DndGold))
                    ),
                    shape = RoundedCornerShape(8.dp),
                    modifier = Modifier
                        .fillMaxWidth()
                        .testTag("roll_random_character_btn")
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text("🎲", fontSize = 16.sp)
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "Roll Random 5e Character",
                            color = DndGold,
                            fontWeight = FontWeight.Bold,
                            fontSize = 13.sp
                        )
                    }
                }

                Spacer(modifier = Modifier.height(10.dp))

                // Name Field
                OutlinedTextField(
                    value = name,
                    onValueChange = { name = it },
                    label = { Text("Character Name *", color = ParchmentMuted) },
                    singleLine = true,
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedTextColor = ParchmentWhite,
                        unfocusedTextColor = ParchmentWhite,
                        focusedBorderColor = DndGold,
                        unfocusedBorderColor = DungeonBorder
                    ),
                    modifier = Modifier
                        .fillMaxWidth()
                        .testTag("character_name_input")
                )

                Spacer(modifier = Modifier.height(8.dp))

                // Player Name
                OutlinedTextField(
                    value = playerName,
                    onValueChange = { playerName = it },
                    label = { Text("Player Name (Optional)", color = ParchmentMuted) },
                    singleLine = true,
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedTextColor = ParchmentWhite,
                        unfocusedTextColor = ParchmentWhite,
                        focusedBorderColor = DndGold,
                        unfocusedBorderColor = DungeonBorder
                    ),
                    modifier = Modifier.fillMaxWidth()
                )

                Spacer(modifier = Modifier.height(8.dp))

                // --- 5E Class Selector Dropdown & Editable Typing + Level ---
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Box(modifier = Modifier.weight(1.6f)) {
                        OutlinedTextField(
                            value = selectedClass,
                            onValueChange = { selectedClass = it },
                            label = { Text("Class (Select / Type) *", color = ParchmentMuted) },
                            singleLine = true,
                            trailingIcon = {
                                IconButton(
                                    onClick = { isClassDropdownExpanded = !isClassDropdownExpanded },
                                    modifier = Modifier.testTag("class_dropdown_trigger")
                                ) {
                                    Icon(
                                        imageVector = if (isClassDropdownExpanded) Icons.Default.ArrowDropUp else Icons.Default.ArrowDropDown,
                                        contentDescription = "Select 5E Class",
                                        tint = DndGold
                                    )
                                }
                            },
                            colors = OutlinedTextFieldDefaults.colors(
                                focusedTextColor = ParchmentWhite,
                                unfocusedTextColor = ParchmentWhite,
                                focusedBorderColor = DndGold,
                                unfocusedBorderColor = DungeonBorder
                            ),
                            modifier = Modifier
                                .fillMaxWidth()
                                .testTag("character_class_input")
                        )

                        DropdownMenu(
                            expanded = isClassDropdownExpanded,
                            onDismissRequest = { isClassDropdownExpanded = false },
                            modifier = Modifier
                                .background(DungeonCardElevated)
                                .heightIn(max = 280.dp)
                        ) {
                            OFFICIAL_5E_CLASSES.forEach { cls ->
                                DropdownMenuItem(
                                    text = {
                                        Text(
                                            text = cls,
                                            color = ParchmentWhite,
                                            fontWeight = if (selectedClass.contains(cls, ignoreCase = true)) FontWeight.Bold else FontWeight.Normal
                                        )
                                    },
                                    onClick = {
                                        selectedClass = cls
                                        isClassDropdownExpanded = false
                                        // If adding new character with empty abilities, populate default class abilities
                                        if (characterToEdit == null && abilityItems.isEmpty()) {
                                            abilityItems = getDefaultClassAbilityItems(cls)
                                        }
                                    }
                                )
                            }
                        }
                    }

                    OutlinedTextField(
                        value = levelText,
                        onValueChange = { if (it.all { char -> char.isDigit() } && it.length <= 2) levelText = it },
                        label = { Text("Level", color = ParchmentMuted) },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                        singleLine = true,
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedTextColor = ParchmentWhite,
                            unfocusedTextColor = ParchmentWhite,
                            focusedBorderColor = DndGold,
                            unfocusedBorderColor = DungeonBorder
                        ),
                        modifier = Modifier.weight(0.9f)
                    )
                }

                Spacer(modifier = Modifier.height(8.dp))

                // Max HP, Armor Class (AC), Initiative Modifier
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    OutlinedTextField(
                        value = maxHpText,
                        onValueChange = { if (it.all { char -> char.isDigit() } && it.length <= 4) maxHpText = it },
                        label = { Text("Max HP *", color = ParchmentMuted) },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                        singleLine = true,
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedTextColor = ParchmentWhite,
                            unfocusedTextColor = ParchmentWhite,
                            focusedBorderColor = DndGold,
                            unfocusedBorderColor = DungeonBorder
                        ),
                        modifier = Modifier
                            .weight(1f)
                            .testTag("character_hp_input")
                    )

                    OutlinedTextField(
                        value = acText,
                        onValueChange = { if (it.all { char -> char.isDigit() } && it.length <= 2) acText = it },
                        label = { Text("AC *", color = ParchmentMuted) },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                        singleLine = true,
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedTextColor = ParchmentWhite,
                            unfocusedTextColor = ParchmentWhite,
                            focusedBorderColor = DndGold,
                            unfocusedBorderColor = DungeonBorder
                        ),
                        modifier = Modifier
                            .weight(1f)
                            .testTag("character_ac_input")
                    )

                    OutlinedTextField(
                        value = initModText,
                        onValueChange = { input ->
                            if (input.matches(Regex("^-?\\d{0,2}$"))) {
                                initModText = input
                            }
                        },
                        label = { Text("Init Mod", color = ParchmentMuted) },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                        singleLine = true,
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedTextColor = ParchmentWhite,
                            unfocusedTextColor = ParchmentWhite,
                            focusedBorderColor = DndGold,
                            unfocusedBorderColor = DungeonBorder
                        ),
                        modifier = Modifier
                            .weight(1f)
                            .testTag("character_init_mod_input")
                    )
                }

                Spacer(modifier = Modifier.height(8.dp))

                // Speed, Passive Perception, Spell DC
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    OutlinedTextField(
                        value = speedText,
                        onValueChange = { if (it.all { char -> char.isDigit() } && it.length <= 3) speedText = it },
                        label = { Text("Speed (ft)", color = ParchmentMuted) },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                        singleLine = true,
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedTextColor = ParchmentWhite,
                            unfocusedTextColor = ParchmentWhite,
                            focusedBorderColor = DndGold,
                            unfocusedBorderColor = DungeonBorder
                        ),
                        modifier = Modifier.weight(1f)
                    )

                    OutlinedTextField(
                        value = passivePercText,
                        onValueChange = { if (it.all { char -> char.isDigit() } && it.length <= 2) passivePercText = it },
                        label = { Text("Passive Perc", color = ParchmentMuted) },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                        singleLine = true,
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedTextColor = ParchmentWhite,
                            unfocusedTextColor = ParchmentWhite,
                            focusedBorderColor = DndGold,
                            unfocusedBorderColor = DungeonBorder
                        ),
                        modifier = Modifier.weight(1f)
                    )

                    OutlinedTextField(
                        value = spellDcText,
                        onValueChange = { if (it.all { char -> char.isDigit() } && it.length <= 2) spellDcText = it },
                        label = { Text("Spell DC", color = ParchmentMuted) },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                        singleLine = true,
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedTextColor = ParchmentWhite,
                            unfocusedTextColor = ParchmentWhite,
                            focusedBorderColor = DndGold,
                            unfocusedBorderColor = DungeonBorder
                        ),
                        modifier = Modifier.weight(1f)
                    )
                }

                Spacer(modifier = Modifier.height(14.dp))

                // --- ⚡ Separate Items for Abilities & Feats ---
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text("⚡", fontSize = 14.sp)
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = "Abilities & Feats (${abilityItems.size})",
                            color = DndGold,
                            fontSize = 13.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }

                    TextButton(
                        onClick = {
                            abilityItems = abilityItems + CharacterAbilityItem(
                                name = "",
                                type = "Action",
                                description = ""
                            )
                        },
                        modifier = Modifier.testTag("add_ability_item_btn")
                    ) {
                        Icon(Icons.Default.Add, contentDescription = null, tint = DndGold, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("Add Ability", color = DndGold, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                    }
                }

                if (abilityItems.isEmpty()) {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(8.dp))
                            .background(DungeonCardElevated)
                            .border(0.5.dp, DungeonBorder, RoundedCornerShape(8.dp))
                            .padding(12.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = "No abilities or feats added yet. Tap '+ Add Ability' or 'Roll Random 5e Character'.",
                            color = ParchmentMuted,
                            fontSize = 11.sp
                        )
                    }
                } else {
                    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        abilityItems.forEachIndexed { index, item ->
                            var itemDropdownExpanded by remember { mutableStateOf(false) }

                            Card(
                                modifier = Modifier.fillMaxWidth(),
                                colors = CardDefaults.cardColors(containerColor = DungeonCardElevated),
                                border = CardDefaults.outlinedCardBorder().copy(
                                    brush = Brush.linearGradient(listOf(DungeonBorder, DungeonBorder))
                                )
                            ) {
                                Column(modifier = Modifier.padding(8.dp)) {
                                    Row(
                                        modifier = Modifier.fillMaxWidth(),
                                        horizontalArrangement = Arrangement.spacedBy(6.dp),
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        // Name of ability
                                        OutlinedTextField(
                                            value = item.name,
                                            onValueChange = { newName ->
                                                abilityItems = abilityItems.toMutableList().also {
                                                    it[index] = it[index].copy(name = newName)
                                                }
                                            },
                                            placeholder = { Text("Ability Name", color = ParchmentMuted, fontSize = 12.sp) },
                                            singleLine = true,
                                            colors = OutlinedTextFieldDefaults.colors(
                                                focusedTextColor = ParchmentWhite,
                                                unfocusedTextColor = ParchmentWhite,
                                                focusedBorderColor = DndGold,
                                                unfocusedBorderColor = DungeonBorder
                                            ),
                                            modifier = Modifier.weight(1.5f)
                                        )

                                        // Action Type Dropdown
                                        Box(modifier = Modifier.weight(1.3f)) {
                                            OutlinedButton(
                                                onClick = { itemDropdownExpanded = true },
                                                colors = ButtonDefaults.outlinedButtonColors(contentColor = DndGold),
                                                shape = RoundedCornerShape(4.dp),
                                                border = ButtonDefaults.outlinedButtonBorder.copy(
                                                    brush = Brush.linearGradient(listOf(DungeonBorder, DndGold.copy(alpha = 0.5f)))
                                                ),
                                                modifier = Modifier.fillMaxWidth()
                                            ) {
                                                Text(
                                                    text = item.type,
                                                    fontSize = 11.sp,
                                                    maxLines = 1,
                                                    fontWeight = FontWeight.SemiBold
                                                )
                                            }

                                            DropdownMenu(
                                                expanded = itemDropdownExpanded,
                                                onDismissRequest = { itemDropdownExpanded = false },
                                                modifier = Modifier.background(DungeonCardElevated)
                                            ) {
                                                ACTION_TYPES.forEach { aType ->
                                                    DropdownMenuItem(
                                                        text = { Text(aType, color = ParchmentWhite, fontSize = 12.sp) },
                                                        onClick = {
                                                            abilityItems = abilityItems.toMutableList().also {
                                                                it[index] = it[index].copy(type = aType)
                                                            }
                                                            itemDropdownExpanded = false
                                                        }
                                                    )
                                                }
                                            }
                                        }

                                        // Delete Button
                                        IconButton(
                                            onClick = {
                                                abilityItems = abilityItems.toMutableList().also { it.removeAt(index) }
                                            },
                                            modifier = Modifier.size(32.dp)
                                        ) {
                                            Icon(
                                                imageVector = Icons.Default.Delete,
                                                contentDescription = "Remove Ability",
                                                tint = BloodiedRed.copy(alpha = 0.8f),
                                                modifier = Modifier.size(16.dp)
                                            )
                                        }
                                    }

                                    Spacer(modifier = Modifier.height(6.dp))

                                    // Description of ability
                                    OutlinedTextField(
                                        value = item.description,
                                        onValueChange = { newDesc ->
                                            abilityItems = abilityItems.toMutableList().also {
                                                it[index] = it[index].copy(description = newDesc)
                                            }
                                        },
                                        placeholder = { Text("Mechanics, effect, damage, duration...", color = ParchmentMuted, fontSize = 11.sp) },
                                        singleLine = false,
                                        maxLines = 2,
                                        colors = OutlinedTextFieldDefaults.colors(
                                            focusedTextColor = ParchmentWhite,
                                            unfocusedTextColor = ParchmentWhite,
                                            focusedBorderColor = DndGold,
                                            unfocusedBorderColor = DungeonBorder
                                        ),
                                        modifier = Modifier.fillMaxWidth()
                                    )
                                }
                            }
                        }
                    }
                }

                Spacer(modifier = Modifier.height(10.dp))

                // General Notes Field
                OutlinedTextField(
                    value = notes,
                    onValueChange = { notes = it },
                    label = { Text("Additional Backstory / Inventory Notes", color = ParchmentMuted) },
                    minLines = 1,
                    maxLines = 3,
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedTextColor = ParchmentWhite,
                        unfocusedTextColor = ParchmentWhite,
                        focusedBorderColor = DndGold,
                        unfocusedBorderColor = DungeonBorder
                    ),
                    modifier = Modifier.fillMaxWidth()
                )
            }
        },
        confirmButton = {
            Button(
                onClick = {
                    if (name.isNotBlank()) {
                        val maxHp = maxHpText.toIntOrNull() ?: 10
                        val serializedAbilities = abilityItems
                            .filter { it.name.isNotBlank() }
                            .joinToString("\n") { item ->
                                if (item.description.isNotBlank()) {
                                    "${item.name} (${item.type}): ${item.description}"
                                } else {
                                    "${item.name} (${item.type})"
                                }
                            }

                        val pc = PlayerCharacter(
                            id = characterToEdit?.id ?: 0,
                            name = name.trim(),
                            playerName = playerName.trim(),
                            characterClass = selectedClass.trim(),
                            level = levelText.toIntOrNull() ?: 1,
                            maxHp = maxHp,
                            currentHp = characterToEdit?.currentHp ?: maxHp,
                            tempHp = characterToEdit?.tempHp ?: 0,
                            armorClass = acText.toIntOrNull() ?: 10,
                            initiativeModifier = initModText.toIntOrNull() ?: 0,
                            passivePerception = passivePercText.toIntOrNull() ?: 10,
                            speed = speedText.toIntOrNull() ?: 30,
                            spellDc = spellDcText.toIntOrNull(),
                            notes = notes.trim(),
                            abilitiesAndFeats = serializedAbilities
                        )
                        onSave(pc)
                        onDismiss()
                    }
                },
                enabled = name.isNotBlank(),
                colors = ButtonDefaults.buttonColors(containerColor = DndGold),
                modifier = Modifier.testTag("save_character_button")
            ) {
                Text("Save Character", color = DungeonCardElevated, fontWeight = FontWeight.Bold)
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text("Cancel", color = ParchmentMuted)
            }
        }
    )
}

private fun parseExistingAbilities(text: String): List<CharacterAbilityItem> {
    if (text.isBlank()) return emptyList()
    return text.split("\n", ";").map { it.trim() }.filter { it.isNotBlank() }.map { line ->
        val clean = line.removePrefix("•").removePrefix("-").trim()
        val type = when {
            clean.contains("Bonus Action", ignoreCase = true) -> "Bonus Action"
            clean.contains("Reaction", ignoreCase = true) -> "Reaction"
            clean.contains("Feat", ignoreCase = true) || clean.contains("Trait", ignoreCase = true) -> "Feat / Trait"
            clean.contains("Spell", ignoreCase = true) -> "Spell"
            else -> "Action"
        }

        var name = clean
        var desc = ""

        if (clean.contains(":") && clean.contains("(") && clean.indexOf("(") < clean.indexOf(":")) {
            name = clean.substringBefore("(").trim()
            desc = clean.substringAfter(":").trim()
        } else if (clean.contains(":")) {
            name = clean.substringBefore(":").trim()
            desc = clean.substringAfter(":").trim()
        } else if (clean.contains("(") && clean.contains(")")) {
            name = clean.substringBefore("(").trim()
            desc = clean.substring(clean.indexOf("(") + 1, clean.lastIndexOf(")")).trim()
        }

        CharacterAbilityItem(name = name, type = type, description = desc)
    }
}

private fun getDefaultClassAbilityItems(className: String): List<CharacterAbilityItem> {
    val lower = className.lowercase()
    return when {
        lower.contains("barbarian") -> listOf(
            CharacterAbilityItem(name = "Rage", type = "Bonus Action", description = "Advantage on STR checks, resistance to bludgeoning/piercing/slashing, +2 melee damage. (1 min)"),
            CharacterAbilityItem(name = "Unarmored Defense", type = "Feat / Trait", description = "While wearing no armor, AC equals 10 + DEX mod + CON mod.")
        )
        lower.contains("fighter") -> listOf(
            CharacterAbilityItem(name = "Second Wind", type = "Bonus Action", description = "Regain 1d10 + level HP once per short rest."),
            CharacterAbilityItem(name = "Action Surge", type = "Action", description = "Take 1 additional action on your turn. 1/short rest.")
        )
        lower.contains("rogue") -> listOf(
            CharacterAbilityItem(name = "Sneak Attack", type = "Feat / Trait", description = "+1d6 damage when you hit with advantage or ally within 5ft."),
            CharacterAbilityItem(name = "Cunning Action", type = "Bonus Action", description = "Take Dash, Disengage, or Hide as a bonus action.")
        )
        lower.contains("wizard") -> listOf(
            CharacterAbilityItem(name = "Arcane Recovery", type = "Feat / Trait", description = "Regain spell slots on short rest up to half level."),
            CharacterAbilityItem(name = "Shield", type = "Reaction", description = "+5 bonus to AC against triggering attack until next turn.")
        )
        lower.contains("cleric") -> listOf(
            CharacterAbilityItem(name = "Disciple of Life", type = "Feat / Trait", description = "Healing spells restore extra 2 + spell level HP."),
            CharacterAbilityItem(name = "Healing Word", type = "Bonus Action", description = "Heal an ally within 60ft for 1d4 + WIS modifier HP.")
        )
        lower.contains("paladin") -> listOf(
            CharacterAbilityItem(name = "Divine Smite", type = "Action", description = "Expend a spell slot to deal +2d8 radiant damage on melee hit."),
            CharacterAbilityItem(name = "Lay on Hands", type = "Action", description = "Pool of 5 HP per level to heal wounds or cure disease.")
        )
        lower.contains("ranger") -> listOf(
            CharacterAbilityItem(name = "Hunter's Mark", type = "Bonus Action", description = "+1d6 extra weapon damage against the marked target."),
            CharacterAbilityItem(name = "Favored Enemy", type = "Feat / Trait", description = "Advantage tracking and recalling lore on favored enemies.")
        )
        lower.contains("bard") -> listOf(
            CharacterAbilityItem(name = "Bardic Inspiration", type = "Bonus Action", description = "Give ally within 60ft a d6 inspiration die for one d20 roll."),
            CharacterAbilityItem(name = "Vicious Mockery", type = "Action", description = "Target takes 1d4 psychic damage & disadvantage on next attack.")
        )
        lower.contains("druid") -> listOf(
            CharacterAbilityItem(name = "Wild Shape", type = "Action", description = "Transform into a beast you have seen before."),
            CharacterAbilityItem(name = "Druidic Spellcasting", type = "Spell", description = "Cast prepared nature spells and rituals using WIS.")
        )
        lower.contains("monk") -> listOf(
            CharacterAbilityItem(name = "Martial Arts", type = "Bonus Action", description = "Make one unarmed strike with DEX as a bonus action."),
            CharacterAbilityItem(name = "Unarmored Defense", type = "Feat / Trait", description = "While wearing no armor, AC equals 10 + DEX mod + WIS mod.")
        )
        lower.contains("sorcerer") -> listOf(
            CharacterAbilityItem(name = "Metamagic", type = "Bonus Action", description = "Quickened Spell or Twinned Spell powered by sorcery points."),
            CharacterAbilityItem(name = "Innate Spellcasting", type = "Spell", description = "Cast spells using Charisma as spellcasting ability.")
        )
        lower.contains("warlock") -> listOf(
            CharacterAbilityItem(name = "Eldritch Blast", type = "Action", description = "Ranged spell attack dealing 1d10 force damage with 120ft range."),
            CharacterAbilityItem(name = "Hex", type = "Bonus Action", description = "+1d6 extra necrotic damage on the cursed target.")
        )
        else -> listOf(
            CharacterAbilityItem(name = "Standard Action", type = "Action", description = "Attack, Cast a Spell, Dash, Disengage, Dodge, Help, Hide")
        )
    }
}

data class Generated5eCharacter(
    val name: String,
    val characterClass: String,
    val level: Int,
    val maxHp: Int,
    val armorClass: Int,
    val initiativeModifier: Int,
    val passivePerception: Int,
    val speed: Int,
    val spellDc: Int?,
    val abilities: List<CharacterAbilityItem>,
    val notes: String
)

private val FANTASY_FIRST_NAMES = listOf(
    "Thorin", "Durnan", "Kaelen", "Theron", "Eldrin", "Aelar", "Sylas", "Milo",
    "Corrin", "Boran", "Vesper", "Garrick", "Seraphina", "Lyra", "Valerius",
    "Faelar", "Morgran", "Grommash", "Keth", "Rowan"
)

private val FANTASY_LAST_NAMES = listOf(
    "Oakenshield", "Ironbreaker", "Emberforge", "Shadowend", "Starfall", "Moonwhisper",
    "Quickfoot", "Underbough", "Stonefist", "Nightshade", "Ravenscar", "Sunstrider",
    "Brightblade", "Dawnseeker", "Stormwind", "Frostbeard", "Battlehammer"
)

fun rollRandom5eCharacter(): Generated5eCharacter {
    val firstName = FANTASY_FIRST_NAMES.random()
    val lastName = FANTASY_LAST_NAMES.random()
    val fullName = "$firstName $lastName"

    val cls = OFFICIAL_5E_CLASSES.filterNot { it == "Artificer" }.random()
    val level = 1

    return when (cls) {
        "Barbarian" -> Generated5eCharacter(
            name = fullName,
            characterClass = "Barbarian",
            level = level,
            maxHp = 14, // d12 (12 + 2 CON)
            armorClass = 14, // 10 + 2 DEX + 2 CON
            initiativeModifier = 2,
            passivePerception = 11,
            speed = 30,
            spellDc = null,
            abilities = getDefaultClassAbilityItems("Barbarian"),
            notes = "Fierce warrior powered by primal rage. High survivability and physical resilience."
        )
        "Fighter" -> Generated5eCharacter(
            name = fullName,
            characterClass = "Fighter",
            level = level,
            maxHp = 12, // d10 (10 + 2 CON)
            armorClass = 18, // Chain Mail (16) + Shield (+2)
            initiativeModifier = 1,
            passivePerception = 12,
            speed = 30,
            spellDc = null,
            abilities = getDefaultClassAbilityItems("Fighter"),
            notes = "Heavily armored frontline combatant skilled in versatile weapon combat."
        )
        "Rogue" -> Generated5eCharacter(
            name = fullName,
            characterClass = "Rogue",
            level = level,
            maxHp = 10, // d8 (8 + 2 CON)
            armorClass = 14, // Leather (11) + 3 DEX
            initiativeModifier = 3,
            passivePerception = 14, // Expertise in perception
            speed = 30,
            spellDc = null,
            abilities = getDefaultClassAbilityItems("Rogue"),
            notes = "Stealthy skirmisher dealing precision Sneak Attacks and navigating danger."
        )
        "Wizard" -> Generated5eCharacter(
            name = fullName,
            characterClass = "Wizard",
            level = level,
            maxHp = 8, // d6 (6 + 2 CON)
            armorClass = 12, // 10 + 2 DEX (Shield spell adds +5)
            initiativeModifier = 2,
            passivePerception = 11,
            speed = 30,
            spellDc = 13, // 8 + 2 prof + 3 INT
            abilities = getDefaultClassAbilityItems("Wizard"),
            notes = "Scholarly spellcaster with vast arcane versatility and ritual magic."
        )
        "Cleric" -> Generated5eCharacter(
            name = fullName,
            characterClass = "Cleric (Life Domain)",
            level = level,
            maxHp = 10, // d8 (8 + 2 CON)
            armorClass = 18, // Scale Mail (14) + 2 DEX + Shield (+2)
            initiativeModifier = 1,
            passivePerception = 14, // 10 + 2 WIS + 2 prof
            speed = 30,
            spellDc = 13, // 8 + 2 prof + 3 WIS
            abilities = getDefaultClassAbilityItems("Cleric"),
            notes = "Divine channeler of life and healing, armored protector of allies."
        )
        "Paladin" -> Generated5eCharacter(
            name = fullName,
            characterClass = "Paladin",
            level = level,
            maxHp = 12, // d10 (10 + 2 CON)
            armorClass = 18, // Chain Mail (16) + Shield (+2)
            initiativeModifier = 0,
            passivePerception = 11,
            speed = 30,
            spellDc = 12, // 8 + 2 prof + 2 CHA
            abilities = getDefaultClassAbilityItems("Paladin"),
            notes = "Holy warrior bound by a sacred oath, delivering radiant smites."
        )
        "Ranger" -> Generated5eCharacter(
            name = fullName,
            characterClass = "Ranger",
            level = level,
            maxHp = 12, // d10 (10 + 2 CON)
            armorClass = 15, // Scale Mail (14) + 1 DEX
            initiativeModifier = 2,
            passivePerception = 13,
            speed = 30,
            spellDc = 12,
            abilities = getDefaultClassAbilityItems("Ranger"),
            notes = "Wilderness hunter tracking quarry and striking with martial and primal magic."
        )
        "Bard" -> Generated5eCharacter(
            name = fullName,
            characterClass = "Bard",
            level = level,
            maxHp = 10, // d8 (8 + 2 CON)
            armorClass = 13, // Leather (11) + 2 DEX
            initiativeModifier = 2,
            passivePerception = 12,
            speed = 30,
            spellDc = 13, // 8 + 2 prof + 3 CHA
            abilities = getDefaultClassAbilityItems("Bard"),
            notes = "Charismatic performer weaving magic and inspiring companions in battle."
        )
        "Druid" -> Generated5eCharacter(
            name = fullName,
            characterClass = "Druid",
            level = level,
            maxHp = 10, // d8 (8 + 2 CON)
            armorClass = 14, // Leather (11) + 1 DEX + Shield (+2)
            initiativeModifier = 1,
            passivePerception = 14,
            speed = 30,
            spellDc = 13,
            abilities = getDefaultClassAbilityItems("Druid"),
            notes = "Primal caster commanding natural forces and assuming wild beast shapes."
        )
        "Monk" -> Generated5eCharacter(
            name = fullName,
            characterClass = "Monk",
            level = level,
            maxHp = 10, // d8 (8 + 2 CON)
            armorClass = 15, // Unarmored Defense: 10 + 3 DEX + 2 WIS
            initiativeModifier = 3,
            passivePerception = 12,
            speed = 30,
            spellDc = null,
            abilities = getDefaultClassAbilityItems("Monk"),
            notes = "Master of martial arts harnessing Ki energy to deliver flurries of blows."
        )
        "Sorcerer" -> Generated5eCharacter(
            name = fullName,
            characterClass = "Sorcerer",
            level = level,
            maxHp = 8, // d6 (6 + 2 CON)
            armorClass = 12, // 10 + 2 DEX
            initiativeModifier = 2,
            passivePerception = 10,
            speed = 30,
            spellDc = 13,
            abilities = getDefaultClassAbilityItems("Sorcerer"),
            notes = "Wielder of innate, raw magical power shaped through metamagic."
        )
        "Warlock" -> Generated5eCharacter(
            name = fullName,
            characterClass = "Warlock",
            level = level,
            maxHp = 10, // d8 (8 + 2 CON)
            armorClass = 13, // Leather (11) + 2 DEX
            initiativeModifier = 2,
            passivePerception = 11,
            speed = 30,
            spellDc = 13,
            abilities = getDefaultClassAbilityItems("Warlock"),
            notes = "Bound by pact to an otherworldly patron, channeling potent eldritch blasts."
        )
        else -> Generated5eCharacter(
            name = fullName,
            characterClass = "Fighter",
            level = level,
            maxHp = 12,
            armorClass = 16,
            initiativeModifier = 1,
            passivePerception = 11,
            speed = 30,
            spellDc = null,
            abilities = getDefaultClassAbilityItems("Fighter"),
            notes = "Disciplined warrior ready for battle."
        )
    }
}
