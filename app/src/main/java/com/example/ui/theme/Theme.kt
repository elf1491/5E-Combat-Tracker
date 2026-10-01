package com.example.ui.theme

import android.app.Activity
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.SideEffect
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalView
import androidx.core.view.WindowCompat

// We prioritize our immersive D&D dark fantasy theme
private val DndColorScheme = darkColorScheme(
    primary = DndGold,
    onPrimary = DungeonBlack,
    primaryContainer = DndGoldDark,
    onPrimaryContainer = ParchmentWhite,
    secondary = DndRedLight,
    onSecondary = ParchmentWhite,
    secondaryContainer = DndRedDark,
    onSecondaryContainer = ParchmentWhite,
    tertiary = ArcanePurple,
    onTertiary = ParchmentWhite,
    background = DungeonBlack,
    onBackground = ParchmentWhite,
    surface = DungeonSurface,
    onSurface = ParchmentWhite,
    surfaceVariant = DungeonCard,
    onSurfaceVariant = ParchmentMuted,
    outline = DungeonBorder,
    outlineVariant = DungeonGoldBorder,
    error = BloodiedRed,
    onError = ParchmentWhite
)

@Composable
fun MyApplicationTheme(
    darkTheme: Boolean = true, // Tabletop D&D theme is best experienced in dark mode
    dynamicColor: Boolean = false, // Keep consistent high-polish fantasy branding
    content: @Composable () -> Unit
) {
    val colorScheme = DndColorScheme

    val view = LocalView.current
    if (!view.isInEditMode) {
        SideEffect {
            val window = (view.context as? Activity)?.window
            if (window != null) {
                window.statusBarColor = DungeonBlack.toArgb()
                window.navigationBarColor = DungeonBlack.toArgb()
                val insetsController = WindowCompat.getInsetsController(window, view)
                insetsController.isAppearanceLightStatusBars = false
                insetsController.isAppearanceLightNavigationBars = false
            }
        }
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}
