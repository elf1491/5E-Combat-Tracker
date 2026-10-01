package com.example.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
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
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Remove
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.FilterChip
import androidx.compose.material3.FilterChipDefaults
import androidx.compose.material3.FloatingActionButton
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.model.MonsterPreset
import com.example.data.model.MonsterPresets
import com.example.ui.dialogs.AddEnemyDialog
import com.example.ui.theme.DndGold
import com.example.ui.theme.DungeonBorder
import com.example.ui.theme.DungeonCard
import com.example.ui.theme.DungeonCardElevated
import com.example.ui.theme.DungeonSurface
import com.example.ui.theme.MonsterCrimson
import com.example.ui.theme.ParchmentMuted
import com.example.ui.theme.ParchmentWhite
import com.example.ui.viewmodel.CombatTrackerViewModel

@Composable
fun BestiaryScreen(
    viewModel: CombatTrackerViewModel,
    onNavigateToCombat: () -> Unit,
    modifier: Modifier = Modifier
) {
    var searchQuery by remember { mutableStateOf("") }
    var selectedCategory by remember { mutableStateOf("All") }
    var showCustomEnemyDialog by remember { mutableStateOf(false) }

    val categories = listOf("All", "Humanoid", "Undead", "Beast", "Giant", "Dragon", "Aberration")

    val filteredMonsters = remember(searchQuery, selectedCategory) {
        MonsterPresets.list.filter { monster ->
            val matchesCategory = selectedCategory == "All" || monster.type.equals(selectedCategory, ignoreCase = true)
            val matchesSearch = searchQuery.isBlank() ||
                    monster.name.contains(searchQuery, ignoreCase = true) ||
                    monster.cr.contains(searchQuery, ignoreCase = true) ||
                    monster.type.contains(searchQuery, ignoreCase = true)
            matchesCategory && matchesSearch
        }
    }

    Scaffold(
        floatingActionButton = {
            FloatingActionButton(
                onClick = { showCustomEnemyDialog = true },
                containerColor = MonsterCrimson,
                contentColor = ParchmentWhite,
                modifier = Modifier.testTag("fab_custom_enemy")
            ) {
                Icon(Icons.Default.Add, contentDescription = "Create Custom Monster")
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
                        text = "🐉 5E BESTIARY & MONSTERS",
                        color = DndGold,
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold,
                        letterSpacing = 1.sp
                    )
                    Text(
                        text = "Quick 1-tap deployment into combat",
                        color = ParchmentMuted,
                        fontSize = 12.sp
                    )
                }

                Button(
                    onClick = { showCustomEnemyDialog = true },
                    colors = ButtonDefaults.buttonColors(containerColor = MonsterCrimson),
                    modifier = Modifier.testTag("custom_monster_btn")
                ) {
                    Text("+ Custom", color = ParchmentWhite, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                }
            }

            // Search Bar
            OutlinedTextField(
                value = searchQuery,
                onValueChange = { searchQuery = it },
                placeholder = { Text("Search monsters by name or CR...", color = ParchmentMuted) },
                leadingIcon = { Icon(Icons.Default.Search, contentDescription = null, tint = DndGold) },
                singleLine = true,
                colors = OutlinedTextFieldDefaults.colors(
                    focusedTextColor = ParchmentWhite,
                    unfocusedTextColor = ParchmentWhite,
                    focusedBorderColor = DndGold,
                    unfocusedBorderColor = DungeonBorder
                ),
                modifier = Modifier
                    .fillMaxWidth()
                    .testTag("bestiary_search_input")
            )

            Spacer(modifier = Modifier.height(8.dp))

            // Category filter chips
            LazyRow(
                horizontalArrangement = Arrangement.spacedBy(6.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                items(categories) { category ->
                    val isSelected = selectedCategory == category
                    FilterChip(
                        selected = isSelected,
                        onClick = { selectedCategory = category },
                        label = { Text(category, fontSize = 12.sp) },
                        colors = FilterChipDefaults.filterChipColors(
                            selectedContainerColor = DndGold,
                            selectedLabelColor = DungeonCard,
                            containerColor = DungeonCardElevated,
                            labelColor = ParchmentMuted
                        )
                    )
                }
            }

            Spacer(modifier = Modifier.height(10.dp))

            // Monsters list
            LazyColumn(
                verticalArrangement = Arrangement.spacedBy(8.dp),
                modifier = Modifier.fillMaxSize()
            ) {
                items(filteredMonsters, key = { it.name }) { preset ->
                    MonsterPresetCard(
                        preset = preset,
                        onAdd = { count ->
                            viewModel.addMonsterPreset(preset, count = count, rollInit = true)
                            onNavigateToCombat()
                        }
                    )
                }

                item {
                    Spacer(modifier = Modifier.height(72.dp))
                }
            }
        }
    }

    if (showCustomEnemyDialog) {
        AddEnemyDialog(
            onDismiss = { showCustomEnemyDialog = false },
            onAddEnemy = { name, hp, ac, initMod, count, rollInit, cr, notes ->
                viewModel.addEnemyToEncounter(name, hp, ac, initMod, count, rollInit, cr, notes)
                onNavigateToCombat()
            }
        )
    }
}

@Composable
private fun MonsterPresetCard(
    preset: MonsterPreset,
    onAdd: (count: Int) -> Unit
) {
    var spawnCount by remember { mutableIntStateOf(1) }

    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = DungeonCard),
        border = CardDefaults.outlinedCardBorder().copy(brush = Brush.linearGradient(listOf(DungeonBorder, DungeonBorder)))
    ) {
        Column(modifier = Modifier.padding(12.dp)) {
            // Top: Name, Type, and CR Badge
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = preset.name,
                        color = ParchmentWhite,
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Bold
                    )
                    Text(
                        text = preset.type,
                        color = ParchmentMuted,
                        fontSize = 11.sp
                    )
                }

                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(6.dp))
                        .background(MonsterCrimson.copy(alpha = 0.2f))
                        .border(1.dp, MonsterCrimson, RoundedCornerShape(6.dp))
                        .padding(horizontal = 8.dp, vertical = 3.dp)
                ) {
                    Text(
                        text = preset.cr,
                        color = MonsterCrimson,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            // Stat Badges
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(6.dp)
            ) {
                StatBadge(label = "AC", value = "${preset.armorClass}")
                StatBadge(label = "HP", value = "${preset.maxHp}")
                StatBadge(label = "INIT", value = if (preset.initiativeModifier >= 0) "+${preset.initiativeModifier}" else "${preset.initiativeModifier}")
                StatBadge(label = "SPD", value = "${preset.speed}ft")
                StatBadge(label = "PERC", value = "${preset.passivePerception}")
                if (preset.spellDc != null) {
                    StatBadge(label = "DC", value = "${preset.spellDc}")
                }
            }

            if (preset.notes.isNotBlank()) {
                Spacer(modifier = Modifier.height(6.dp))
                Text(
                    text = preset.notes,
                    color = ParchmentMuted,
                    fontSize = 11.sp,
                    maxLines = 2
                )
            }

            Spacer(modifier = Modifier.height(10.dp))

            // Bottom: Quantity stepper & Add button
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text("Qty:", color = ParchmentMuted, fontSize = 12.sp)
                    IconButton(
                        onClick = { if (spawnCount > 1) spawnCount-- },
                        modifier = Modifier.size(28.dp)
                    ) {
                        Icon(Icons.Default.Remove, contentDescription = "Decrease", tint = ParchmentWhite, modifier = Modifier.size(16.dp))
                    }
                    Text(
                        text = "$spawnCount",
                        color = DndGold,
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Bold,
                        modifier = Modifier.padding(horizontal = 4.dp)
                    )
                    IconButton(
                        onClick = { if (spawnCount < 20) spawnCount++ },
                        modifier = Modifier.size(28.dp)
                    ) {
                        Icon(Icons.Default.Add, contentDescription = "Increase", tint = ParchmentWhite, modifier = Modifier.size(16.dp))
                    }
                }

                Button(
                    onClick = { onAdd(spawnCount) },
                    colors = ButtonDefaults.buttonColors(containerColor = MonsterCrimson),
                    modifier = Modifier.testTag("add_monster_${preset.name}")
                ) {
                    Text(
                        text = if (spawnCount > 1) "Deploy $spawnCount Foes" else "Deploy to Combat",
                        color = ParchmentWhite,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
            }
        }
    }
}

@Composable
private fun StatBadge(label: String, value: String) {
    Box(
        modifier = Modifier
            .clip(RoundedCornerShape(6.dp))
            .background(DungeonCardElevated)
            .border(1.dp, DungeonBorder, RoundedCornerShape(6.dp))
            .padding(horizontal = 6.dp, vertical = 3.dp)
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Text(text = label, color = ParchmentMuted, fontSize = 9.sp, fontWeight = FontWeight.SemiBold)
            Text(text = value, color = ParchmentWhite, fontSize = 11.sp, fontWeight = FontWeight.Bold)
        }
    }
}
