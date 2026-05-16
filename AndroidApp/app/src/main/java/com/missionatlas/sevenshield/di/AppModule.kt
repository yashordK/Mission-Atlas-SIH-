package com.missionatlas.sevenshield.di

import com.missionatlas.sevenshield.BuildConfig
import com.missionatlas.sevenshield.data.repository.GroqRepository
import com.missionatlas.sevenshield.data.repository.SupabaseRepository
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import io.github.jan.supabase.SupabaseClient
import io.github.jan.supabase.createSupabaseClient
import io.github.jan.supabase.postgrest.Postgrest
import io.github.jan.supabase.auth.Auth
import io.github.jan.supabase.realtime.Realtime
import io.ktor.client.HttpClient
import io.ktor.client.engine.android.Android
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation
import io.ktor.serialization.kotlinx.json.json
import kotlinx.serialization.json.Json
import javax.inject.Named
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object AppModule {

    @Provides
    @Singleton
    fun provideSupabaseClient(): SupabaseClient = createSupabaseClient(
        supabaseUrl = BuildConfig.SUPABASE_URL,
        supabaseKey = BuildConfig.SUPABASE_ANON_KEY,
    ) {
        install(Postgrest)
        install(Auth)
        install(Realtime)
    }

    @Provides
    @Singleton
    fun provideKtorHttpClient(): HttpClient = HttpClient(Android) {
        install(ContentNegotiation) {
            json(Json {
                ignoreUnknownKeys = true
                isLenient = true
            })
        }
    }

    @Provides
    @Named("groqApiKey")
    fun provideGroqApiKey(): String = BuildConfig.GROQ_API_KEY

    @Provides
    @Singleton
    fun provideSupabaseRepository(client: SupabaseClient): SupabaseRepository =
        SupabaseRepository(client)

    @Provides
    @Singleton
    fun provideGroqRepository(
        httpClient: HttpClient,
        @Named("groqApiKey") apiKey: String,
    ): GroqRepository = GroqRepository(httpClient, apiKey)
}
