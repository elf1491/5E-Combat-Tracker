package com.example.ui.dialogs

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.model.CombatLogEntry
import com.example.data.model.LogType
import com.example.ui.theme.BloodiedRed
import com.example.ui.theme.DndGold
import com.example.ui.theme.DungeonCard
import com.example.ui.theme.DungeonCardElevated
import com.example.ui.theme.HealthGreen
import com.example.ui.theme.ParchmentMuted
import com.example.ui.theme.ParchmentWhite
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

@Composable
fun CombatLogDialog(
    logs: List<CombatLogEntry>,
    onDismiss: () -> Unit
) {
    val timeFormat = SimpleDateFormat("HH:mm:ss", Locale.getDefault())

    AlertDialog(
        onDismissRequest = onDismiss,
        containerColor = DungeonCard,
        title = {
            Text(
                text = "📜 Combat Event Log",
                color = ParchmentWhite,
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold
            )
        },
        text = {
            if (logs.isEmpty()) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(120.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "No combat events recorded yet.",
                        color = ParchmentMuted,
                        fontSize = 14.sp
                    )
                }
            } else {
                LazyColumn(
                    modifier = Modifier
                        .fillMaxWidth()
                        .heightIn(max = 380.dp),
                    verticalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    items(logs) { entry ->
                        val (badgeColor, badgeText) = when (entry.type) {
                            LogType.DAMAGE -> BloodiedRed to "💥"
                            LogType.HEAL -> HealthGreen to "💚"
                            LogType.TURN -> DndGold to "⚔️"
                            LogType.CONDITION -> ParchmentWhite to "✨"
                            LogType.DEATH -> BloodiedRed to "💀"
                            LogType.INFO -> ParchmentMuted to "ℹ️"
                        }

                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(6.dp))
                                .background(DungeonCardElevated)
                                .padding(8.dp)
                        ) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(
                                    text = badgeText,
                                    fontSize = 14.sp,
                                    modifier = Modifier.padding(end = 6.dp)
                                )
                                Column(modifier = Modifier.weight(1f)) {
                                    Text(
                                        text = entry.text,
                                        color = ParchmentWhite,
                                        fontSize = 13.sp,
                                        fontWeight = FontWeight.Medium
                                    )
                                    Row {
                                        Text(
                                            text = "Round ${entry.round}",
                                            color = DndGold,
                                            fontSize = 11.sp,
                                            fontWeight = FontWeight.Bold
                                        )
                                        Spacer(modifier = Modifier.width(8.dp))
                                        Text(
                                            text = timeFormat.format(Date(entry.timestamp)),
                                            color = ParchmentMuted,
                                            fontSize = 11.sp
                                        )
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        confirmButton = {
            TextButton(onClick = onDismiss) {
                Text("Close", color = DndGold)
            }
        }
    )
}
