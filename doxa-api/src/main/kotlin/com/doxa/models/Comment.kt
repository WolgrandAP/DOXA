package com.doxa.models

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "comments")
class Comment(
    @Id
    val id: String = "",

    @Column(name = "post_id", nullable = false)
    var postId: String = "",

    @Column(name = "user_id", nullable = false)
    var userId: Long = 0,

    // Frontend stores author name and avatar directly in the comments table
    var author: String? = null,
    var avatar: String? = null,

    @Column(columnDefinition = "TEXT", nullable = false)
    var text: String = "",

    var time: String = "",
    var likes: Int = 0,
    var isLiked: Int = 0,

    @Column(columnDefinition = "TEXT")
    var replies: String = "[]",

    @Column(name = "is_synced")
    var isSynced: Int = 1,

    @Column(name = "created_at")
    var createdAt: LocalDateTime = LocalDateTime.now(),

    @Column(name = "updated_at")
    var updatedAt: LocalDateTime = LocalDateTime.now()
) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is Comment) return false
        return id == other.id
    }

    override fun hashCode(): Int = id.hashCode()
}