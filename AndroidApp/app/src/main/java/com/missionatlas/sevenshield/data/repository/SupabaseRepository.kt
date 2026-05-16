package com.missionatlas.sevenshield.data.repository

import com.missionatlas.sevenshield.data.model.Incident
import com.missionatlas.sevenshield.data.model.SosAlert
import com.missionatlas.sevenshield.data.model.SosAlertInsert
import com.missionatlas.sevenshield.data.model.Tourist
import io.github.jan.supabase.SupabaseClient
import io.github.jan.supabase.postgrest.from
import io.github.jan.supabase.postgrest.query.Order
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class SupabaseRepository @Inject constructor(
    private val supabase: SupabaseClient,
) {

    // ── Tourists ─────────────────────────────────────────────────────────────

    suspend fun getTourists(): Result<List<Tourist>> = runCatching {
        supabase.from("tourists")
            .select()
            .decodeList<Tourist>()
    }

    // ── Incidents ─────────────────────────────────────────────────────────────

    suspend fun getIncidents(): Result<List<Incident>> = runCatching {
        supabase.from("incidents")
            .select {
                order("created_at", Order.DESCENDING)
                limit(50)
            }
            .decodeList<Incident>()
    }

    suspend fun getActiveIncidents(): Result<List<Incident>> = runCatching {
        supabase.from("incidents")
            .select {
                filter { eq("status", "active") }
                order("created_at", Order.DESCENDING)
            }
            .decodeList<Incident>()
    }

    // ── SOS Alerts ───────────────────────────────────────────────────────────

    suspend fun insertSosAlert(
        latitude: Double,
        longitude: Double,
        message: String = "SOS activated from Mission Atlas Android app",
    ): Result<SosAlert> = runCatching {
        supabase.from("sos_alerts")
            .insert(SosAlertInsert(latitude = latitude, longitude = longitude, message = message)) {
                select()
            }
            .decodeSingle<SosAlert>()
    }

    suspend fun getActiveSosAlerts(): Result<List<SosAlert>> = runCatching {
        supabase.from("sos_alerts")
            .select {
                filter { eq("status", "active") }
                order("created_at", Order.DESCENDING)
            }
            .decodeList<SosAlert>()
    }
}
