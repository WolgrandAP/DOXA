package com.doxa.models

import jakarta.persistence.*

@Entity
@Table(name = "comments")
data class Comment (
    @Id
    val id: String = "",

    @Column(columnDefinition = "TEXT", nullable = false)
    var content: String = "",

    @ManyToOne
    @JoinColumn(name = "user_id")
    val author: User = User(),

    @ManyToOne
    @JoinColumn(name = "post_id")
    val post: Post = Post()
)