package com.example.ui.screens

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.animateContentSize
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.IntrinsicSize
import androidx.compose.foundation.layout.PaddingValues
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
import androidx.compose.foundation.layout.wrapContentHeight
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.ArrowForward
import androidx.compose.material.icons.filled.Casino
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material.icons.filled.FiberManualRecord
import androidx.compose.material.icons.filled.History
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.Shield
import androidx.compose.material.icons.filled.SkipNext
import androidx.compose.material.icons.filled.SkipPrevious
import androidx.compose.material.icons.filled.Stop
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.OutlinedButton
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
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.hapticfeedback.HapticFeedbackType
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalHapticFeedback
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.R
import com.example.data.model.Combatant
import com.example.data.model.Condition
import com.example.data.model.CoverType
import com.example.ui.components.ConditionChip
import com.example.ui.components.HpBar
import com.example.ui.dialogs.AddEnemyDialog
import com.example.ui.dialogs.CombatLogDialog
import com.example.ui.dialogs.ConditionsDialog
import com.example.ui.dialogs.DamageHealDialog
import com.example.ui.dialogs.EditAcDialog
import com.example.ui.dialogs.EditInitiativeDialog
import com.example.ui.dialogs.EditSpeedDialog
import com.example.ui.dialogs.SetPartyInitiativesDialog
import com.example.ui.theme.ArcanePurple
import com.example.ui.theme.BloodiedRed
import com.example.ui.theme.DndGold
import com.example.ui.theme.DndGoldLight
import com.example.ui.theme.DndRed
import com.example.ui.theme.DungeonBorder
import com.example.ui.theme.DungeonCard
import com.example.ui.theme.DungeonCardElevated
import com.example.ui.theme.DungeonGoldBorder
import com.example.ui.theme.DungeonSurface
import com.example.ui.theme.HealthGreen
import com.example.ui.theme.MonsterCrimson
import com.example.ui.theme.ParchmentMuted
import com.example.ui.theme.ParchmentSubtle
import com.example.ui.theme.ParchmentWhite
import com.example.ui.theme.PlayerShieldBlue
import com.example.ui.viewmodel.CombatTrackerViewModel
import com.example.ui.viewmodel.EncounterState

@Composable
fun CombatArenaScreen(
    viewModel: CombatTrackerViewModel,
    encounterState: EncounterState,
    onNavigateToParty: () -> Unit,
    onNavigateToBestiary: () -> Unit,
    onOpenDice: () -> Unit,
    modifier: Modifier = Modifier
) {
    val haptic = LocalHapticFeedback.current

    var selectedCombatantIdForHp by remember { mutableStateOf<String?>(null) }
    var selectedCombatantIdForConditions by remember { mutableStateOf<String?>(null) }
    var selectedCombatantIdForInitiative by remember { mutableStateOf<String?>(null) }
    var selectedCombatantIdForAc by remember { mutableStateOf<String?>(null) }
    var selectedCombatantIdForSpeed by remember { mutableStateOf<String?>(null) }
    var showPartyInitiativeDialog by remember { mutableStateOf(false) }
    var showAddEnemyDialog by remember { mutableStateOf(false) }
    var showLogDialog by remember { mutableStateOf(false) }

    val selectedCombatantForHp = encounterState.combatants.find { it.id == selectedCombatantIdForHp }
    val selectedCombatantForConditions = encounterState.combatants.find { it.id == selectedCombatantIdForConditions }
    val selectedCombatantForInitiative = encounterState.combatants.find { it.id == selectedCombatantIdForInitiative }
    val selectedCombatantForAc = encounterState.combatants.find { it.id == selectedCombatantIdForAc }
    val selectedCombatantForSpeed = encounterState.combatants.find { it.id == selectedCombatantIdForSpeed }

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(DungeonSurface)
    ) {
        // --- Top Header Bar ---
        ArenaHeader(
            encounterState = encounterState,
            onNextTurn = {
                haptic.performHapticFeedback(HapticFeedbackType.LongPress)
                viewModel.nextTurn()
            },
            onPrevTurn = {
                haptic.performHapticFeedback(HapticFeedbackType.TextHandleMove)
                viewModel.previousTurn()
            },
            onStartCombat = {
                haptic.performHapticFeedback(HapticFeedbackType.LongPress)
                viewModel.startCombat(autoRollMonsters = true)
            },
            onOpenPartyInitiatives = { showPartyInitiativeDialog = true },
            onEndCombat = { viewModel.endCombat() },
            onRerollAll = { viewModel.rerollAllInitiatives() },
            onOpenLog = { showLogDialog = true },
            onOpenDice = onOpenDice,
            onAddEnemy = { showAddEnemyDialog = true }
        )

        if (encounterState.combatants.isEmpty()) {
            EmptyCombatView(
                onAddParty = { viewModel.addAllPartyToEncounter() },
                onAddBestiary = onNavigateToBestiary,
                onAddCustomEnemy = { showAddEnemyDialog = true }
            )
        } else {
            // --- Active Turn & On Deck Spotlights ---
            if (encounterState.isCombatStarted) {
                ActiveTurnSpotlight(
                    activeCombatant = encounterState.activeCombatant,
                    onDeckCombatant = encounterState.onDeckCombatant,
                    onEndTurn = {
                        haptic.performHapticFeedback(HapticFeedbackType.LongPress)
                        viewModel.nextTurn()
                    },
                    onHpClick = { selectedCombatantIdForHp = encounterState.activeCombatant?.id },
                    onQuickDamage = { amount ->
                        encounterState.activeCombatant?.let { viewModel.applyDamage(it.id, amount) }
                    },
                    onQuickHeal = { amount ->
                        encounterState.activeCombatant?.let { viewModel.applyHealing(it.id, amount) }
                    },
                    onConditionsClick = { selectedCombatantIdForConditions = encounterState.activeCombatant?.id },
                    onInitiativeClick = { selectedCombatantIdForInitiative = encounterState.activeCombatant?.id },
                    onAcClick = { selectedCombatantIdForAc = encounterState.activeCombatant?.id },
                    onSpeedClick = { selectedCombatantIdForSpeed = encounterState.activeCombatant?.id },
                    onDeathSave = { isSuccess ->
                        encounterState.activeCombatant?.let { viewModel.recordDeathSave(it.id, isSuccess) }
                    },
                    onRevive = {
                        encounterState.activeCombatant?.let { viewModel.reviveCombatant(it.id) }
                    }
                )
            }

            // --- Combatants Initiative Roster List ---
            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(horizontal = 12.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                item {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 4.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "INITIATIVE ORDER (${encounterState.combatants.size})",
                            color = DndGold,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold,
                            letterSpacing = 1.sp
                        )

                        Row(verticalAlignment = Alignment.CenterVertically) {
                            if (encounterState.playerCount > 0) {
                                TextButton(onClick = { showPartyInitiativeDialog = true }) {
                                    Icon(Icons.Default.Casino, contentDescription = null, tint = DndGold, modifier = Modifier.size(15.dp))
                                    Spacer(modifier = Modifier.width(3.dp))
                                    Text("Party Inits", color = DndGold, fontSize = 11.sp)
                                }
                            }
                            if (encounterState.enemyCount > 0) {
                                TextButton(onClick = { viewModel.rollMonstersInitiative() }) {
                                    Icon(Icons.Default.Refresh, contentDescription = null, tint = MonsterCrimson, modifier = Modifier.size(15.dp))
                                    Spacer(modifier = Modifier.width(3.dp))
                                    Text("Roll Monsters", color = MonsterCrimson, fontSize = 11.sp)
                                }
                            }
                        }
                    }
                }

                itemsIndexed(
                    items = encounterState.combatants,
                    key = { _, combatant -> combatant.id }
                ) { index, combatant ->
                    val isActive = encounterState.isCombatStarted && index == encounterState.currentTurnIndex
                    val isOnDeck = encounterState.isCombatStarted && encounterState.combatants.size > 1 &&
                            index == ((encounterState.currentTurnIndex + 1) % encounterState.combatants.size)

                    CombatantCard(
                        combatant = combatant,
                        isActive = isActive,
                        isOnDeck = isOnDeck,
                        isCombatStarted = encounterState.isCombatStarted,
                        onHpClick = { selectedCombatantIdForHp = combatant.id },
                        onQuickDamage = { amount -> viewModel.applyDamage(combatant.id, amount) },
                        onQuickHeal = { amount -> viewModel.applyHealing(combatant.id, amount) },
                        onConditionsClick = { selectedCombatantIdForConditions = combatant.id },
                        onDeathSave = { isSuccess -> viewModel.recordDeathSave(combatant.id, isSuccess) },
                        onRevive = { viewModel.reviveCombatant(combatant.id) },
                        onRemove = { viewModel.removeCombatant(combatant.id) },
                        onInitiativeClick = { selectedCombatantIdForInitiative = combatant.id },
                        onAcClick = { selectedCombatantIdForAc = combatant.id },
                        onSpeedClick = { selectedCombatantIdForSpeed = combatant.id }
                    )
                }

                item {
                    Spacer(modifier = Modifier.height(24.dp))
                }
            }
        }
    }

    // --- Dialogs ---
    selectedCombatantForHp?.let { combatant ->
        DamageHealDialog(
            combatant = combatant,
            onDismiss = { selectedCombatantIdForHp = null },
            onApplyDamage = { amt -> viewModel.applyDamage(combatant.id, amt) },
            onApplyHeal = { amt -> viewModel.applyHealing(combatant.id, amt) },
            onSetTempHp = { amt -> viewModel.setTempHp(combatant.id, amt) },
            onSetDirectHp = { amt -> viewModel.setCurrentHpDirect(combatant.id, amt) }
        )
    }

    selectedCombatantForConditions?.let { combatant ->
        ConditionsDialog(
            combatant = combatant,
            onDismiss = { selectedCombatantIdForConditions = null },
            onToggleCondition = { cond -> viewModel.toggleCondition(combatant.id, cond) },
            onClearAll = { viewModel.clearConditions(combatant.id) }
        )
    }

    selectedCombatantForInitiative?.let { combatant ->
        EditInitiativeDialog(
            combatant = combatant,
            onDismiss = { selectedCombatantIdForInitiative = null },
            onSaveInitiative = { newScore -> viewModel.setInitiative(combatant.id, newScore) }
        )
    }

    selectedCombatantForAc?.let { combatant ->
        EditAcDialog(
            combatant = combatant,
            onDismiss = { selectedCombatantIdForAc = null },
            onSaveAc = { newBaseAc, coverType ->
                viewModel.updateArmorClass(combatant.id, newBaseAc, coverType)
            }
        )
    }

    selectedCombatantForSpeed?.let { combatant ->
        EditSpeedDialog(
            combatant = combatant,
            onDismiss = { selectedCombatantIdForSpeed = null },
            onSaveSpeed = { newBaseSpeed, isDifficultTerrain ->
                viewModel.updateSpeed(combatant.id, newBaseSpeed, isDifficultTerrain)
            }
        )
    }

    if (showPartyInitiativeDialog) {
        val playerList = encounterState.combatants.filter { it.isPlayer }
        SetPartyInitiativesDialog(
            players = playerList,
            onDismiss = { showPartyInitiativeDialog = false },
            onSaveAll = { initiativeMap ->
                viewModel.setMultipleInitiatives(initiativeMap)
            }
        )
    }

    if (showAddEnemyDialog) {
        AddEnemyDialog(
            onDismiss = { showAddEnemyDialog = false },
            onAddEnemy = { name, hp, ac, initMod, count, rollInit, cr, notes ->
                viewModel.addEnemyToEncounter(name, hp, ac, initMod, count, rollInit, cr, notes)
            }
        )
    }

    if (showLogDialog) {
        CombatLogDialog(
            logs = encounterState.log,
            onDismiss = { showLogDialog = false }
        )
    }
}

@Composable
private fun ArenaHeader(
    encounterState: EncounterState,
    onNextTurn: () -> Unit,
    onPrevTurn: () -> Unit,
    onStartCombat: () -> Unit,
    onOpenPartyInitiatives: () -> Unit,
    onEndCombat: () -> Unit,
    onRerollAll: () -> Unit,
    onOpenLog: () -> Unit,
    onOpenDice: () -> Unit,
    onAddEnemy: () -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(8.dp),
        colors = CardDefaults.cardColors(containerColor = DungeonCard),
        border = CardDefaults.outlinedCardBorder().copy(brush = Brush.linearGradient(listOf(DungeonBorder, DungeonGoldBorder)))
    ) {
        Column(modifier = Modifier.padding(12.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Round and status
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(8.dp))
                            .background(DndRed.copy(alpha = 0.2f))
                            .border(1.dp, DndRed, RoundedCornerShape(8.dp))
                            .padding(horizontal = 10.dp, vertical = 5.dp)
                    ) {
                        Text(
                            text = if (encounterState.isCombatStarted) "⚔️ Round ${encounterState.round}" else "⚔️ Preparation",
                            color = if (encounterState.isCombatStarted) DndGoldLight else ParchmentWhite,
                            fontSize = 15.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }

                    Spacer(modifier = Modifier.width(10.dp))

                    Text(
                        text = "${encounterState.playerCount} PCs • ${encounterState.enemyCount} Foes",
                        color = ParchmentMuted,
                        fontSize = 12.sp
                    )
                }

                // Top right tool buttons (Dice, Log, Add enemy)
                Row(verticalAlignment = Alignment.CenterVertically) {
                    IconButton(onClick = onOpenDice, modifier = Modifier.testTag("open_dice_btn")) {
                        Icon(Icons.Default.Casino, contentDescription = "Dice Roller", tint = DndGold)
                    }
                    IconButton(onClick = onOpenLog, modifier = Modifier.testTag("open_log_btn")) {
                        Icon(Icons.Default.History, contentDescription = "Combat Log", tint = ParchmentWhite)
                    }
                    IconButton(onClick = onAddEnemy, modifier = Modifier.testTag("quick_add_enemy_btn")) {
                        Icon(Icons.Default.Add, contentDescription = "Add Enemy", tint = MonsterCrimson)
                    }
                }
            }

            Spacer(modifier = Modifier.height(10.dp))

            // Main Combat Controls
            if (!encounterState.isCombatStarted) {
                Column(
                    modifier = Modifier.fillMaxWidth(),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    if (encounterState.playerCount > 0) {
                        OutlinedButton(
                            onClick = onOpenPartyInitiatives,
                            colors = ButtonDefaults.outlinedButtonColors(contentColor = DndGold),
                            border = ButtonDefaults.outlinedButtonBorder.copy(
                                brush = Brush.linearGradient(listOf(DungeonBorder, DndGold))
                            ),
                            modifier = Modifier
                                .fillMaxWidth()
                                .testTag("open_party_initiatives_btn")
                        ) {
                            Icon(Icons.Default.Casino, contentDescription = null, tint = DndGold, modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text("🎲 Input Player Initiatives", color = ParchmentWhite, fontSize = 13.sp, fontWeight = FontWeight.Bold)
                        }
                    }

                    Button(
                        onClick = onStartCombat,
                        enabled = encounterState.combatants.isNotEmpty(),
                        colors = ButtonDefaults.buttonColors(containerColor = DndGold),
                        modifier = Modifier
                            .fillMaxWidth()
                            .testTag("start_combat_btn")
                    ) {
                        Icon(Icons.Default.PlayArrow, contentDescription = null, tint = DungeonCard)
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = if (encounterState.enemyCount > 0) "Start Combat (Auto-rolls Monsters)" else "Start Combat",
                            color = DungeonCard,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            } else {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    OutlinedButton(
                        onClick = onPrevTurn,
                        colors = ButtonDefaults.outlinedButtonColors(contentColor = ParchmentWhite),
                        border = ButtonDefaults.outlinedButtonBorder.copy(brush = Brush.linearGradient(listOf(DungeonBorder, DungeonBorder))),
                        modifier = Modifier
                            .weight(0.9f)
                            .testTag("prev_turn_btn")
                    ) {
                        Icon(Icons.Default.SkipPrevious, contentDescription = "Prev Turn", modifier = Modifier.size(18.dp))
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("Prev", fontSize = 13.sp)
                    }

                    Button(
                        onClick = onNextTurn,
                        colors = ButtonDefaults.buttonColors(containerColor = DndGold),
                        modifier = Modifier
                            .weight(1.3f)
                            .testTag("next_turn_btn")
                    ) {
                        Text("Next Turn", color = DungeonCard, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                        Spacer(modifier = Modifier.width(4.dp))
                        Icon(Icons.Default.SkipNext, contentDescription = "Next Turn", tint = DungeonCard)
                    }

                    IconButton(
                        onClick = onEndCombat,
                        modifier = Modifier
                            .clip(RoundedCornerShape(8.dp))
                            .background(BloodiedRed.copy(alpha = 0.2f))
                            .testTag("end_combat_btn")
                    ) {
                        Icon(Icons.Default.Stop, contentDescription = "End Combat", tint = BloodiedRed)
                    }
                }
            }
        }
    }
}

@OptIn(ExperimentalLayoutApi::class)
@Composable
private fun ActiveTurnSpotlight(
    activeCombatant: Combatant?,
    onDeckCombatant: Combatant?,
    onEndTurn: () -> Unit,
    onHpClick: () -> Unit,
    onQuickDamage: (Int) -> Unit,
    onQuickHeal: (Int) -> Unit,
    onConditionsClick: () -> Unit,
    onInitiativeClick: () -> Unit,
    onAcClick: () -> Unit,
    onSpeedClick: () -> Unit,
    onDeathSave: (Boolean) -> Unit,
    onRevive: () -> Unit
) {
    if (activeCombatant == null) return

    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 8.dp, vertical = 4.dp),
        colors = CardDefaults.cardColors(containerColor = DungeonCardElevated),
        border = CardDefaults.outlinedCardBorder().copy(brush = Brush.linearGradient(listOf(DndGold, DndGoldLight)))
    ) {
        Column(modifier = Modifier.padding(12.dp)) {
            // Active turn ribbon
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(4.dp))
                            .background(DndGold)
                            .padding(horizontal = 6.dp, vertical = 2.dp)
                    ) {
                        Text(
                            text = "CURRENT TURN",
                            color = DungeonCard,
                            fontSize = 10.sp,
                            fontWeight = FontWeight.ExtraBold,
                            letterSpacing = 0.5.sp
                        )
                    }

                    Spacer(modifier = Modifier.width(8.dp))

                    Text(
                        text = if (activeCombatant.isPlayer) "🛡️ Player" else "👹 Monster",
                        color = if (activeCombatant.isPlayer) PlayerShieldBlue else MonsterCrimson,
                        fontSize = 11.sp,
                        fontWeight = FontWeight.SemiBold
                    )
                }

                // On deck alert
                if (onDeckCombatant != null) {
                    Text(
                        text = "On Deck: ${onDeckCombatant.name}",
                        color = ParchmentMuted,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Medium
                    )
                }
            }

            Spacer(modifier = Modifier.height(6.dp))

            // Character Name & Primary Stats
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = activeCombatant.name,
                        color = ParchmentWhite,
                        fontSize = 20.sp,
                        fontWeight = FontWeight.Bold
                    )
                    Text(
                        text = activeCombatant.characterClassOrType,
                        color = ParchmentMuted,
                        fontSize = 12.sp
                    )
                }

                // Badges for AC, Init, Speed
                Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                    StatPill(
                        label = "AC",
                        value = "${activeCombatant.armorClass}",
                        icon = "🛡️",
                        onClick = onAcClick
                    )
                    StatPill(
                        label = "INIT",
                        value = "${activeCombatant.initiativeRoll}",
                        icon = "⚡",
                        onClick = onInitiativeClick
                    )
                    StatPill(
                        label = "SPD",
                        value = "${activeCombatant.speed}ft",
                        icon = "👟",
                        onClick = onSpeedClick
                    )
                    if (activeCombatant.spellDc != null) {
                        StatPill(label = "DC", value = "${activeCombatant.spellDc}", icon = "🔮")
                    }
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            // HP Bar in spotlight - fully functional with Temp HP overlay & quick +/- chips
            HpBar(
                combatant = activeCombatant,
                onHpClick = onHpClick,
                onQuickDamage = onQuickDamage,
                onQuickHeal = onQuickHeal
            )

            Spacer(modifier = Modifier.height(8.dp))

            // Dedicated Action Buttons for currently active combatant
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Button(
                    onClick = onHpClick,
                    colors = ButtonDefaults.buttonColors(containerColor = BloodiedRed),
                    shape = RoundedCornerShape(8.dp),
                    modifier = Modifier
                        .weight(1f)
                        .testTag("spotlight_damage_btn")
                ) {
                    Text("💥 Damage", fontSize = 13.sp, fontWeight = FontWeight.Bold, color = ParchmentWhite)
                }

                Button(
                    onClick = onHpClick,
                    colors = ButtonDefaults.buttonColors(containerColor = HealthGreen),
                    shape = RoundedCornerShape(8.dp),
                    modifier = Modifier
                        .weight(1f)
                        .testTag("spotlight_heal_btn")
                ) {
                    Text("💚 Heal", fontSize = 13.sp, fontWeight = FontWeight.Bold, color = ParchmentWhite)
                }

                OutlinedButton(
                    onClick = onConditionsClick,
                    colors = ButtonDefaults.outlinedButtonColors(contentColor = DndGold),
                    shape = RoundedCornerShape(8.dp),
                    border = ButtonDefaults.outlinedButtonBorder.copy(
                        brush = Brush.linearGradient(listOf(DungeonBorder, DndGold.copy(alpha = 0.7f)))
                    ),
                    modifier = Modifier
                        .weight(1.1f)
                        .testTag("spotlight_conditions_btn")
                ) {
                    Text("✨ Condition", fontSize = 12.sp, fontWeight = FontWeight.SemiBold, color = DndGold)
                }
            }

            // Death saves if active player is at 0 HP, dead, or stabilized
            if (activeCombatant.isPlayer && (activeCombatant.currentHp <= 0 || activeCombatant.isDead || activeCombatant.isStabilized)) {
                Spacer(modifier = Modifier.height(8.dp))
                DeathSavesWidget(
                    combatant = activeCombatant,
                    onDeathSave = onDeathSave,
                    onRevive = onRevive
                )
            }

            // Conditions Row
            if (activeCombatant.conditions.isNotEmpty()) {
                Spacer(modifier = Modifier.height(6.dp))
                FlowRow(
                    horizontalArrangement = Arrangement.spacedBy(4.dp),
                    verticalArrangement = Arrangement.spacedBy(4.dp)
                ) {
                    activeCombatant.conditions.forEach { condition ->
                        ConditionChip(condition = condition, onClick = onConditionsClick)
                    }
                }
            }

            // Abilities, Feats & Actions Reminder for Current Turn
            Spacer(modifier = Modifier.height(10.dp))
            TurnAbilitiesAndFeatsSection(combatant = activeCombatant)
        }
    }
}

@Composable
private fun StatPill(
    label: String,
    value: String,
    icon: String,
    onClick: (() -> Unit)? = null
) {
    Box(
        modifier = Modifier
            .sizeIn(minWidth = 46.dp, minHeight = 42.dp)
            .clip(RoundedCornerShape(8.dp))
            .background(DungeonCard)
            .border(1.dp, if (onClick != null) DndGold.copy(alpha = 0.5f) else DungeonBorder, RoundedCornerShape(8.dp))
            .then(if (onClick != null) Modifier.clickable(onClick = onClick) else Modifier)
            .padding(horizontal = 7.dp, vertical = 3.dp)
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Text(text = label, color = ParchmentMuted, fontSize = 9.sp, fontWeight = FontWeight.SemiBold, lineHeight = 10.sp)
            Text(text = value, color = ParchmentWhite, fontSize = 13.sp, fontWeight = FontWeight.Bold, lineHeight = 14.sp)
        }
    }
}

@OptIn(ExperimentalLayoutApi::class)
@Composable
private fun CombatantCard(
    combatant: Combatant,
    isActive: Boolean,
    isOnDeck: Boolean,
    isCombatStarted: Boolean,
    onHpClick: () -> Unit,
    onQuickDamage: (Int) -> Unit,
    onQuickHeal: (Int) -> Unit,
    onConditionsClick: () -> Unit,
    onDeathSave: (Boolean) -> Unit,
    onRevive: () -> Unit,
    onRemove: () -> Unit,
    onInitiativeClick: () -> Unit,
    onAcClick: () -> Unit,
    onSpeedClick: () -> Unit
) {
    val borderColor = when {
        combatant.isDead -> BloodiedRed
        isActive -> DndGold
        isOnDeck -> DndGold.copy(alpha = 0.5f)
        combatant.isPlayer -> PlayerShieldBlue.copy(alpha = 0.35f)
        else -> DungeonBorder
    }

    val cardBg = when {
        combatant.isDead -> DungeonCard.copy(alpha = 0.7f)
        isActive -> DungeonCardElevated
        else -> DungeonCard
    }

    Card(
        modifier = Modifier
            .fillMaxWidth()
            .animateContentSize(),
        colors = CardDefaults.cardColors(containerColor = cardBg),
        border = CardDefaults.outlinedCardBorder().copy(brush = Brush.linearGradient(listOf(borderColor, borderColor)))
    ) {
        Column(modifier = Modifier.padding(10.dp)) {
            // Header: Initiative Circle Badge, Name, Type, AC, and Delete
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Initiative score circle - 52dp circular badge with zero text cutoff
                Box(
                    modifier = Modifier
                        .size(52.dp)
                        .clip(CircleShape)
                        .background(
                            when {
                                combatant.isDead -> BloodiedRed.copy(alpha = 0.25f)
                                isActive -> DndGold
                                else -> DungeonCardElevated
                            }
                        )
                        .border(
                            1.5.dp,
                            when {
                                combatant.isDead -> BloodiedRed
                                isActive -> DndGoldLight
                                else -> DungeonBorder
                            },
                            CircleShape
                        )
                        .clickable(onClick = onInitiativeClick)
                        .testTag("init_badge_${combatant.id}"),
                    contentAlignment = Alignment.Center
                ) {
                    if (combatant.isDead) {
                        Column(
                            horizontalAlignment = Alignment.CenterHorizontally,
                            verticalArrangement = Arrangement.Center
                        ) {
                            Text("💀", fontSize = 16.sp)
                            Text("DEAD", color = BloodiedRed, fontSize = 8.sp, fontWeight = FontWeight.ExtraBold, lineHeight = 9.sp)
                        }
                    } else {
                        Column(
                            horizontalAlignment = Alignment.CenterHorizontally,
                            verticalArrangement = Arrangement.Center,
                            modifier = Modifier.padding(horizontal = 2.dp)
                        ) {
                            Text(
                                text = "${combatant.initiativeRoll}",
                                color = if (isActive) DungeonCard else ParchmentWhite,
                                fontSize = 16.sp,
                                fontWeight = FontWeight.Black,
                                lineHeight = 16.sp
                            )
                            Text(
                                text = "INIT",
                                color = if (isActive) DungeonCard.copy(alpha = 0.85f) else DndGold,
                                fontSize = 8.5.sp,
                                fontWeight = FontWeight.ExtraBold,
                                letterSpacing = 0.5.sp,
                                lineHeight = 9.sp
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.width(8.dp))

                // Name and details
                Column(modifier = Modifier.weight(1f)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text(
                            text = combatant.name,
                            color = if (combatant.isDead) ParchmentMuted else ParchmentWhite,
                            fontSize = 15.sp,
                            fontWeight = FontWeight.Bold
                        )

                        if (combatant.isDead) {
                            Spacer(modifier = Modifier.width(6.dp))
                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(4.dp))
                                    .background(BloodiedRed.copy(alpha = 0.25f))
                                    .border(1.dp, BloodiedRed, RoundedCornerShape(4.dp))
                                    .padding(horizontal = 5.dp, vertical = 1.dp)
                            ) {
                                Text("💀 SKIPPED", color = BloodiedRed, fontSize = 9.sp, fontWeight = FontWeight.ExtraBold)
                            }
                        } else if (combatant.isStabilized) {
                            Spacer(modifier = Modifier.width(6.dp))
                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(4.dp))
                                    .background(HealthGreen.copy(alpha = 0.2f))
                                    .border(1.dp, HealthGreen, RoundedCornerShape(4.dp))
                                    .padding(horizontal = 5.dp, vertical = 1.dp)
                            ) {
                                Text("🌟 STABLE", color = HealthGreen, fontSize = 9.sp, fontWeight = FontWeight.Bold)
                            }
                        } else if (isActive) {
                            Spacer(modifier = Modifier.width(6.dp))
                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(4.dp))
                                    .background(DndGold)
                                    .padding(horizontal = 4.dp, vertical = 1.dp)
                            ) {
                                Text("TURN", color = DungeonCard, fontSize = 9.sp, fontWeight = FontWeight.ExtraBold)
                            }
                        } else if (isOnDeck) {
                            Spacer(modifier = Modifier.width(6.dp))
                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(4.dp))
                                    .background(DungeonBorder)
                                    .padding(horizontal = 4.dp, vertical = 1.dp)
                            ) {
                                Text("ON DECK", color = ParchmentMuted, fontSize = 9.sp, fontWeight = FontWeight.Bold)
                            }
                        } else if (!isCombatStarted && combatant.isPlayer && combatant.initiativeRoll == 0) {
                            Spacer(modifier = Modifier.width(6.dp))
                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(4.dp))
                                    .background(DndGold.copy(alpha = 0.2f))
                                    .border(1.dp, DndGold, RoundedCornerShape(4.dp))
                                    .clickable(onClick = onInitiativeClick)
                                    .padding(horizontal = 5.dp, vertical = 1.dp)
                            ) {
                                Text("✏️ Set Init", color = DndGold, fontSize = 9.sp, fontWeight = FontWeight.Bold)
                            }
                        }
                    }

                    Text(
                        text = combatant.characterClassOrType,
                        color = ParchmentMuted,
                        fontSize = 11.sp
                    )
                }

                // AC Badge (shifted to left) & SPD Badge with boot icon
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(5.dp)
                ) {
                    // Clickable AC Badge
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(6.dp))
                            .background(
                                if (combatant.coverType != CoverType.NONE) DndGold.copy(alpha = 0.2f)
                                else DungeonBorder.copy(alpha = 0.5f)
                            )
                            .border(
                                width = 1.dp,
                                color = if (combatant.coverType != CoverType.NONE) DndGold.copy(alpha = 0.7f) else DungeonBorder,
                                shape = RoundedCornerShape(6.dp)
                            )
                            .clickable(onClick = onAcClick)
                            .padding(horizontal = 6.dp, vertical = 3.dp)
                            .testTag("combatant_ac_${combatant.id}")
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text("🛡️", fontSize = 11.sp)
                            Spacer(modifier = Modifier.width(2.dp))
                            Text(
                                text = "${combatant.armorClass}",
                                color = if (combatant.coverType != CoverType.NONE) DndGoldLight else ParchmentWhite,
                                fontSize = 12.5.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }

                    // Clickable SPD Badge with boot icon
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(6.dp))
                            .background(
                                if (combatant.isDifficultTerrain) Color(0xFFD97706).copy(alpha = 0.2f)
                                else DungeonBorder.copy(alpha = 0.5f)
                            )
                            .border(
                                width = 1.dp,
                                color = if (combatant.isDifficultTerrain) Color(0xFFD97706).copy(alpha = 0.7f) else DungeonBorder,
                                shape = RoundedCornerShape(6.dp)
                            )
                            .clickable(onClick = onSpeedClick)
                            .padding(horizontal = 6.dp, vertical = 3.dp)
                            .testTag("combatant_speed_${combatant.id}")
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text("🥾", fontSize = 11.sp)
                            Spacer(modifier = Modifier.width(2.dp))
                            Text(
                                text = "${combatant.speed}ft",
                                color = if (combatant.isDifficultTerrain) Color(0xFFFDBA74) else ParchmentWhite,
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }
                }

                // Remove from combat button
                IconButton(
                    onClick = onRemove,
                    modifier = Modifier.size(32.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.Close,
                        contentDescription = "Remove",
                        tint = ParchmentMuted.copy(alpha = 0.6f),
                        modifier = Modifier.size(16.dp)
                    )
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            // HP Bar & Quick +/- (shows Temp HP overlay when active)
            HpBar(
                combatant = combatant,
                onHpClick = onHpClick,
                onQuickDamage = onQuickDamage,
                onQuickHeal = onQuickHeal
            )

            // --- 5e Death Saves Widget (if player is down at 0 HP, dead, or stabilized) ---
            if (combatant.isPlayer && (combatant.currentHp <= 0 || combatant.isDead || combatant.isStabilized)) {
                Spacer(modifier = Modifier.height(8.dp))
                DeathSavesWidget(
                    combatant = combatant,
                    onDeathSave = onDeathSave,
                    onRevive = onRevive
                )
            }

            // Conditions row
            Spacer(modifier = Modifier.height(6.dp))
            FlowRow(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(4.dp),
                verticalArrangement = Arrangement.spacedBy(4.dp)
            ) {
                combatant.conditions.forEach { condition ->
                    ConditionChip(condition = condition, onClick = onConditionsClick)
                }
                // "+ Condition" button
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(6.dp))
                        .background(DungeonBorder.copy(alpha = 0.4f))
                        .clickable(onClick = onConditionsClick)
                        .padding(horizontal = 6.dp, vertical = 2.dp)
                ) {
                    Text(
                        text = if (combatant.conditions.isEmpty()) "+ Condition" else "+",
                        color = ParchmentMuted,
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Medium
                    )
                }
            }

            // Backstory / Notes auto-sizing box (adjusts in size dynamically based strictly on text content)
            if (combatant.notes.isNotBlank()) {
                Spacer(modifier = Modifier.height(6.dp))
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .wrapContentHeight()
                        .clip(RoundedCornerShape(6.dp))
                        .background(DungeonCardElevated.copy(alpha = 0.55f))
                        .border(0.5.dp, DungeonBorder.copy(alpha = 0.8f), RoundedCornerShape(6.dp))
                        .padding(horizontal = 8.dp, vertical = 5.dp)
                ) {
                    Text(
                        text = "📜 ${combatant.notes}",
                        color = ParchmentMuted,
                        fontSize = 10.5.sp,
                        lineHeight = 13.5.sp
                    )
                }
            }
        }
    }
}

@Composable
private fun DeathSavesWidget(
    combatant: Combatant,
    onDeathSave: (Boolean) -> Unit,
    onRevive: (() -> Unit)? = null
) {
    val isDead = combatant.isDead || combatant.deathSavesFailure >= 3
    val isStabilized = combatant.isStabilized || combatant.deathSavesSuccess >= 3

    Box(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(8.dp))
            .background(
                when {
                    isDead -> BloodiedRed.copy(alpha = 0.18f)
                    isStabilized -> HealthGreen.copy(alpha = 0.15f)
                    else -> BloodiedRed.copy(alpha = 0.12f)
                }
            )
            .border(
                1.dp,
                when {
                    isDead -> BloodiedRed
                    isStabilized -> HealthGreen.copy(alpha = 0.6f)
                    else -> BloodiedRed.copy(alpha = 0.4f)
                },
                RoundedCornerShape(8.dp)
            )
            .padding(10.dp)
    ) {
        Column {
            // Header Row: Title & Status
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(
                        text = if (isDead) "💀" else if (isStabilized) "🌟" else "💀",
                        fontSize = 15.sp
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = when {
                            isDead -> "PLAYER CHARACTER HAS DIED"
                            isStabilized -> "STABILIZED AT 0 HP"
                            else -> "5e DEATH SAVING THROWS"
                        },
                        color = when {
                            isDead -> BloodiedRed
                            isStabilized -> HealthGreen
                            else -> BloodiedRed
                        },
                        fontSize = 12.sp,
                        fontWeight = FontWeight.ExtraBold,
                        letterSpacing = 0.5.sp
                    )
                }

                // Status Badge
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(4.dp))
                        .background(
                            when {
                                isDead -> BloodiedRed.copy(alpha = 0.25f)
                                isStabilized -> HealthGreen.copy(alpha = 0.25f)
                                else -> DungeonCard
                            }
                        )
                        .border(
                            0.5.dp,
                            when {
                                isDead -> BloodiedRed
                                isStabilized -> HealthGreen
                                else -> DungeonBorder
                            },
                            RoundedCornerShape(4.dp)
                        )
                        .padding(horizontal = 6.dp, vertical = 2.dp)
                ) {
                    Text(
                        text = when {
                            isDead -> "💀 3 FAILS"
                            isStabilized -> "UNCONSCIOUS"
                            else -> "DC 10 d20"
                        },
                        color = when {
                            isDead -> BloodiedRed
                            isStabilized -> HealthGreen
                            else -> ParchmentMuted
                        },
                        fontSize = 9.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            // Successes & Failures Dots Row
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Successes
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(
                        text = "Success: ",
                        color = if (isStabilized) HealthGreen else ParchmentMuted,
                        fontSize = 11.sp,
                        fontWeight = if (isStabilized) FontWeight.Bold else FontWeight.Normal
                    )
                    (1..3).forEach { index ->
                        val isFilled = index <= combatant.deathSavesSuccess
                        Box(
                            modifier = Modifier
                                .padding(horizontal = 3.dp)
                                .size(16.dp)
                                .clip(CircleShape)
                                .background(if (isFilled) HealthGreen else DungeonBorder.copy(alpha = 0.5f))
                                .border(1.dp, if (isFilled) HealthGreen else DungeonBorder, CircleShape),
                            contentAlignment = Alignment.Center
                        ) {
                            if (isFilled) {
                                Text("✓", color = DungeonCard, fontSize = 9.sp, fontWeight = FontWeight.Black)
                            }
                        }
                    }
                    Text(
                        text = " (${combatant.deathSavesSuccess}/3)",
                        color = if (isStabilized) HealthGreen else ParchmentMuted,
                        fontSize = 10.sp
                    )
                }

                // Failures
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(
                        text = "Failure: ",
                        color = if (isDead) BloodiedRed else ParchmentMuted,
                        fontSize = 11.sp,
                        fontWeight = if (isDead) FontWeight.Bold else FontWeight.Normal
                    )
                    (1..3).forEach { index ->
                        val isFilled = index <= combatant.deathSavesFailure
                        Box(
                            modifier = Modifier
                                .padding(horizontal = 3.dp)
                                .size(16.dp)
                                .clip(CircleShape)
                                .background(if (isFilled) BloodiedRed else DungeonBorder.copy(alpha = 0.5f))
                                .border(1.dp, if (isFilled) BloodiedRed else DungeonBorder, CircleShape),
                            contentAlignment = Alignment.Center
                        ) {
                            if (isFilled) {
                                Text("✕", color = ParchmentWhite, fontSize = 9.sp, fontWeight = FontWeight.Black)
                            }
                        }
                    }
                    Text(
                        text = " (${combatant.deathSavesFailure}/3)",
                        color = if (isDead) BloodiedRed else ParchmentMuted,
                        fontSize = 10.sp
                    )
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            // Action section: Full-width Pass/Fail buttons without cutoff, or Stabilized / Dead message
            if (isDead) {
                Column {
                    Text(
                        text = "💀 Player character has died from 3 failed death saving throws. They will be skipped in combat turn order, but are safely preserved in your Party Roster.",
                        color = BloodiedRed,
                        fontSize = 11.sp,
                        lineHeight = 15.sp
                    )
                    if (onRevive != null) {
                        Spacer(modifier = Modifier.height(6.dp))
                        Button(
                            onClick = onRevive,
                            colors = ButtonDefaults.buttonColors(containerColor = DndGold),
                            shape = RoundedCornerShape(8.dp),
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(38.dp)
                                .testTag("revive_player_btn")
                        ) {
                            Text(
                                text = "✨ Revive Player (Heal to 1 HP)",
                                color = DungeonCard,
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }
                }
            } else if (isStabilized) {
                Text(
                    text = "🌟 Character reached 3 successes and stabilized at 0 HP with the Unconscious condition. Safe from death saving throws unless they take damage. Heal above 0 HP to awaken.",
                    color = HealthGreen,
                    fontSize = 11.sp,
                    lineHeight = 15.sp
                )
            } else {
                // Dedicated full-width action buttons for Pass and Fail - zero text cutoff
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    Button(
                        onClick = { onDeathSave(true) },
                        colors = ButtonDefaults.buttonColors(containerColor = HealthGreen),
                        shape = RoundedCornerShape(8.dp),
                        contentPadding = PaddingValues(horizontal = 8.dp, vertical = 6.dp),
                        modifier = Modifier
                            .weight(1f)
                            .height(40.dp)
                            .testTag("death_save_pass_btn")
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.Center
                        ) {
                            Text("💚", fontSize = 13.sp)
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(
                                text = "Pass (+1)",
                                fontSize = 13.sp,
                                fontWeight = FontWeight.Bold,
                                color = ParchmentWhite
                            )
                        }
                    }

                    Button(
                        onClick = { onDeathSave(false) },
                        colors = ButtonDefaults.buttonColors(containerColor = BloodiedRed),
                        shape = RoundedCornerShape(8.dp),
                        contentPadding = PaddingValues(horizontal = 8.dp, vertical = 6.dp),
                        modifier = Modifier
                            .weight(1f)
                            .height(40.dp)
                            .testTag("death_save_fail_btn")
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.Center
                        ) {
                            Text("💔", fontSize = 13.sp)
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(
                                text = "Fail (+1)",
                                fontSize = 13.sp,
                                fontWeight = FontWeight.Bold,
                                color = ParchmentWhite
                            )
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun TurnAbilitiesAndFeatsSection(combatant: Combatant) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = DungeonCard),
        border = CardDefaults.outlinedCardBorder().copy(
            brush = Brush.linearGradient(listOf(DungeonBorder, DndGold.copy(alpha = 0.35f)))
        )
    ) {
        Column(modifier = Modifier.padding(horizontal = 8.dp, vertical = 6.dp)) {
            // Header: clean and compact without toggle
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text("⚡", fontSize = 12.sp)
                Spacer(modifier = Modifier.width(4.dp))
                Text(
                    text = "ABILITIES & ACTIONS",
                    color = DndGold,
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold,
                    letterSpacing = 0.5.sp
                )
            }

            Spacer(modifier = Modifier.height(4.dp))

            // Display character abilities & feats in space-saving compact rows
            val rawAbilities = combatant.abilitiesAndFeats.ifBlank { combatant.notes }
            val abilitiesList = if (rawAbilities.isNotBlank()) {
                rawAbilities.split("\n", ";").map { it.trim() }.filter { it.isNotBlank() }
            } else {
                getDefaultClassAbilities(combatant.characterClassOrType)
            }

            if (abilitiesList.isNotEmpty()) {
                Column(verticalArrangement = Arrangement.spacedBy(3.dp)) {
                    abilitiesList.forEach { abilityText ->
                        val detail = parseAbilityDetailed(abilityText)
                        val tagColor = when (detail.tag.lowercase()) {
                            "bonus" -> HealthGreen
                            "reaction" -> PlayerShieldBlue
                            "feat" -> DndGold
                            "spell" -> Color(0xFFA855F7)
                            else -> DndGoldLight
                        }

                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(4.dp))
                                .background(DungeonCardElevated)
                                .border(0.5.dp, DungeonBorder, RoundedCornerShape(4.dp))
                                .padding(horizontal = 6.dp, vertical = 2.5.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(3.dp))
                                    .background(tagColor.copy(alpha = 0.18f))
                                    .padding(horizontal = 4.dp, vertical = 1.dp)
                            ) {
                                Text(
                                    text = detail.tag.uppercase(),
                                    color = tagColor,
                                    fontSize = 7.5.sp,
                                    fontWeight = FontWeight.ExtraBold
                                )
                            }
                            Spacer(modifier = Modifier.width(5.dp))
                            Text(
                                text = "${detail.icon} ${detail.title}",
                                color = ParchmentWhite,
                                fontSize = 10.5.sp,
                                fontWeight = FontWeight.Bold
                            )
                            if (detail.description.isNotBlank()) {
                                Spacer(modifier = Modifier.width(4.dp))
                                Text(
                                    text = "• ${detail.description}",
                                    color = ParchmentMuted,
                                    fontSize = 9.sp,
                                    lineHeight = 11.sp,
                                    maxLines = 2,
                                    modifier = Modifier.weight(1f)
                                )
                            }
                        }
                    }
                }
            }

            // 5e Action Economy Quick Guide - Always expanded, all 4 boxes identical size
            Spacer(modifier = Modifier.height(6.dp))
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(IntrinsicSize.Max),
                horizontalArrangement = Arrangement.spacedBy(4.dp)
            ) {
                ActionEconomyBox(
                    modifier = Modifier
                        .weight(1f)
                        .fillMaxHeight(),
                    icon = "⚔️",
                    title = "Action",
                    titleColor = DndGold,
                    description = "Attack, Cast, Dash, Disengage, Dodge, Help, Hide"
                )

                ActionEconomyBox(
                    modifier = Modifier
                        .weight(1f)
                        .fillMaxHeight(),
                    icon = "⚡",
                    title = "Bonus",
                    titleColor = HealthGreen,
                    description = "Bonus Spells, Offhand, Class feats"
                )

                ActionEconomyBox(
                    modifier = Modifier
                        .weight(1f)
                        .fillMaxHeight(),
                    icon = "🛡️",
                    title = "Reaction",
                    titleColor = PlayerShieldBlue,
                    description = "Opportunity Attack, Shield, Counter"
                )

                ActionEconomyBox(
                    modifier = Modifier
                        .weight(1f)
                        .fillMaxHeight(),
                    icon = "👟",
                    title = "Move",
                    titleColor = ParchmentWhite,
                    description = "${combatant.speed}ft Speed (Walk, climb, swim)"
                )
            }
        }
    }
}

@Composable
private fun ActionEconomyBox(
    modifier: Modifier = Modifier,
    icon: String,
    title: String,
    titleColor: Color,
    description: String
) {
    Box(
        modifier = modifier
            .clip(RoundedCornerShape(5.dp))
            .background(DungeonCardElevated)
            .border(0.5.dp, DungeonBorder, RoundedCornerShape(5.dp))
            .padding(horizontal = 4.dp, vertical = 4.dp)
    ) {
        Column(
            modifier = Modifier.fillMaxSize(),
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            Text(
                text = "$icon $title",
                color = titleColor,
                fontSize = 9.sp,
                fontWeight = FontWeight.Bold,
                maxLines = 1
            )
            Spacer(modifier = Modifier.height(2.dp))
            Text(
                text = description,
                color = ParchmentMuted,
                fontSize = 7.5.sp,
                lineHeight = 9.5.sp,
                maxLines = 3
            )
        }
    }
}

private data class AbilityDetail(
    val icon: String,
    val tag: String,
    val title: String,
    val description: String
)

private fun parseAbilityDetailed(text: String): AbilityDetail {
    val clean = text.removePrefix("•").removePrefix("-").trim()
    val tag = when {
        clean.contains("Bonus Action", ignoreCase = true) || clean.contains("(Bonus)", ignoreCase = true) -> "Bonus"
        clean.contains("Reaction", ignoreCase = true) -> "Reaction"
        clean.contains("Spell", ignoreCase = true) -> "Spell"
        clean.contains("Feat", ignoreCase = true) || clean.contains("Trait", ignoreCase = true) || clean.contains("Passive", ignoreCase = true) -> "Feat"
        clean.contains("Action", ignoreCase = true) || clean.contains("Attack", ignoreCase = true) -> "Action"
        else -> "Trait"
    }

    val icon = when (tag) {
        "Bonus" -> "⚡"
        "Reaction" -> "🛡️"
        "Action" -> "⚔️"
        "Spell" -> "🔮"
        else -> "🌟"
    }

    var title = clean
    var desc = ""

    if (clean.contains("(") && clean.contains(")")) {
        title = clean.substringBefore("(").trim()
        val inside = clean.substring(clean.indexOf("(") + 1, clean.lastIndexOf(")")).trim()
        val after = clean.substringAfterLast(")", "").removePrefix(":").trim()
        desc = if (after.isNotBlank()) "$inside • $after" else inside
    } else if (clean.contains(":")) {
        title = clean.substringBefore(":").trim()
        desc = clean.substringAfter(":").trim()
    }

    if (title.isBlank()) title = clean
    return AbilityDetail(icon, tag, title, desc)
}

private fun getDefaultClassAbilities(characterClass: String): List<String> {
    val lower = characterClass.lowercase()
    return when {
        lower.contains("fighter") -> listOf(
            "Action Surge (Action: Take an extra action on your turn • 1/short rest)",
            "Second Wind (Bonus Action: Regain 1d10 + level HP • 1/short rest)",
            "Extra Attack (Can attack twice per Attack action)"
        )
        lower.contains("wizard") -> listOf(
            "Arcane Recovery (Regain spell slots on short rest)",
            "Shield (Reaction: +5 AC against incoming attack)",
            "Spellcasting (Cast 1 Action spell and/or Cantrip)"
        )
        lower.contains("rogue") -> listOf(
            "Sneak Attack (+2d6 damage with advantage or ally in 5ft)",
            "Cunning Action (Bonus Action: Dash, Disengage, or Hide)",
            "Uncanny Dodge (Reaction: Halve incoming attack damage)"
        )
        lower.contains("cleric") -> listOf(
            "Channel Divinity (Action: Turn Undead or Domain feature)",
            "Healing Word (Bonus Action: 60ft ranged heal 1d4 + mod)",
            "Spiritual Weapon (Bonus Action: Summon and attack for 1d8 + mod)"
        )
        lower.contains("barbarian") -> listOf(
            "Rage (Bonus Action: Advantage on STR, resistance to physical damage, +2 dmg)",
            "Reckless Attack (Advantage on melee attack rolls this turn)"
        )
        lower.contains("paladin") -> listOf(
            "Divine Smite (Expend spell slot for radiant damage on hit)",
            "Lay on Hands (Action: Restore pool of HP)",
            "Aura of Protection (Add CHA modifier to all saving throws)"
        )
        lower.contains("monk") -> listOf(
            "Flurry of Blows (Bonus Action: Make two unarmed strikes for 1 Ki)",
            "Patient Defense (Bonus Action: Take Dodge action for 1 Ki)",
            "Step of the Wind (Bonus Action: Dash or Disengage for 1 Ki)"
        )
        lower.contains("druid") -> listOf(
            "Wild Shape (Action: Transform into beast)",
            "Druidic Spellcasting (Spells & Rituals)"
        )
        lower.contains("bard") -> listOf(
            "Bardic Inspiration (Bonus Action: Give d6 die to ally within 60ft)",
            "Song of Rest & Spellcasting"
        )
        lower.contains("warlock") -> listOf(
            "Eldritch Blast (Cantrip 1d10 force damage per beam)",
            "Hex (Bonus Action: +1d6 necrotic damage on target)"
        )
        lower.contains("sorcerer") -> listOf(
            "Metamagic (Quickened Spell, Twinned Spell)",
            "Sorcery Points (Flexible casting & spell slots)"
        )
        else -> listOf(
            "Standard Action (Attack, Cast a Spell, Dash, Disengage, Dodge, Help, Hide)",
            "Opportunity Attack (Reaction: Strike enemy leaving melee reach)"
        )
    }
}

@Composable
private fun EmptyCombatView(
    onAddParty: () -> Unit,
    onAddBestiary: () -> Unit,
    onAddCustomEnemy: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        // Hero Image
        Image(
            painter = painterResource(id = R.drawable.img_dnd_banner_1790736424582),
            contentDescription = "D&D Banner",
            modifier = Modifier
                .fillMaxWidth()
                .height(180.dp)
                .clip(RoundedCornerShape(12.dp)),
            contentScale = ContentScale.Crop
        )

        Spacer(modifier = Modifier.height(18.dp))

        Text(
            text = "Encounter Arena Is Empty",
            color = ParchmentWhite,
            fontSize = 20.sp,
            fontWeight = FontWeight.Bold
        )

        Spacer(modifier = Modifier.height(6.dp))

        Text(
            text = "Assemble your party and enemies to roll initiative and begin tracking combat rounds, turns, and conditions.",
            color = ParchmentMuted,
            fontSize = 13.sp,
            textAlign = androidx.compose.ui.text.style.TextAlign.Center,
            modifier = Modifier.padding(horizontal = 16.dp)
        )

        Spacer(modifier = Modifier.height(20.dp))

        // Action Buttons
        Button(
            onClick = onAddParty,
            colors = ButtonDefaults.buttonColors(containerColor = DndGold),
            modifier = Modifier
                .fillMaxWidth()
                .testTag("add_party_to_combat_btn")
        ) {
            Text("🛡️ Add Saved Player Characters", color = DungeonCard, fontWeight = FontWeight.Bold)
        }

        Spacer(modifier = Modifier.height(8.dp))

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            OutlinedButton(
                onClick = onAddBestiary,
                colors = ButtonDefaults.outlinedButtonColors(contentColor = ParchmentWhite),
                border = ButtonDefaults.outlinedButtonBorder.copy(brush = Brush.linearGradient(listOf(DungeonBorder, DungeonBorder))),
                modifier = Modifier
                    .weight(1f)
                    .testTag("browse_bestiary_btn")
            ) {
                Text("🐉 Monster Library", fontSize = 12.sp)
            }

            OutlinedButton(
                onClick = onAddCustomEnemy,
                colors = ButtonDefaults.outlinedButtonColors(contentColor = MonsterCrimson),
                border = ButtonDefaults.outlinedButtonBorder.copy(brush = Brush.linearGradient(listOf(MonsterCrimson, MonsterCrimson))),
                modifier = Modifier
                    .weight(1f)
                    .testTag("quick_create_foe_btn")
            ) {
                Text("👹 Custom Foe", fontSize = 12.sp)
            }
        }
    }
}
