package com.doxa.models

import jakarta.persistence.*
import com.fasterxml.jackson.annotation.JsonIgnore
import java.time.LocalDateTime

@Entity
@Table(name = "posts")
class Post(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    val id: String = "",

    var subject: String? = null,

    var tag: String? = null,
    var title: String = "",

    @Column(columnDefinition = "TEXT")
    var description: String? = null,

    @ManyToOne
    @JoinColumn(name = "user_id")
    val author: User = User(),

    var role: String = "",
    var time: String = "",
    var upvotes: Int = 0,
    var commentsCount: Int = 0,
    var imageUrl: String? = null,

    @Column(name = "created_at")
    var createdAt: LocalDateTime = LocalDateTime.now(),

    @Column(name = "updated_at")
    var updatedAt: LocalDateTime = LocalDateTime.now(),

    @Column(name = "is_synced")
    var isSynced: Int = 1
) {
    @OneToMany(mappedBy = "post", cascade = [CascadeType.ALL])
    @JsonIgnore
    var commentsList: MutableList<Comment> = mutableListOf()

    @ManyToMany(mappedBy = "savedPosts")
    @JsonIgnore
    var savedByUsers: MutableList<User> = mutableListOf()

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is Post) return false
        return id == other.id
    }

    override fun hashCode(): Int = id.hashCode()
}