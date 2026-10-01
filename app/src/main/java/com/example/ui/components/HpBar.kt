package com.example.ui.components

import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.sizeIn
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Remove
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.model.Combatant
import com.example.ui.theme.BloodiedRed
import com.example.ui.theme.DungeonBorder
import com.example.ui.theme.HealthGreen
import com.example.ui.theme.HealthYellow
import com.example.ui.theme.ParchmentMuted
import com.example.ui.theme.ParchmentWhite
import com.example.ui.theme.TempHpBlue

@Composable
fun HpBar(
    combatant: Combatant,
    onHpClick: () -> Unit,
    onQuickDamage: (Int) -> Unit,
    onQuickHeal: (Int) -> Unit,
    modifier: Modifier = Modifier
) {
    val hpFraction = combatant.hpPercentage
    val animatedProgress by animateFloatAsState(
        targetValue = hpFraction,
        label = "hpProgress"
    )

    val hpColor = when {
        combatant.currentHp <= 0 -> BloodiedRed
        combatant.hpPercentage <= 0.25f -> BloodiedRed
        combatant.hpPercentage <= 0.5f -> HealthYellow
        else -> HealthGreen
    }

    Column(modifier = modifier.fillMaxWidth()) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier
                    .clip(RoundedCornerShape(6.dp))
                    .clickable(onClick = onHpClick)
                    .padding(vertical = 2.dp, horizontal = 4.dp)
            ) {
                Text(
                    text = "HP: ",
                    color = ParchmentMuted,
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Medium
                )
                Text(
                    text = "${combatant.currentHp}",
                    color = hpColor,
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold
                )
                Text(
                    text = " / ${combatant.maxHp}",
                    color = ParchmentMuted,
                    fontSize = 13.sp
                )
                if (combatant.tempHp > 0) {
                    Spacer(modifier = Modifier.width(6.dp))
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(4.dp))
                            .background(TempHpBlue.copy(alpha = 0.2f))
                            .border(1.dp, TempHpBlue.copy(alpha = 0.6f), RoundedCornerShape(4.dp))
                            .padding(horizontal = 6.dp, vertical = 1.dp)
                    ) {
                        Text(
                            text = "🛡️ +${combatant.tempHp} Temp HP",
                            color = TempHpBlue,
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            }

            // Quick adjustment buttons (-5, -1, +1, +5)
            Row(
                horizontalArrangement = Arrangement.spacedBy(6.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                QuickHpChip(text = "-5", isDamage = true) { onQuickDamage(5) }
                QuickHpChip(text = "-1", isDamage = true) { onQuickDamage(1) }
                QuickHpChip(text = "+1", isDamage = false) { onQuickHeal(1) }
                QuickHpChip(text = "+5", isDamage = false) { onQuickHeal(5) }
            }
        }

        Spacer(modifier = Modifier.height(6.dp))

        // Single HP progress track with Temp HP applied directly OVER the green bar
        val tempFraction = if (combatant.tempHp > 0) {
            (combatant.tempHp.toFloat() / combatant.maxHp.toFloat()).coerceIn(0.05f, 1f)
        } else {
            0f
        }
        val animatedTempProgress by animateFloatAsState(
            targetValue = tempFraction,
            label = "tempHpProgress"
        )

        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(13.dp)
                .clip(RoundedCornerShape(6.dp))
                .background(DungeonBorder)
                .border(
                    width = if (combatant.tempHp > 0) 1.dp else 0.5.dp,
                    color = if (combatant.tempHp > 0) TempHpBlue.copy(alpha = 0.8f) else DungeonBorder,
                    shape = RoundedCornerShape(6.dp)
                )
                .clickable(onClick = onHpClick)
        ) {
            // Layer 1: Regular HP fill (Green / Yellow / Red)
            Box(
                modifier = Modifier
                    .fillMaxHeight()
                    .fillMaxWidth(animatedProgress.coerceIn(0f, 1f))
                    .clip(RoundedCornerShape(6.dp))
                    .background(hpColor)
            )

            // Layer 2: Temp HP bar applied directly OVER the green bar
            if (combatant.tempHp > 0) {
                Box(
                    modifier = Modifier
                        .fillMaxHeight()
                        .fillMaxWidth(animatedTempProgress)
                        .clip(RoundedCornerShape(6.dp))
                        .background(
                            Brush.horizontalGradient(
                                listOf(
                                    Color(0xFF38BDF8).copy(alpha = 0.88f),
                                    TempHpBlue.copy(alpha = 0.88f),
                                    Color(0xFF0284C7).copy(alpha = 0.88f)
                                )
                            )
                        )
                        .border(
                            width = 0.5.dp,
                            color = Color(0xFFBAE6FD),
                            shape = RoundedCornerShape(6.dp)
                        )
                )
            }
        }
    }
}

@Composable
private fun QuickHpChip(
    text: String,
    isDamage: Boolean,
    onClick: () -> Unit
) {
    val bgColor = if (isDamage) BloodiedRed.copy(alpha = 0.25f) else HealthGreen.copy(alpha = 0.25f)
    val textColor = if (isDamage) BloodiedRed else HealthGreen
    val borderColor = if (isDamage) BloodiedRed.copy(alpha = 0.5f) else HealthGreen.copy(alpha = 0.5f)

    Box(
        modifier = Modifier
            .sizeIn(minWidth = 34.dp, minHeight = 30.dp)
            .clip(RoundedCornerShape(6.dp))
            .background(bgColor)
            .clickable(onClick = onClick)
            .padding(horizontal = 7.dp, vertical = 4.dp),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = text,
            color = textColor,
            fontSize = 12.sp,
            fontWeight = FontWeight.ExtraBold
        )
    }
}
