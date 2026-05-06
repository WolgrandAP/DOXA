package com.doxa.models

data class Post(
    val id: String,
    val subject: String,
    val tag: String,
    val title: String,
    val description: String?,
    val author: String,
    val role: String,
    val time: String,
    val votes: Int,
    val comments: Int,
    val imageUrl: String?
)