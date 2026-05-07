package com.doxa.models

import jakarta.persistence.*

@Entity
@Table(name = "users")
data class User(
    @Id
    val id: String = "",

    @Column(unique = true, nullable = false)
    var username: String = "",

    @Column(unique = true, nullable = false)
    var email: String = "",

    var password: String = "",

    @OneToMany(mappedBy = "author", cascade = [CascadeType.ALL])
    var postsList: List<Post> = mutableListOf()
)