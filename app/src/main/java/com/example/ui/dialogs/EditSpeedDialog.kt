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
import androidx.compose.material.icons.filled.DirectionsWalk
import androidx.compose.material.icons.filled.Remove
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Switch
import androidx.compose.material3.SwitchDefaults
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
import com.example.ui.theme.DndGold
import com.example.ui.theme.DndGoldLight
import com.example.ui.theme.DungeonBorder
import com.example.ui.theme.DungeonCard
import com.example.ui.theme.DungeonCardElevated
import com.example.ui.theme.ParchmentMuted
import com.example.ui.theme.ParchmentWhite

@Composable
fun EditSpeedDialog(
    combatant: Combatant,
    onDismiss: () -> Unit,
    onSaveSpeed: (baseSpeed: Int, isDifficultTerrain: Boolean) -> Unit
) {
    var baseSpeed by remember { mutableIntStateOf(combatant.baseSpeed) }
    var baseSpeedText by remember { mutableStateOf(combatant.baseSpeed.toString()) }
    var isDifficultTerrain by remember { mutableStateOf(combatant.isDifficultTerrain) }

    val effectiveSpeed = if (isDifficultTerrain) (baseSpeed / 2) else baseSpeed

    AlertDialog(
        onDismissRequest = onDismiss,
        containerColor = DungeonCard,
        title = {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.fillMaxWidth()
            ) {
                Text("🥾", fontSize = 22.sp)
                Spacer(modifier = Modifier.width(8.dp))
                Column {
                    Text(
                        text = "Edit Movement Speed",
                        color = DndGold,
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold
                    )
                    Text(
                        text = "${combatant.name} • Effective Speed: ${effectiveSpeed}ft",
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
                // Section 1: Base Speed adjustment
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(8.dp))
                        .background(DungeonCardElevated)
                        .border(1.dp, DungeonBorder, RoundedCornerShape(8.dp))
                        .padding(10.dp)
                ) {
                    Text(
                        text = "BASE SPEED (FEET)",
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
                        // -5 button
                        IconButton(
                            onClick = {
                                if (baseSpeed >= 5) {
                                    baseSpeed -= 5
                                    baseSpeedText = baseSpeed.toString()
                                }
                            },
                            modifier = Modifier
                                .size(44.dp)
                                .clip(RoundedCornerShape(8.dp))
                                .background(DungeonBorder.copy(alpha = 0.5f))
                        ) {
                            Text("-5", color = ParchmentWhite, fontSize = 13.sp, fontWeight = FontWeight.Bold)
                        }

                        Spacer(modifier = Modifier.width(10.dp))

                        OutlinedTextField(
                            value = baseSpeedText,
                            onValueChange = { input ->
                                if (input.all { it.isDigit() } && input.length <= 3) {
                                    baseSpeedText = input
                                    input.toIntOrNull()?.let { num ->
                                        if (num in 0..300) baseSpeed = num
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
                                .testTag("base_speed_input")
                        )

                        Spacer(modifier = Modifier.width(10.dp))

                        // +5 button
                        IconButton(
                            onClick = {
                                if (baseSpeed <= 295) {
                                    baseSpeed += 5
                                    baseSpeedText = baseSpeed.toString()
                                }
                            },
                            modifier = Modifier
                                .size(44.dp)
                                .clip(RoundedCornerShape(8.dp))
                                .background(DungeonBorder.copy(alpha = 0.5f))
                        ) {
                            Text("+5", color = DndGold, fontSize = 13.sp, fontWeight = FontWeight.Bold)
                        }
                    }

                    Spacer(modifier = Modifier.height(8.dp))

                    // Preset Quick Chips (20, 25, 30, 35, 40)
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(4.dp)
                    ) {
                        listOf(20, 25, 30, 35, 40).forEach { preset ->
                            val isSelected = baseSpeed == preset
                            Box(
                                modifier = Modifier
                                    .weight(1f)
                                    .clip(RoundedCornerShape(6.dp))
                                    .background(if (isSelected) DndGold.copy(alpha = 0.25f) else DungeonBorder.copy(alpha = 0.4f))
                                    .border(0.5.dp, if (isSelected) DndGold else DungeonBorder, RoundedCornerShape(6.dp))
                                    .clickable {
                                        baseSpeed = preset
                                        baseSpeedText = preset.toString()
                                    }
                                    .padding(vertical = 4.dp),
                                contentAlignment = Alignment.Center
                            ) {
                                Text(
                                    text = "${preset}ft",
                                    color = if (isSelected) DndGoldLight else ParchmentWhite,
                                    fontSize = 11.sp,
                                    fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal
                                )
                            }
                        }
                    }
                }

                // Section 2: Difficult Terrain Toggle
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(8.dp))
                        .background(if (isDifficultTerrain) Color(0xFFD97706).copy(alpha = 0.15f) else DungeonCardElevated)
                        .border(
                            width = if (isDifficultTerrain) 1.5.dp else 1.dp,
                            color = if (isDifficultTerrain) Color(0xFFD97706) else DungeonBorder,
                            shape = RoundedCornerShape(8.dp)
                        )
                        .clickable { isDifficultTerrain = !isDifficultTerrain }
                        .padding(12.dp)
                        .testTag("toggle_difficult_terrain_btn")
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Column(modifier = Modifier.weight(1f)) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Text("🪵", fontSize = 16.sp)
                                Spacer(modifier = Modifier.width(6.dp))
                                Text(
                                    text = "Difficult Terrain",
                                    color = if (isDifficultTerrain) Color(0xFFFDBA74) else ParchmentWhite,
                                    fontSize = 14.sp,
                                    fontWeight = FontWeight.Bold
                                )
                            }
                            Spacer(modifier = Modifier.height(2.dp))
                            Text(
                                text = "Halves speed (${baseSpeed}ft ➔ ${baseSpeed / 2}ft) and adds condition status.",
                                color = ParchmentMuted,
                                fontSize = 11.sp,
                                lineHeight = 14.sp
                            )
                        }

                        Switch(
                            checked = isDifficultTerrain,
                            onCheckedChange = { isDifficultTerrain = it },
                            colors = SwitchDefaults.colors(
                                checkedThumbColor = Color(0xFFFDBA74),
                                checkedTrackColor = Color(0xFFD97706),
                                uncheckedThumbColor = ParchmentMuted,
                                uncheckedTrackColor = DungeonBorder
                            )
                        )
                    }
                }

                // Section 3: Summary Banner
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
                            text = "Effective Movement Speed:",
                            color = ParchmentWhite,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Medium
                        )
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(
                                text = "${effectiveSpeed}ft",
                                color = if (isDifficultTerrain) Color(0xFFFDBA74) else DndGoldLight,
                                fontSize = 16.sp,
                                fontWeight = FontWeight.ExtraBold
                            )
                            if (isDifficultTerrain) {
                                Spacer(modifier = Modifier.width(4.dp))
                                Text(
                                    text = "(½ of ${baseSpeed}ft)",
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
                    onSaveSpeed(baseSpeed, isDifficultTerrain)
                    onDismiss()
                },
                colors = ButtonDefaults.buttonColors(containerColor = DndGold),
                modifier = Modifier.testTag("save_speed_btn")
            ) {
                Text("Save Speed", color = DungeonCard, fontWeight = FontWeight.Bold)
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text("Cancel", color = ParchmentMuted)
            }
        }
    )
}
