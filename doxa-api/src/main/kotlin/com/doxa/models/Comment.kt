package com.doxa.models

import jakarta.persistence.*

@Entity
@Table(name = "comments")
class Comment(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    val id: String = "",

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    val author: User = User(),

    @ManyToOne
    @JoinColumn(name = "post_id", nullable = false)
    val post: Post = Post(),

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