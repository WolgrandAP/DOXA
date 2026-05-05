package com.doxa

import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.plugins.cors.routing.*
import io.ktor.http.*
import com.doxa.routes.configureRouting

fun main() {
    embeddedServer(Netty, port = 8080, host = "0.0.0.0") {
        module()
    }.start(wait = true)
}

fun Application.module() {
    // Configura o JSON (igual ao express.json())
    install(ContentNegotiation) {
        json()
    }

    // Configura o CORS para que seu app Expo (localhost:19000 ou 8081) consiga acessar
    install(CORS) {
        anyHost() 
        allowHeader(HttpHeaders.ContentType)
    }

    configureRouting()
}