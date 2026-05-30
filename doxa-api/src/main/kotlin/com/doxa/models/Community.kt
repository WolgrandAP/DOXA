package com.doxa.models

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "communities")
class Community(
    @Id
    val id: String = "",

    @Column(unique = true, nullable = false)
    var name: String = "",

    @Column(columnDefinition = "TEXT")
    var description: String = "",

    @Column(name = "creator_id")
    var creatorId: Long = 0,

    var members: String = "0",

    @Column(name = "is_joined")
    var isJoined: Int = 0,

    @Column(name = "banner_url")
    var bannerUrl: String? = null,

    @Column(name = "is_synced")
    var isSynced: Int = 1,

    @Column(name = "created_at")
    var createdAt: LocalDateTime = LocalDateTime.now(),

    @Column(name = "updated_at")
    var updatedAt: LocalDateTime = LocalDateTime.now()
) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is Community) return false
        return id == other.id
    }

    override fun hashCode(): Int = id.hashCode()
}