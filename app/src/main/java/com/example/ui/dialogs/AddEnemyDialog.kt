package com.example.ui.dialogs

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Remove
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Checkbox
import androidx.compose.material3.CheckboxDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
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
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ui.theme.BloodiedRed
import com.example.ui.theme.DndGold
import com.example.ui.theme.DungeonBorder
import com.example.ui.theme.DungeonCard
import com.example.ui.theme.DungeonCardElevated
import com.example.ui.theme.MonsterCrimson
import com.example.ui.theme.ParchmentMuted
import com.example.ui.theme.ParchmentWhite

@Composable
fun AddEnemyDialog(
    onDismiss: () -> Unit,
    onAddEnemy: (name: String, hp: Int, ac: Int, initMod: Int, count: Int, rollInit: Boolean, cr: String, notes: String) -> Unit
) {
    var name by remember { mutableStateOf("") }
    var hpText by remember { mutableStateOf("15") }
    var acText by remember { mutableStateOf("13") }
    var initModText by remember { mutableStateOf("1") }
    var count by remember { mutableIntStateOf(1) }
    var autoRollInit by remember { mutableStateOf(true) }
    var crText by remember { mutableStateOf("") }
    var notes by remember { mutableStateOf("") }

    AlertDialog(
        onDismissRequest = onDismiss,
        containerColor = DungeonCard,
        title = {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text(
                    text = "👹 Quick Add Enemy",
                    color = ParchmentWhite,
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold
                )
            }
        },
        text = {
            Column(modifier = Modifier.fillMaxWidth()) {
                OutlinedTextField(
                    value = name,
                    onValueChange = { name = it },
                    label = { Text("Enemy / Monster Name *", color = ParchmentMuted) },
                    placeholder = { Text("e.g. Goblin Raider, Orc Warrior", color = ParchmentMuted.copy(alpha = 0.5f)) },
                    singleLine = true,
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedTextColor = ParchmentWhite,
                        unfocusedTextColor = ParchmentWhite,
                        focusedBorderColor = MonsterCrimson,
                        unfocusedBorderColor = DungeonBorder
                    ),
                    modifier = Modifier
                        .fillMaxWidth()
                        .testTag("enemy_name_input")
                )

                Spacer(modifier = Modifier.height(10.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    OutlinedTextField(
                        value = hpText,
                        onValueChange = { if (it.all { c -> c.isDigit() } && it.length <= 4) hpText = it },
                        label = { Text("HP *", color = ParchmentMuted) },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                        singleLine = true,
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedTextColor = ParchmentWhite,
                            unfocusedTextColor = ParchmentWhite,
                            focusedBorderColor = MonsterCrimson,
                            unfocusedBorderColor = DungeonBorder
                        ),
                        modifier = Modifier
                            .weight(1f)
                            .testTag("enemy_hp_input")
                    )

                    OutlinedTextField(
                        value = acText,
                        onValueChange = { if (it.all { c -> c.isDigit() } && it.length <= 2) acText = it },
                        label = { Text("AC *", color = ParchmentMuted) },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                        singleLine = true,
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedTextColor = ParchmentWhite,
                            unfocusedTextColor = ParchmentWhite,
                            focusedBorderColor = MonsterCrimson,
                            unfocusedBorderColor = DungeonBorder
                        ),
                        modifier = Modifier
                            .weight(1f)
                            .testTag("enemy_ac_input")
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
                            focusedBorderColor = MonsterCrimson,
                            unfocusedBorderColor = DungeonBorder
                        ),
                        modifier = Modifier
                            .weight(1f)
                            .testTag("enemy_init_mod_input")
                    )
                }

                Spacer(modifier = Modifier.height(12.dp))

                // Quantity Stepper (e.g. 1 to 10 enemies)
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "Spawn Quantity:",
                        color = ParchmentWhite,
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Medium
                    )

                    Row(verticalAlignment = Alignment.CenterVertically) {
                        IconButton(
                            onClick = { if (count > 1) count-- },
                            modifier = Modifier.testTag("decrease_count_btn")
                        ) {
                            Icon(Icons.Default.Remove, contentDescription = "Decrease", tint = ParchmentWhite)
                        }

                        Text(
                            text = "$count",
                            color = DndGold,
                            fontSize = 17.sp,
                            fontWeight = FontWeight.Bold,
                            modifier = Modifier.padding(horizontal = 8.dp)
                        )

                        IconButton(
                            onClick = { if (count < 20) count++ },
                            modifier = Modifier.testTag("increase_count_btn")
                        ) {
                            Icon(Icons.Default.Add, contentDescription = "Increase", tint = ParchmentWhite)
                        }
                    }
                }

                // Checkbox: Auto-roll Initiative (d20 + mod)
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Checkbox(
                        checked = autoRollInit,
                        onCheckedChange = { autoRollInit = it },
                        colors = CheckboxDefaults.colors(
                            checkedColor = MonsterCrimson,
                            uncheckedColor = DungeonBorder
                        )
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        text = "Auto-roll Initiative (d20 + mod)",
                        color = ParchmentWhite,
                        fontSize = 13.sp
                    )
                }

                Spacer(modifier = Modifier.height(4.dp))

                OutlinedTextField(
                    value = notes,
                    onValueChange = { notes = it },
                    label = { Text("Attacks / Special Abilities (Optional)", color = ParchmentMuted) },
                    singleLine = true,
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedTextColor = ParchmentWhite,
                        unfocusedTextColor = ParchmentWhite,
                        focusedBorderColor = MonsterCrimson,
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
                        val hp = hpText.toIntOrNull() ?: 10
                        val ac = acText.toIntOrNull() ?: 10
                        val initMod = initModText.toIntOrNull() ?: 0
                        onAddEnemy(name.trim(), hp, ac, initMod, count, autoRollInit, crText.trim(), notes.trim())
                        onDismiss()
                    }
                },
                enabled = name.isNotBlank(),
                colors = ButtonDefaults.buttonColors(containerColor = MonsterCrimson),
                modifier = Modifier.testTag("confirm_add_enemy_btn")
            ) {
                Text("Add to Combat", color = ParchmentWhite, fontWeight = FontWeight.Bold)
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text("Cancel", color = ParchmentMuted)
            }
        }
    )
}
