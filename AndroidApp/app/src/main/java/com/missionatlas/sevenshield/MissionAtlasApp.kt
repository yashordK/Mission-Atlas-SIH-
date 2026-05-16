package com.missionatlas.sevenshield

import android.app.Application
import android.content.Context
import dagger.hilt.android.HiltAndroidApp
import org.osmdroid.config.Configuration

@HiltAndroidApp
class MissionAtlasApp : Application() {
    override fun onCreate() {
        super.onCreate()
        Configuration.getInstance().apply {
            load(applicationContext, applicationContext.getSharedPreferences("osmdroid", Context.MODE_PRIVATE))
            userAgentValue = "MissionAtlas/1.0"
        }
    }
}
