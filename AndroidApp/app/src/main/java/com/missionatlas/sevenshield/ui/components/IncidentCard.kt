package com.missionatlas.sevenshield.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.missionatlas.sevenshield.data.model.Incident
import com.missionatlas.sevenshield.ui.theme.*
import java.time.Instant
import java.time.ZoneId
import java.time.format.DateTimeFormatter
import java.util.Locale

@Composable
fun IncidentCard(incident: Incident) {
    val (dotColor, bgColor) = when (incident.severity) {
        "high"   -> Pair(EmergencyRed,   EmergencyRed.copy(alpha = 0.12f))
        "medium" -> Pair(WarningAmber,   WarningAmber.copy(alpha = 0.12f))
        else     -> Pair(ElectricBlue,   ElectricBlue.copy(alpha = 0.10f))
    }

    val timeAgo = formatTimeAgo(incident.createdAt)
    val truncatedTitle = incident.title.take(20).let { if (incident.title.length > 20) "$it…" else it }

    Surface(
        color = bgColor,
        shape = RoundedCornerShape(20.dp),
    ) {
        Row(
            modifier = Modifier.padding(horizontal = 12.dp, vertical = 8.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(7.dp),
        ) {
            Box(
                modifier = Modifier
                    .size(8.dp)
                    .clip(CircleShape)
                    .background(dotColor),
            )
            Column {
                Text(
                    truncatedTitle,
                    style = androidx.compose.material3.MaterialTheme.typography.labelLarge,
                    color = TextPrimary,
                    fontWeight = FontWeight.SemiBold,
                )
                Text(
                    timeAgo,
                    color = TextTertiary,
                    fontSize = 10.sp,
                )
            }
        }
    }
}

private fun formatTimeAgo(createdAt: String): String {
    return try {
        val instant = Instant.parse(createdAt)
        val diffMs = System.currentTimeMillis() - instant.toEpochMilli()
        val diffMins = diffMs / 60_000
        when {
            diffMins < 1  -> "Just now"
            diffMins < 60 -> "${diffMins}m ago"
            diffMins < 1440 -> "${diffMins / 60}h ago"
            else -> "${diffMins / 1440}d ago"
        }
    } catch (e: Exception) {
        "Recently"
    }
}
