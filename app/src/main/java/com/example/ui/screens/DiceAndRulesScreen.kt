package com.example.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
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
import androidx.compose.material.icons.filled.Casino
import androidx.compose.material.icons.filled.Remove
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.FilterChip
import androidx.compose.material3.FilterChipDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Tab
import androidx.compose.material3.TabRow
import androidx.compose.material3.TabRowDefaults
import androidx.compose.material3.TabRowDefaults.tabIndicatorOffset
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
import com.example.data.model.Condition
import com.example.ui.theme.BloodiedRed
import com.example.ui.theme.DndGold
import com.example.ui.theme.DndGoldLight
import com.example.ui.theme.DungeonBorder
import com.example.ui.theme.DungeonCard
import com.example.ui.theme.DungeonCardElevated
import com.example.ui.theme.DungeonSurface
import com.example.ui.theme.HealthGreen
import com.example.ui.theme.ParchmentMuted
import com.example.ui.theme.ParchmentWhite
import com.example.ui.viewmodel.CombatTrackerViewModel
import com.example.ui.viewmodel.DiceRollResult
import com.example.ui.viewmodel.RollMode

@Composable
fun DiceAndRulesScreen(
    viewModel: CombatTrackerViewModel,
    lastRoll: DiceRollResult?,
    diceHistory: List<DiceRollResult>,
    modifier: Modifier = Modifier
) {
    var selectedTab by remember { mutableIntStateOf(0) } // 0 = Dice Roller, 1 = 5e Conditions Reference

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(DungeonSurface)
            .padding(horizontal = 12.dp)
    ) {
        // Tab switcher
        TabRow(
            selectedTabIndex = selectedTab,
            containerColor = DungeonCard,
            contentColor = DndGold,
            indicator = { tabPositions ->
                TabRowDefaults.SecondaryIndicator(
                    Modifier.tabIndicatorOffset(tabPositions[selectedTab]),
                    color = DndGold
                )
            },
            modifier = Modifier
                .fillMaxWidth()
                .padding(vertical = 8.dp)
                .clip(RoundedCornerShape(8.dp))
        ) {
            Tab(
                selected = selectedTab == 0,
                onClick = { selectedTab = 0 },
                text = { Text("🎲 Dice Roller", fontWeight = FontWeight.Bold) }
            )
            Tab(
                selected = selectedTab == 1,
                onClick = { selectedTab = 1 },
                text = { Text("📜 5e Conditions Guide", fontWeight = FontWeight.Bold) }
            )
        }

        if (selectedTab == 0) {
            DiceRollerTab(
                onRoll = { sides, count, mod, mode ->
                    viewModel.rollDice(sides, count, mod, mode)
                },
                lastRoll = lastRoll,
                history = diceHistory
            )
        } else {
            ConditionsReferenceTab()
        }
    }
}

@OptIn(ExperimentalLayoutApi::class)
@Composable
private fun DiceRollerTab(
    onRoll: (sides: Int, count: Int, modifier: Int, rollMode: RollMode) -> Unit,
    lastRoll: DiceRollResult?,
    history: List<DiceRollResult>
) {
    var selectedSides by remember { mutableIntStateOf(20) }
    var diceCount by remember { mutableIntStateOf(1) }
    var modifier by remember { mutableIntStateOf(0) }
    var rollMode by remember { mutableStateOf(RollMode.NORMAL) }

    val diceOptions = listOf(4, 6, 8, 10, 12, 20, 100)

    LazyColumn(
        verticalArrangement = Arrangement.spacedBy(10.dp),
        modifier = Modifier.fillMaxSize()
    ) {
        item {
            // Dice Types Row
            Text("SELECT DIE TYPE", color = DndGold, fontSize = 11.sp, fontWeight = FontWeight.Bold, letterSpacing = 1.sp)
            Spacer(modifier = Modifier.height(4.dp))
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(6.dp)
            ) {
                diceOptions.forEach { sides ->
                    val isSelected = selectedSides == sides
                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .clip(RoundedCornerShape(8.dp))
                            .background(if (isSelected) DndGold else DungeonCardElevated)
                            .border(1.dp, if (isSelected) DndGold else DungeonBorder, RoundedCornerShape(8.dp))
                            .clickable { selectedSides = sides }
                            .padding(vertical = 10.dp)
                            .testTag("select_die_d$sides"),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = "d$sides",
                            color = if (isSelected) DungeonCard else ParchmentWhite,
                            fontSize = 13.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            }
        }

        // Modifiers & Advantage Controls
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = DungeonCard),
                border = CardDefaults.outlinedCardBorder().copy(brush = Brush.linearGradient(listOf(DungeonBorder, DungeonBorder)))
            ) {
                Column(modifier = Modifier.padding(12.dp)) {
                    // Count and Modifier controls
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        // Dice Count
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text("Dice Count:", color = ParchmentMuted, fontSize = 12.sp)
                            IconButton(onClick = { if (diceCount > 1) diceCount-- }, modifier = Modifier.size(28.dp)) {
                                Icon(Icons.Default.Remove, contentDescription = null, tint = ParchmentWhite, modifier = Modifier.size(16.dp))
                            }
                            Text("$diceCount", color = DndGold, fontSize = 14.sp, fontWeight = FontWeight.Bold)
                            IconButton(onClick = { if (diceCount < 10) diceCount++ }, modifier = Modifier.size(28.dp)) {
                                Icon(Icons.Default.Add, contentDescription = null, tint = ParchmentWhite, modifier = Modifier.size(16.dp))
                            }
                        }

                        // Modifier
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text("Modifier:", color = ParchmentMuted, fontSize = 12.sp)
                            IconButton(onClick = { modifier-- }, modifier = Modifier.size(28.dp)) {
                                Icon(Icons.Default.Remove, contentDescription = null, tint = ParchmentWhite, modifier = Modifier.size(16.dp))
                            }
                            Text(
                                text = if (modifier >= 0) "+$modifier" else "$modifier",
                                color = DndGold,
                                fontSize = 14.sp,
                                fontWeight = FontWeight.Bold
                            )
                            IconButton(onClick = { modifier++ }, modifier = Modifier.size(28.dp)) {
                                Icon(Icons.Default.Add, contentDescription = null, tint = ParchmentWhite, modifier = Modifier.size(16.dp))
                            }
                        }
                    }

                    // Advantage / Disadvantage options for d20
                    if (selectedSides == 20 && diceCount == 1) {
                        Spacer(modifier = Modifier.height(8.dp))
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(6.dp)
                        ) {
                            listOf(
                                RollMode.NORMAL to "Normal",
                                RollMode.ADVANTAGE to "Advantage",
                                RollMode.DISADVANTAGE to "Disadvantage"
                            ).forEach { (mode, label) ->
                                val isSelected = rollMode == mode
                                FilterChip(
                                    selected = isSelected,
                                    onClick = { rollMode = mode },
                                    label = { Text(label, fontSize = 11.sp) },
                                    colors = FilterChipDefaults.filterChipColors(
                                        selectedContainerColor = DndGold,
                                        selectedLabelColor = DungeonCard,
                                        containerColor = DungeonCardElevated,
                                        labelColor = ParchmentMuted
                                    ),
                                    modifier = Modifier.weight(1f)
                                )
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(10.dp))

                    Button(
                        onClick = { onRoll(selectedSides, diceCount, modifier, rollMode) },
                        colors = ButtonDefaults.buttonColors(containerColor = DndGold),
                        modifier = Modifier
                            .fillMaxWidth()
                            .testTag("roll_dice_action_btn")
                    ) {
                        Text(
                            text = "🎲 Roll ${diceCount}d$selectedSides ${if (modifier != 0) (if (modifier > 0) "+$modifier" else "$modifier") else ""}",
                            color = DungeonCard,
                            fontSize = 15.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            }
        }

        // Active Roll Spotlight
        if (lastRoll != null) {
            item {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(containerColor = DungeonCardElevated),
                    border = CardDefaults.outlinedCardBorder().copy(
                        brush = Brush.linearGradient(
                            when {
                                lastRoll.isNat20 -> listOf(DndGoldLight, DndGold)
                                lastRoll.isNat1 -> listOf(BloodiedRed, BloodiedRed)
                                else -> listOf(DungeonBorder, DndGold)
                            }
                        )
                    )
                ) {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(16.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Text(
                            text = when {
                                lastRoll.isNat20 -> "🌟 NATURAL 20! CRITICAL HIT!"
                                lastRoll.isNat1 -> "💀 NATURAL 1! CRITICAL FUMBLE!"
                                else -> "ROLL RESULT"
                            },
                            color = when {
                                lastRoll.isNat20 -> DndGoldLight
                                lastRoll.isNat1 -> BloodiedRed
                                else -> ParchmentMuted
                            },
                            fontSize = 12.sp,
                            fontWeight = FontWeight.ExtraBold,
                            letterSpacing = 1.sp
                        )

                        Spacer(modifier = Modifier.height(6.dp))

                        Text(
                            text = "${lastRoll.total}",
                            color = when {
                                lastRoll.isNat20 -> DndGoldLight
                                lastRoll.isNat1 -> BloodiedRed
                                else -> ParchmentWhite
                            },
                            fontSize = 44.sp,
                            fontWeight = FontWeight.ExtraBold
                        )

                        Text(
                            text = buildString {
                                append("${lastRoll.dice} (${lastRoll.rolls.joinToString(", ")})")
                                if (lastRoll.discardedRoll != null) {
                                    append(" [discarded ${lastRoll.discardedRoll}]")
                                }
                                if (lastRoll.modifier != 0) {
                                    append(if (lastRoll.modifier > 0) " + ${lastRoll.modifier}" else " - ${-lastRoll.modifier}")
                                }
                            },
                            color = ParchmentMuted,
                            fontSize = 13.sp
                        )
                    }
                }
            }
        }

        // History
        if (history.isNotEmpty()) {
            item {
                Text(
                    text = "ROLL HISTORY",
                    color = DndGold,
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold,
                    letterSpacing = 1.sp,
                    modifier = Modifier.padding(top = 8.dp)
                )
            }

            items(history) { roll ->
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(6.dp))
                        .background(DungeonCard)
                        .padding(horizontal = 12.dp, vertical = 8.dp)
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "${roll.dice}: [${roll.rolls.joinToString()}] ${if (roll.modifier != 0) (if (roll.modifier > 0) "+${roll.modifier}" else "${roll.modifier}") else ""}",
                            color = ParchmentMuted,
                            fontSize = 13.sp
                        )
                        Text(
                            text = "= ${roll.total}",
                            color = if (roll.isNat20) DndGold else if (roll.isNat1) BloodiedRed else ParchmentWhite,
                            fontSize = 14.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            }
        }

        item {
            Spacer(modifier = Modifier.height(24.dp))
        }
    }
}

@Composable
private fun ConditionsReferenceTab() {
    LazyColumn(
        verticalArrangement = Arrangement.spacedBy(8.dp),
        modifier = Modifier.fillMaxSize()
    ) {
        item {
            Text(
                text = "5E CONDITIONS QUICK REFERENCE",
                color = DndGold,
                fontSize = 12.sp,
                fontWeight = FontWeight.Bold,
                letterSpacing = 1.sp,
                modifier = Modifier.padding(vertical = 4.dp)
            )
        }

        items(Condition.values()) { condition ->
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = DungeonCard),
                border = CardDefaults.outlinedCardBorder().copy(brush = Brush.linearGradient(listOf(DungeonBorder, DungeonBorder)))
            ) {
                Column(modifier = Modifier.padding(12.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = condition.displayName,
                            color = condition.color,
                            fontSize = 15.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = condition.description,
                        color = ParchmentWhite,
                        fontSize = 12.sp,
                        lineHeight = 17.sp
                    )
                }
            }
        }

        item {
            Spacer(modifier = Modifier.height(24.dp))
        }
    }
}
