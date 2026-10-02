package com.example

import android.os.Bundle
import android.view.ViewGroup
import android.webkit.WebChromeClient
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.ComponentActivity
import androidx.activity.compose.BackHandler
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.navigationBars
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.safeDrawing
import androidx.compose.foundation.layout.windowInsetsPadding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Casino
import androidx.compose.material.icons.filled.Group
import androidx.compose.material.icons.filled.Language
import androidx.compose.material.icons.filled.PhoneAndroid
import androidx.compose.material.icons.filled.Shield
import androidx.compose.material.icons.filled.SportsKabaddi
import androidx.compose.material3.FilterChip
import androidx.compose.material3.FilterChipDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.NavigationBarItemDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.viewinterop.AndroidView
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.ui.screens.BestiaryScreen
import com.example.ui.screens.CombatArenaScreen
import com.example.ui.screens.DiceAndRulesScreen
import com.example.ui.screens.PartyRosterScreen
import com.example.ui.theme.DndGold
import com.example.ui.theme.DungeonBorder
import com.example.ui.theme.DungeonCard
import com.example.ui.theme.DungeonSurface
import com.example.ui.theme.MyApplicationTheme
import com.example.ui.theme.ParchmentMuted
import com.example.ui.theme.ParchmentWhite
import com.example.ui.viewmodel.CombatTrackerViewModel

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            MyApplicationTheme {
                MainApp()
            }
        }
    }
}

enum class ScreenTab(val title: String, val icon: ImageVector, val tag: String) {
    COMBAT("Combat", Icons.Default.SportsKabaddi, "tab_combat"),
    PARTY("Party", Icons.Default.Group, "tab_party"),
    BESTIARY("Bestiary", Icons.Default.Shield, "tab_bestiary"),
    DICE("Dice & Rules", Icons.Default.Casino, "tab_dice")
}

@Composable
fun MainApp(
    viewModel: CombatTrackerViewModel = viewModel()
) {
    // Mode: true = HTML Web App Preview, false = Native Android Compose UI
    var isHtmlWebView by rememberSaveable { mutableStateOf(true) }
    var currentTabIndex by rememberSaveable { mutableIntStateOf(0) }
    val tabs = ScreenTab.values()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .windowInsetsPadding(WindowInsets.safeDrawing)
            .background(DungeonSurface)
    ) {
        // Top Switcher between HTML Web App and Native UI
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(DungeonCard)
                .padding(horizontal = 12.dp, vertical = 6.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = "Mode:",
                fontSize = 12.sp,
                color = ParchmentMuted,
                fontWeight = FontWeight.SemiBold,
                modifier = Modifier.padding(end = 8.dp)
            )
            FilterChip(
                selected = isHtmlWebView,
                onClick = { isHtmlWebView = true },
                label = { Text("🌐 HTML Web App", fontSize = 11.sp, fontWeight = FontWeight.Bold) },
                colors = FilterChipDefaults.filterChipColors(
                    selectedContainerColor = DndGold,
                    selectedLabelColor = DungeonCard,
                    containerColor = DungeonSurface,
                    labelColor = ParchmentMuted
                ),
                modifier = Modifier.padding(end = 6.dp)
            )
            FilterChip(
                selected = !isHtmlWebView,
                onClick = { isHtmlWebView = false },
                label = { Text("📱 Native UI", fontSize = 11.sp, fontWeight = FontWeight.Bold) },
                colors = FilterChipDefaults.filterChipColors(
                    selectedContainerColor = DndGold,
                    selectedLabelColor = DungeonCard,
                    containerColor = DungeonSurface,
                    labelColor = ParchmentMuted
                )
            )
        }

        if (isHtmlWebView) {
            WebAppView(modifier = Modifier.fillMaxSize())
        } else {
            // Native Compose UI
            if (currentTabIndex != 0) {
                BackHandler {
                    currentTabIndex = 0
                }
            }

            val characters by viewModel.characters.collectAsStateWithLifecycle()
            val encounterState by viewModel.encounterState.collectAsStateWithLifecycle()
            val lastRoll by viewModel.lastRoll.collectAsStateWithLifecycle()
            val diceHistory by viewModel.diceHistory.collectAsStateWithLifecycle()

            Scaffold(
                containerColor = DungeonSurface,
                bottomBar = {
                    NavigationBar(
                        containerColor = DungeonCard,
                        contentColor = ParchmentWhite,
                        tonalElevation = 8.dp,
                        modifier = Modifier
                            .windowInsetsPadding(WindowInsets.navigationBars)
                            .testTag("main_bottom_nav")
                    ) {
                        tabs.forEachIndexed { index, tab ->
                            val isSelected = currentTabIndex == index
                            NavigationBarItem(
                                selected = isSelected,
                                onClick = { currentTabIndex = index },
                                icon = {
                                    Icon(
                                        imageVector = tab.icon,
                                        contentDescription = tab.title
                                    )
                                },
                                label = {
                                    Text(
                                        text = tab.title,
                                        fontSize = 11.sp,
                                        fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal
                                    )
                                },
                                colors = NavigationBarItemDefaults.colors(
                                    selectedIconColor = DungeonCard,
                                    selectedTextColor = DndGold,
                                    indicatorColor = DndGold,
                                    unselectedIconColor = ParchmentMuted,
                                    unselectedTextColor = ParchmentMuted
                                ),
                                modifier = Modifier.testTag(tab.tag)
                            )
                        }
                    }
                }
            ) { innerPadding ->
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(innerPadding)
                ) {
                    when (currentTabIndex) {
                        0 -> CombatArenaScreen(
                            viewModel = viewModel,
                            encounterState = encounterState,
                            onNavigateToParty = { currentTabIndex = 1 },
                            onNavigateToBestiary = { currentTabIndex = 2 },
                            onOpenDice = { currentTabIndex = 3 }
                        )
                        1 -> PartyRosterScreen(
                            viewModel = viewModel,
                            characters = characters,
                            onNavigateToCombat = { currentTabIndex = 0 }
                        )
                        2 -> BestiaryScreen(
                            viewModel = viewModel,
                            onNavigateToCombat = { currentTabIndex = 0 }
                        )
                        3 -> DiceAndRulesScreen(
                            viewModel = viewModel,
                            lastRoll = lastRoll,
                            diceHistory = diceHistory
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun WebAppView(modifier: Modifier = Modifier) {
    var webViewRef by remember { mutableStateOf<WebView?>(null) }

    BackHandler(enabled = webViewRef?.canGoBack() == true) {
        webViewRef?.goBack()
    }

    AndroidView(
        factory = { context ->
            WebView(context).apply {
                layoutParams = ViewGroup.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT,
                    ViewGroup.LayoutParams.MATCH_PARENT
                )
                // Use software layer type to avoid MESA rendernode missing errors in virtualized/container environments
                setLayerType(android.view.View.LAYER_TYPE_SOFTWARE, null)
                setBackgroundColor(android.graphics.Color.parseColor("#121019"))

                settings.javaScriptEnabled = true
                settings.domStorageEnabled = true
                settings.databaseEnabled = true
                settings.allowFileAccess = true
                settings.allowContentAccess = true
                settings.useWideViewPort = true
                settings.loadWithOverviewMode = true
                settings.setSupportZoom(false)
                settings.builtInZoomControls = false
                settings.displayZoomControls = false

                webViewClient = object : WebViewClient() {
                    override fun onRenderProcessGone(
                        view: WebView?,
                        detail: android.webkit.RenderProcessGoneDetail?
                    ): Boolean {
                        view?.post {
                            view.loadUrl("file:///android_asset/www/index.html")
                        }
                        return true
                    }
                }
                webChromeClient = WebChromeClient()
                loadUrl("file:///android_asset/www/index.html")
                webViewRef = this
            }
        },
        update = { webView ->
            webViewRef = webView
        },
        modifier = modifier
    )
}
