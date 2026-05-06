package com.doxa.models

import jakarta.persistence.*

@Entity
@Table(name = "posts")
data class Post(
    @Id
    val id: String = "",
    var subject: String = "",
    var tag: String = "",
    var title: String = "",

    @Column(columnDefinition = "TEXT")
    var description: String? = null,

    @ManyToOne
    @JoinColumn(name = "user_id")
    val author: User = User(),

    var role: String = "",
    val time: String = "",
    var votes: Int = 0,
    var comments: Int = 0,
    var imageUrl: String? = null,

    @OneToMany(mappedBy = "post", cascade = [CascadeType.ALL])
    var commentsList: List<Comment> = mutableListOf()
)