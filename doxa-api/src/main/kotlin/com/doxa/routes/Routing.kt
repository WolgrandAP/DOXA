package com.doxa.routes

import io.ktor.server.routing.*
import io.ktor.server.response.*
import io.ktor.server.application.*

fun Application.configureRouting() {
    routing {
        get("/") {
            call.respondText("Backend da Doxa operando!")
        }

        get("/feed") {
            // No futuro, isso virá do banco de dados
            val fakePost = mapOf("id" to 1, "user" to "Dev", "content" to "Hello Kotlin!")
            call.respond(fakePost)
        }
    }
}