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
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
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
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.model.Combatant
import com.example.ui.theme.BloodiedRed
import com.example.ui.theme.DndGold
import com.example.ui.theme.DungeonBorder
import com.example.ui.theme.DungeonCard
import com.example.ui.theme.DungeonCardElevated
import com.example.ui.theme.HealthGreen
import com.example.ui.theme.ParchmentMuted
import com.example.ui.theme.ParchmentWhite
import com.example.ui.theme.TempHpBlue

@Composable
fun DamageHealDialog(
    combatant: Combatant,
    onDismiss: () -> Unit,
    onApplyDamage: (Int) -> Unit,
    onApplyHeal: (Int) -> Unit,
    onSetTempHp: (Int) -> Unit,
    onSetDirectHp: (Int) -> Unit
) {
    var amountText by remember { mutableStateOf("") }
    val amount = amountText.toIntOrNull() ?: 0

    AlertDialog(
        onDismissRequest = onDismiss,
        containerColor = DungeonCard,
        title = {
            Column {
                Text(
                    text = "Modify HP: ${combatant.name}",
                    color = ParchmentWhite,
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold
                )
                Spacer(modifier = Modifier.height(4.dp))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Text(
                        text = "Current: ${combatant.currentHp} / ${combatant.maxHp}",
                        color = ParchmentMuted,
                        fontSize = 13.sp
                    )
                    if (combatant.tempHp > 0) {
                        Text(
                            text = "Temp HP: ${combatant.tempHp}",
                            color = TempHpBlue,
                            fontSize = 13.sp,
                            fontWeight = FontWeight.SemiBold
                        )
                    }
                }
            }
        },
        text = {
            Column(modifier = Modifier.fillMaxWidth()) {
                OutlinedTextField(
                    value = amountText,
                    onValueChange = { input ->
                        if (input.all { it.isDigit() } && input.length <= 4) {
                            amountText = input
                        }
                    },
                    label = { Text("Amount", color = ParchmentMuted) },
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                    singleLine = true,
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedTextColor = ParchmentWhite,
                        unfocusedTextColor = ParchmentWhite,
                        focusedBorderColor = DndGold,
                        unfocusedBorderColor = DungeonBorder
                    ),
                    modifier = Modifier
                        .fillMaxWidth()
                        .testTag("hp_amount_input")
                )

                Spacer(modifier = Modifier.height(10.dp))

                // Quick increment tags
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceEvenly
                ) {
                    listOf(1, 5, 10, 20).forEach { inc ->
                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(6.dp))
                                .background(DungeonCardElevated)
                                .border(1.dp, DungeonBorder, RoundedCornerShape(6.dp))
                                .clickable {
                                    val current = amountText.toIntOrNull() ?: 0
                                    amountText = (current + inc).toString()
                                }
                                .padding(horizontal = 12.dp, vertical = 6.dp),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = "+$inc",
                                color = ParchmentWhite,
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                // Action buttons: Damage, Heal, Temp HP
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Button(
                        onClick = {
                            val effective = if (amount > 0) amount else 1
                            onApplyDamage(effective)
                            onDismiss()
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = BloodiedRed),
                        modifier = Modifier
                            .weight(1f)
                            .testTag("apply_damage_button")
                    ) {
                        Text("💥 Damage", fontSize = 13.sp)
                    }

                    Button(
                        onClick = {
                            val effective = if (amount > 0) amount else 1
                            onApplyHeal(effective)
                            onDismiss()
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = HealthGreen),
                        modifier = Modifier
                            .weight(1f)
                            .testTag("apply_heal_button")
                    ) {
                        Text("💚 Heal", fontSize = 13.sp)
                    }
                }

                Spacer(modifier = Modifier.height(8.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Button(
                        onClick = {
                            onSetTempHp(amount)
                            onDismiss()
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = TempHpBlue),
                        modifier = Modifier
                            .weight(1f)
                            .testTag("set_temp_hp_button")
                    ) {
                        Text("🛡️ Temp HP", fontSize = 13.sp)
                    }

                    Button(
                        onClick = {
                            onSetDirectHp(amount)
                            onDismiss()
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = DungeonCardElevated),
                        modifier = Modifier
                            .weight(1f)
                            .testTag("set_direct_hp_button")
                    ) {
                        Text("Direct Set", fontSize = 13.sp, color = ParchmentWhite)
                    }
                }
            }
        },
        confirmButton = {},
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text("Cancel", color = ParchmentMuted)
            }
        }
    )
}
