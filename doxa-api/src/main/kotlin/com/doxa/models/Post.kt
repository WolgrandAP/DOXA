package com.doxa.models

import kotlinx.serialization.Serializable

@Serializable
data class Post(
    val id: String,
    val subject: String,
    val tag: String,
    val title: String,
    val description: String?, // ? significa que pode ser nulo
    val author: String,
    val role: String,
    val time: String,
    val votes: Int,
    val comments: Int,
    val imageUrl: String?
)