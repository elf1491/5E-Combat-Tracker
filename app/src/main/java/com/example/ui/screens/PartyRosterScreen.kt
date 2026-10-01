package com.example.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.Shield
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.FloatingActionButton
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Scaffold
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
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.model.PlayerCharacter
import com.example.ui.dialogs.AddCharacterDialog
import com.example.ui.theme.BloodiedRed
import com.example.ui.theme.DndGold
import com.example.ui.theme.DungeonBorder
import com.example.ui.theme.DungeonCard
import com.example.ui.theme.DungeonCardElevated
import com.example.ui.theme.DungeonGoldBorder
import com.example.ui.theme.DungeonSurface
import com.example.ui.theme.HealthGreen
import com.example.ui.theme.ParchmentMuted
import com.example.ui.theme.ParchmentWhite
import com.example.ui.theme.PlayerShieldBlue
import com.example.ui.viewmodel.CombatTrackerViewModel

@Composable
fun PartyRosterScreen(
    viewModel: CombatTrackerViewModel,
    characters: List<PlayerCharacter>,
    onNavigateToCombat: () -> Unit,
    modifier: Modifier = Modifier
) {
    var showAddDialog by remember { mutableStateOf(false) }
    var characterToEdit by remember { mutableStateOf<PlayerCharacter?>(null) }
    var characterToDelete by remember { mutableStateOf<PlayerCharacter?>(null) }

    Scaffold(
        floatingActionButton = {
            FloatingActionButton(
                onClick = { showAddDialog = true },
                containerColor = DndGold,
                contentColor = DungeonCard,
                modifier = Modifier.testTag("fab_add_character")
            ) {
                Icon(Icons.Default.Add, contentDescription = "Add Player Character")
            }
        },
        containerColor = DungeonSurface,
        modifier = modifier.fillMaxSize()
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .padding(horizontal = 12.dp)
        ) {
            // Header
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 12.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = "🛡️ PARTY ROSTER",
                        color = DndGold,
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold,
                        letterSpacing = 1.sp
                    )
                    Text(
                        text = "Persistent heroes saved for repeated encounters (${characters.size})",
                        color = ParchmentMuted,
                        fontSize = 12.sp
                    )
                }

                if (characters.isNotEmpty()) {
                    Button(
                        onClick = {
                            viewModel.addAllPartyToEncounter()
                            onNavigateToCombat()
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = DndGold),
                        modifier = Modifier.testTag("send_all_party_to_combat_btn")
                    ) {
                        Text("Send All ➔", color = DungeonCard, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                    }
                }
            }

            if (characters.isEmpty()) {
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(24.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text("🛡️", fontSize = 48.sp)
                        Spacer(modifier = Modifier.height(12.dp))
                        Text(
                            text = "No Player Characters Saved",
                            color = ParchmentWhite,
                            fontSize = 18.sp,
                            fontWeight = FontWeight.Bold
                        )
                        Spacer(modifier = Modifier.height(6.dp))
                        Text(
                            text = "Create your party members here with their HP, AC, and initiative bonuses so you can easily deploy them into any encounter.",
                            color = ParchmentMuted,
                            fontSize = 13.sp,
                            textAlign = androidx.compose.ui.text.style.TextAlign.Center
                        )
                        Spacer(modifier = Modifier.height(16.dp))
                        Button(
                            onClick = { showAddDialog = true },
                            colors = ButtonDefaults.buttonColors(containerColor = DndGold)
                        ) {
                            Text("Create First Character", color = DungeonCard, fontWeight = FontWeight.Bold)
                        }
                    }
                }
            } else {
                LazyColumn(
                    verticalArrangement = Arrangement.spacedBy(10.dp),
                    modifier = Modifier.fillMaxSize()
                ) {
                    items(
                        items = characters,
                        key = { it.id }
                    ) { character ->
                        CharacterRosterCard(
                            character = character,
                            onAddToEncounter = {
                                viewModel.addPlayerToEncounter(character)
                                onNavigateToCombat()
                            },
                            onEdit = { characterToEdit = character },
                            onDelete = { characterToDelete = character }
                        )
                    }

                    item {
                        Spacer(modifier = Modifier.height(72.dp)) // Space for FAB
                    }
                }
            }
        }
    }

    if (showAddDialog) {
        AddCharacterDialog(
            characterToEdit = null,
            onDismiss = { showAddDialog = false },
            onSave = { newPc -> viewModel.addCharacter(newPc) }
        )
    }

    characterToEdit?.let { pc ->
        AddCharacterDialog(
            characterToEdit = pc,
            onDismiss = { characterToEdit = null },
            onSave = { updatedPc -> viewModel.updateCharacter(updatedPc) }
        )
    }

    characterToDelete?.let { pc ->
        AlertDialog(
            onDismissRequest = { characterToDelete = null },
            containerColor = DungeonCard,
            title = { Text("Delete ${pc.name}?", color = ParchmentWhite, fontWeight = FontWeight.Bold) },
            text = {
                Text(
                    "Are you sure you want to delete this character from your saved party? This cannot be undone.",
                    color = ParchmentMuted
                )
            },
            confirmButton = {
                Button(
                    onClick = {
                        viewModel.deleteCharacter(pc)
                        characterToDelete = null
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = BloodiedRed)
                ) {
                    Text("Delete", color = ParchmentWhite)
                }
            },
            dismissButton = {
                TextButton(onClick = { characterToDelete = null }) {
                    Text("Cancel", color = ParchmentMuted)
                }
            }
        )
    }
}

@Composable
private fun CharacterRosterCard(
    character: PlayerCharacter,
    onAddToEncounter: () -> Unit,
    onEdit: () -> Unit,
    onDelete: () -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = DungeonCard),
        border = CardDefaults.outlinedCardBorder().copy(brush = Brush.linearGradient(listOf(DungeonBorder, DungeonGoldBorder)))
    ) {
        Column(modifier = Modifier.padding(12.dp)) {
            // Top: Name, Player name, Class, and Actions
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = character.name,
                        color = ParchmentWhite,
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Bold
                    )
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text(
                            text = "${character.characterClass} • Level ${character.level}",
                            color = DndGold,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.SemiBold
                        )
                        if (character.currentHp <= 0) {
                            Spacer(modifier = Modifier.width(6.dp))
                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(4.dp))
                                    .background(BloodiedRed.copy(alpha = 0.25f))
                                    .border(0.5.dp, BloodiedRed, RoundedCornerShape(4.dp))
                                    .padding(horizontal = 5.dp, vertical = 1.dp)
                            ) {
                                Text("💀 0 HP", color = BloodiedRed, fontSize = 9.sp, fontWeight = FontWeight.Bold)
                            }
                        }
                        if (character.playerName.isNotBlank()) {
                            Text(
                                text = " (Played by ${character.playerName})",
                                color = ParchmentMuted,
                                fontSize = 11.sp
                            )
                        }
                    }
                }

                Row(verticalAlignment = Alignment.CenterVertically) {
                    IconButton(onClick = onEdit, modifier = Modifier.size(32.dp)) {
                        Icon(Icons.Default.Edit, contentDescription = "Edit", tint = ParchmentMuted, modifier = Modifier.size(18.dp))
                    }
                    IconButton(onClick = onDelete, modifier = Modifier.size(32.dp)) {
                        Icon(Icons.Default.Delete, contentDescription = "Delete", tint = BloodiedRed.copy(alpha = 0.8f), modifier = Modifier.size(18.dp))
                    }
                }
            }

            Spacer(modifier = Modifier.height(10.dp))

            // Stat Badges Row: AC, Max HP, Init Mod, Passive Perception, Speed, Spell DC
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(6.dp)
            ) {
                RosterStatBadge(label = "AC", value = "${character.armorClass}", icon = "🛡️")
                RosterStatBadge(
                    label = "HP",
                    value = "${character.currentHp}/${character.maxHp}",
                    icon = if (character.currentHp <= 0) "💀" else "💚"
                )
                RosterStatBadge(
                    label = "INIT",
                    value = if (character.initiativeModifier >= 0) "+${character.initiativeModifier}" else "${character.initiativeModifier}",
                    icon = "⚡"
                )
                RosterStatBadge(label = "PERC", value = "${character.passivePerception}", icon = "👁️")
                RosterStatBadge(label = "SPD", value = "${character.speed}ft", icon = "👟")
                if (character.spellDc != null) {
                    RosterStatBadge(label = "DC", value = "${character.spellDc}", icon = "🔮")
                }
            }

            if (character.notes.isNotBlank()) {
                Spacer(modifier = Modifier.height(6.dp))
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(6.dp))
                        .background(DungeonCardElevated.copy(alpha = 0.55f))
                        .border(0.5.dp, DungeonBorder.copy(alpha = 0.8f), RoundedCornerShape(6.dp))
                        .padding(horizontal = 8.dp, vertical = 5.dp)
                ) {
                    Text(
                        text = "📜 ${character.notes}",
                        color = ParchmentMuted,
                        fontSize = 11.sp,
                        lineHeight = 14.sp
                    )
                }
            }

            Spacer(modifier = Modifier.height(10.dp))

            // Deploy button
            Button(
                onClick = onAddToEncounter,
                colors = ButtonDefaults.buttonColors(containerColor = DungeonCardElevated),
                border = ButtonDefaults.outlinedButtonBorder.copy(brush = Brush.linearGradient(listOf(DungeonBorder, DungeonGoldBorder))),
                modifier = Modifier
                    .fillMaxWidth()
                    .testTag("add_pc_to_encounter_${character.id}")
            ) {
                Icon(Icons.Default.PlayArrow, contentDescription = null, tint = DndGold, modifier = Modifier.size(16.dp))
                Spacer(modifier = Modifier.width(6.dp))
                Text("Add to Current Encounter", color = ParchmentWhite, fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
            }
        }
    }
}

@Composable
private fun RosterStatBadge(label: String, value: String, icon: String) {
    Box(
        modifier = Modifier
            .clip(RoundedCornerShape(6.dp))
            .background(DungeonCardElevated)
            .border(1.dp, DungeonBorder, RoundedCornerShape(6.dp))
            .padding(horizontal = 8.dp, vertical = 4.dp)
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Text(text = label, color = ParchmentMuted, fontSize = 9.sp, fontWeight = FontWeight.Bold)
            Text(text = value, color = ParchmentWhite, fontSize = 12.sp, fontWeight = FontWeight.Bold)
        }
    }
}
