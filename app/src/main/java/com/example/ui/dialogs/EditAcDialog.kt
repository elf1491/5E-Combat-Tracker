package com.example.ui.dialogs

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Remove
import androidx.compose.material.icons.filled.Shield
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.model.Combatant
import com.example.data.model.CoverType
import com.example.ui.theme.DndGold
import com.example.ui.theme.DndGoldLight
import com.example.ui.theme.DungeonBorder
import com.example.ui.theme.DungeonCard
import com.example.ui.theme.DungeonCardElevated
import com.example.ui.theme.ParchmentMuted
import com.example.ui.theme.ParchmentWhite
import com.example.ui.theme.PlayerShieldBlue

@Composable
fun EditAcDialog(
    combatant: Combatant,
    onDismiss: () -> Unit,
    onSaveAc: (baseAc: Int, coverType: CoverType) -> Unit
) {
    var baseAc by remember { mutableIntStateOf(combatant.baseArmorClass) }
    var baseAcText by remember { mutableStateOf(combatant.baseArmorClass.toString()) }
    var selectedCover by remember { mutableStateOf(combatant.coverType) }

    val totalAc = (baseAc + selectedCover.acBonus).coerceAtLeast(1)

    AlertDialog(
        onDismissRequest = onDismiss,
        containerColor = DungeonCard,
        title = {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.fillMaxWidth()
            ) {
                Icon(
                    imageVector = Icons.Default.Shield,
                    contentDescription = null,
                    tint = DndGold,
                    modifier = Modifier.size(24.dp)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Column {
                    Text(
                        text = "Edit Armor Class (AC)",
                        color = DndGold,
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold
                    )
                    Text(
                        text = "${combatant.name} • Total AC: $totalAc",
                        color = ParchmentMuted,
                        fontSize = 12.sp
                    )
                }
            }
        },
        text = {
            Column(
                modifier = Modifier.fillMaxWidth(),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                // Section 1: Base AC adjustment
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(8.dp))
                        .background(DungeonCardElevated)
                        .border(1.dp, DungeonBorder, RoundedCornerShape(8.dp))
                        .padding(10.dp)
                ) {
                    Text(
                        text = "BASE ARMOR CLASS",
                        color = DndGold,
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        letterSpacing = 0.5.sp
                    )
                    Spacer(modifier = Modifier.height(6.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.Center
                    ) {
                        // -1 button
                        IconButton(
                            onClick = {
                                if (baseAc > 1) {
                                    baseAc--
                                    baseAcText = baseAc.toString()
                                }
                            },
                            modifier = Modifier
                                .size(44.dp)
                                .clip(RoundedCornerShape(8.dp))
                                .background(DungeonBorder.copy(alpha = 0.5f))
                        ) {
                            Icon(Icons.Default.Remove, contentDescription = "Decrease AC", tint = ParchmentWhite)
                        }

                        Spacer(modifier = Modifier.width(12.dp))

                        OutlinedTextField(
                            value = baseAcText,
                            onValueChange = { input ->
                                if (input.all { it.isDigit() } && input.length <= 3) {
                                    baseAcText = input
                                    input.toIntOrNull()?.let { num ->
                                        if (num in 1..99) baseAc = num
                                    }
                                }
                            },
                            singleLine = true,
                            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                            textStyle = androidx.compose.ui.text.TextStyle(
                                color = ParchmentWhite,
                                fontSize = 22.sp,
                                fontWeight = FontWeight.Bold,
                                textAlign = TextAlign.Center
                            ),
                            colors = OutlinedTextFieldDefaults.colors(
                                focusedBorderColor = DndGold,
                                unfocusedBorderColor = DungeonBorder
                            ),
                            modifier = Modifier
                                .width(90.dp)
                                .testTag("base_ac_input")
                        )

                        Spacer(modifier = Modifier.width(12.dp))

                        // +1 button
                        IconButton(
                            onClick = {
                                if (baseAc < 99) {
                                    baseAc++
                                    baseAcText = baseAc.toString()
                                }
                            },
                            modifier = Modifier
                                .size(44.dp)
                                .clip(RoundedCornerShape(8.dp))
                                .background(DungeonBorder.copy(alpha = 0.5f))
                        ) {
                            Icon(Icons.Default.Add, contentDescription = "Increase AC", tint = DndGold)
                        }
                    }
                }

                // Section 2: Cover Options
                Column(modifier = Modifier.fillMaxWidth()) {
                    Text(
                        text = "5E COVER STATUS (AC BONUS)",
                        color = DndGold,
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        letterSpacing = 0.5.sp
                    )
                    Text(
                        text = "Toggle cover to apply respective AC bonus & condition",
                        color = ParchmentMuted,
                        fontSize = 10.5.sp
                    )
                    Spacer(modifier = Modifier.height(6.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        CoverOptionChip(
                            title = "None",
                            subtitle = "+0",
                            isSelected = selectedCover == CoverType.NONE,
                            tag = "cover_none_btn",
                            modifier = Modifier.weight(1f),
                            onClick = { selectedCover = CoverType.NONE }
                        )

                        CoverOptionChip(
                            title = "Half",
                            subtitle = "+2 AC",
                            isSelected = selectedCover == CoverType.HALF,
                            tag = "cover_half_btn",
                            modifier = Modifier.weight(1f),
                            onClick = {
                                selectedCover = if (selectedCover == CoverType.HALF) CoverType.NONE else CoverType.HALF
                            }
                        )

                        CoverOptionChip(
                            title = "3/4",
                            subtitle = "+5 AC",
                            isSelected = selectedCover == CoverType.THREE_QUARTERS,
                            tag = "cover_three_quarter_btn",
                            modifier = Modifier.weight(1f),
                            onClick = {
                                selectedCover = if (selectedCover == CoverType.THREE_QUARTERS) CoverType.NONE else CoverType.THREE_QUARTERS
                            }
                        )

                        CoverOptionChip(
                            title = "Total",
                            subtitle = "+10 AC",
                            isSelected = selectedCover == CoverType.TOTAL,
                            tag = "cover_total_btn",
                            modifier = Modifier.weight(1f),
                            onClick = {
                                selectedCover = if (selectedCover == CoverType.TOTAL) CoverType.NONE else CoverType.TOTAL
                            }
                        )
                    }

                    // Cover details note
                    Spacer(modifier = Modifier.height(6.dp))
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(6.dp))
                            .background(DungeonCardElevated.copy(alpha = 0.6f))
                            .border(0.5.dp, DungeonBorder, RoundedCornerShape(6.dp))
                            .padding(horizontal = 8.dp, vertical = 6.dp)
                    ) {
                        val coverDesc = when (selectedCover) {
                            CoverType.NONE -> "Standard line of sight. No cover bonuses."
                            CoverType.HALF -> "Half Cover: Obstacle blocks at least half its body. +2 AC and +2 Dex saves."
                            CoverType.THREE_QUARTERS -> "Three-Quarters Cover: Obstacle blocks 3/4 of its body. +5 AC and +5 Dex saves."
                            CoverType.TOTAL -> "Total Cover: Completely concealed by an obstacle. Attacks/spells cannot target directly (+10 AC applied)."
                        }
                        Text(
                            text = coverDesc,
                            color = if (selectedCover != CoverType.NONE) PlayerShieldBlue else ParchmentMuted,
                            fontSize = 10.5.sp,
                            lineHeight = 13.sp
                        )
                    }
                }

                // Total Summary Box
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(8.dp))
                        .background(DndGold.copy(alpha = 0.12f))
                        .border(1.dp, DndGold.copy(alpha = 0.5f), RoundedCornerShape(8.dp))
                        .padding(horizontal = 10.dp, vertical = 8.dp)
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "Effective Armor Class:",
                            color = ParchmentWhite,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Medium
                        )
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(
                                text = "$totalAc AC",
                                color = DndGoldLight,
                                fontSize = 16.sp,
                                fontWeight = FontWeight.ExtraBold
                            )
                            if (selectedCover != CoverType.NONE) {
                                Spacer(modifier = Modifier.width(4.dp))
                                Text(
                                    text = "($baseAc base + ${selectedCover.acBonus} cover)",
                                    color = ParchmentMuted,
                                    fontSize = 10.sp
                                )
                            }
                        }
                    }
                }
            }
        },
        confirmButton = {
            Button(
                onClick = {
                    onSaveAc(baseAc, selectedCover)
                    onDismiss()
                },
                colors = ButtonDefaults.buttonColors(containerColor = DndGold),
                modifier = Modifier.testTag("save_ac_btn")
            ) {
                Text("Save AC", color = DungeonCard, fontWeight = FontWeight.Bold)
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text("Cancel", color = ParchmentMuted)
            }
        }
    )
}

@Composable
private fun CoverOptionChip(
    title: String,
    subtitle: String,
    isSelected: Boolean,
    tag: String,
    modifier: Modifier = Modifier,
    onClick: () -> Unit
) {
    Box(
        modifier = modifier
            .clip(RoundedCornerShape(6.dp))
            .background(if (isSelected) DndGold.copy(alpha = 0.25f) else DungeonCardElevated)
            .border(
                width = if (isSelected) 1.5.dp else 0.5.dp,
                color = if (isSelected) DndGold else DungeonBorder,
                shape = RoundedCornerShape(6.dp)
            )
            .clickable(onClick = onClick)
            .padding(vertical = 6.dp, horizontal = 4.dp)
            .testTag(tag),
        contentAlignment = Alignment.Center
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Text(
                text = title,
                color = if (isSelected) DndGoldLight else ParchmentWhite,
                fontSize = 11.sp,
                fontWeight = FontWeight.Bold
            )
            Text(
                text = subtitle,
                color = if (isSelected) DndGold else ParchmentMuted,
                fontSize = 9.5.sp,
                fontWeight = FontWeight.SemiBold
            )
        }
    }
}
