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
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
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
import androidx.compose.runtime.mutableStateMapOf
import androidx.compose.runtime.remember
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
import com.example.ui.theme.ParchmentMuted
import com.example.ui.theme.ParchmentWhite
import com.example.ui.theme.PlayerShieldBlue
import kotlin.random.Random

@Composable
fun SetPartyInitiativesDialog(
    players: List<Combatant>,
    onDismiss: () -> Unit,
    onSaveAll: (Map<String, Int>) -> Unit
) {
    // Map of combatant ID -> initiative string
    val initiativeMap = remember {
        mutableStateMapOf<String, String>().apply {
            players.forEach { p ->
                put(p.id, p.initiativeRoll.toString())
            }
        }
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
                Column {
                    Text(
                        text = "🎲 Input Player Initiatives",
                        color = DndGold,
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold
                    )
                    Text(
                        text = "Enter each player's table roll manually",
                        color = ParchmentMuted,
                        fontSize = 12.sp
                    )
                }

                // Auto-roll all players button
                OutlinedButton(
                    onClick = {
                        players.forEach { p ->
                            val roll = Random.nextInt(1, 21) + p.initiativeModifier
                            initiativeMap[p.id] = roll.toString()
                        }
                    },
                    colors = ButtonDefaults.outlinedButtonColors(contentColor = DndGold),
                    border = ButtonDefaults.outlinedButtonBorder.copy(
                        brush = Brush.linearGradient(listOf(DungeonBorder, DndGold))
                    ),
                    modifier = Modifier.testTag("auto_roll_all_players_btn")
                ) {
                    Icon(Icons.Default.Casino, contentDescription = null, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(4.dp))
                    Text("Roll All", fontSize = 11.sp)
                }
            }
        },
        text = {
            Column(modifier = Modifier.fillMaxWidth()) {
                LazyColumn(
                    modifier = Modifier
                        .fillMaxWidth()
                        .heightIn(max = 380.dp),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    items(players, key = { it.id }) { player ->
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(8.dp))
                                .background(DungeonCardElevated)
                                .border(1.dp, DungeonBorder, RoundedCornerShape(8.dp))
                                .padding(10.dp)
                        ) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                Column(modifier = Modifier.weight(1f)) {
                                    Text(
                                        text = player.name,
                                        color = ParchmentWhite,
                                        fontSize = 14.sp,
                                        fontWeight = FontWeight.Bold
                                    )
                                    Text(
                                        text = "${player.characterClassOrType} (Mod: ${if (player.initiativeModifier >= 0) "+${player.initiativeModifier}" else "${player.initiativeModifier}"})",
                                        color = ParchmentMuted,
                                        fontSize = 11.sp
                                    )
                                }

                                Row(
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                                ) {
                                    OutlinedTextField(
                                        value = initiativeMap[player.id] ?: "",
                                        onValueChange = { input ->
                                            if (input.matches(Regex("^-?\\d{0,3}$"))) {
                                                initiativeMap[player.id] = input
                                            }
                                        },
                                        placeholder = { Text("0", color = ParchmentMuted.copy(alpha = 0.5f)) },
                                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                                        singleLine = true,
                                        colors = OutlinedTextFieldDefaults.colors(
                                            focusedTextColor = ParchmentWhite,
                                            unfocusedTextColor = ParchmentWhite,
                                            focusedBorderColor = DndGold,
                                            unfocusedBorderColor = DungeonBorder
                                        ),
                                        modifier = Modifier
                                            .width(72.dp)
                                            .testTag("init_input_${player.id}")
                                    )

                                    // Quick roll for individual player
                                    Button(
                                        onClick = {
                                            val roll = Random.nextInt(1, 21) + player.initiativeModifier
                                            initiativeMap[player.id] = roll.toString()
                                        },
                                        colors = ButtonDefaults.buttonColors(containerColor = DungeonCard),
                                        modifier = Modifier.height(36.dp)
                                    ) {
                                        Text("🎲", fontSize = 12.sp)
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        confirmButton = {
            Button(
                onClick = {
                    val resultMap = initiativeMap.mapValues { (_, value) ->
                        value.toIntOrNull() ?: 0
                    }
                    onSaveAll(resultMap)
                    onDismiss()
                },
                colors = ButtonDefaults.buttonColors(containerColor = DndGold),
                modifier = Modifier.testTag("confirm_party_initiatives_btn")
            ) {
                Text("Save & Apply", color = DungeonCard, fontWeight = FontWeight.Bold)
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text("Cancel", color = ParchmentMuted)
            }
        }
    )
}
