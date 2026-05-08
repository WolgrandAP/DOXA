package com.doxa.models

import jakarta.persistence.*

@Entity
@Table(name = "comments")
class Comment(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    val id: String = "",

    @Column(columnDefinition = "TEXT", nullable = false)
    var content: String = "",

    @ManyToOne
    @JoinColumn(name = "user_id")
    val author: User = User(),

    @ManyToOne
    @JoinColumn(name = "post_id")
    val post: Post = Post()
) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is Comment) return false
        return id == other.id
    }

    override fun hashCode(): Int = id.hashCode()
}