package com.doxa.models

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "posts")
class Post(
    @Id
    val id: String = "",

    @Column(name = "user_id")
    var userId: Long = 0,

    // Stores the author's display name directly (matches frontend SQLite schema)
    var author: String = "",

    var title: String = "",

    @Column(columnDefinition = "TEXT")
    var description: String? = null,

    var subject: String? = null,
    var tag: String? = null,
    var role: String = "",
    var time: String = "",

    @Column(name = "image_url")
    var imageUrl: String? = null,

    var upvotes: Int = 0,

    @Column(name = "comments_count")
    var commentsCount: Int = 0,

    @Column(name = "is_saved")
    var isSaved: Int = 0,

    @Column(name = "created_at")
    var createdAt: LocalDateTime = LocalDateTime.now(),

    @Column(name = "updated_at")
    var updatedAt: LocalDateTime = LocalDateTime.now(),

    @Column(name = "is_synced")
    var isSynced: Int = 1
) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is Post) return false
        return id == other.id
    }

    override fun hashCode(): Int = id.hashCode()
}