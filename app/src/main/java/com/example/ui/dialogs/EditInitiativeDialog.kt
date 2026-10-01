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
import androidx.compose.material.icons.filled.Casino
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
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
import com.example.data.model.Combatant
import com.example.ui.theme.DndGold
import com.example.ui.theme.DungeonBorder
import com.example.ui.theme.DungeonCard
import com.example.ui.theme.DungeonCardElevated
import com.example.ui.theme.MonsterCrimson
import com.example.ui.theme.ParchmentMuted
import com.example.ui.theme.ParchmentWhite
import com.example.ui.theme.PlayerShieldBlue
import kotlin.random.Random

@Composable
fun EditInitiativeDialog(
    combatant: Combatant,
    onDismiss: () -> Unit,
    onSaveInitiative: (Int) -> Unit
) {
    var initiativeText by remember { mutableStateOf(combatant.initiativeRoll.toString()) }

    AlertDialog(
        onDismissRequest = onDismiss,
        containerColor = DungeonCard,
        title = {
            Column {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "⚡ Edit Initiative",
                        color = DndGold,
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold
                    )
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(6.dp))
                            .background(if (combatant.isPlayer) PlayerShieldBlue.copy(alpha = 0.2f) else MonsterCrimson.copy(alpha = 0.2f))
                            .padding(horizontal = 8.dp, vertical = 2.dp)
                    ) {
                        Text(
                            text = if (combatant.isPlayer) "Player" else "Monster",
                            color = if (combatant.isPlayer) PlayerShieldBlue else MonsterCrimson,
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = "${combatant.name} (Mod: ${if (combatant.initiativeModifier >= 0) "+${combatant.initiativeModifier}" else "${combatant.initiativeModifier}"})",
                    color = ParchmentMuted,
                    fontSize = 13.sp
                )
            }
        },
        text = {
            Column(modifier = Modifier.fillMaxWidth()) {
                Text(
                    text = "Enter roll manually (from physical dice or digital):",
                    color = ParchmentWhite,
                    fontSize = 13.sp
                )

                Spacer(modifier = Modifier.height(8.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    OutlinedTextField(
                        value = initiativeText,
                        onValueChange = { input ->
                            if (input.matches(Regex("^-?\\d{0,3}$"))) {
                                initiativeText = input
                            }
                        },
                        label = { Text("Initiative Total", color = ParchmentMuted) },
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
                            .testTag("manual_initiative_input")
                    )

                    // Quick Roll d20 + mod button
                    Button(
                        onClick = {
                            val roll = Random.nextInt(1, 21) + combatant.initiativeModifier
                            initiativeText = roll.toString()
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = DungeonCardElevated),
                        border = ButtonDefaults.outlinedButtonBorder.copy(
                            brush = Brush.linearGradient(listOf(DungeonBorder, DndGold))
                        ),
                        modifier = Modifier.testTag("roll_d20_for_combatant_btn")
                    ) {
                        Icon(Icons.Default.Casino, contentDescription = null, tint = DndGold, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("Roll d20", color = ParchmentWhite, fontSize = 12.sp)
                    }
                }

                Spacer(modifier = Modifier.height(10.dp))

                // Quick increment / decrement chips
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    listOf(-5, -1, 1, 5).forEach { delta ->
                        Box(
                            modifier = Modifier
                                .weight(1f)
                                .clip(RoundedCornerShape(6.dp))
                                .background(DungeonCardElevated)
                                .border(1.dp, DungeonBorder, RoundedCornerShape(6.dp))
                                .clickable {
                                    val current = initiativeText.toIntOrNull() ?: 0
                                    initiativeText = (current + delta).toString()
                                }
                                .padding(vertical = 6.dp),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = if (delta > 0) "+$delta" else "$delta",
                                color = ParchmentWhite,
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }
                }
            }
        },
        confirmButton = {
            Button(
                onClick = {
                    val score = initiativeText.toIntOrNull() ?: 0
                    onSaveInitiative(score)
                    onDismiss()
                },
                colors = ButtonDefaults.buttonColors(containerColor = DndGold),
                modifier = Modifier.testTag("save_initiative_btn")
            ) {
                Text("Save Initiative", color = DungeonCard, fontWeight = FontWeight.Bold)
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text("Cancel", color = ParchmentMuted)
            }
        }
    )
}
