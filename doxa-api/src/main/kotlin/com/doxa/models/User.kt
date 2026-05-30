package com.doxa.models

import jakarta.persistence.*
import com.fasterxml.jackson.annotation.JsonIgnore

@Entity
@Table(name = "users")
class User(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @Column(nullable = false)
    var name: String = "",

    @Column(unique = true, nullable = false)
    var email: String = "",

    var password: String = "",

    @Column(unique = true)
    var handle: String = "",

    @Column(columnDefinition = "TEXT")
    var bio: String? = null,

    var avatarUrl: String? = null,
    var bannerUrl: String? = null,

    var followers: Int = 0,
    var following: Int = 0,

    @Column(name = "is_synced")
    var isSynced: Int = 1
) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is User) return false
        return id == other.id
    }

    override fun hashCode(): Int = id.hashCode()
}