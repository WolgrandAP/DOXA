package com.doxa.models

import jakarta.persistence.*
import com.fasterxml.jackson.annotation.JsonIgnore

@Entity
@Table(name = "users")
class User(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    val id: String = "",

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
    var following: Int = 0
) {
    @OneToMany(mappedBy = "author", cascade = [CascadeType.ALL])
    @JsonIgnore
    var postsList: MutableList<Post> = mutableListOf()

    @ManyToMany
    @JoinTable(
        name = "user_saved_posts",
        joinColumns = [JoinColumn(name = "user_id")],
        inverseJoinColumns = [JoinColumn(name = "post_id")]
    )
    @JsonIgnore
    var savedPosts: MutableList<Post> = mutableListOf()

    @ManyToMany
    @JoinTable(
        name = "user_communities",
        joinColumns = [JoinColumn(name = "user_id")],
        inverseJoinColumns = [JoinColumn(name = "community_id")]
    )
    @JsonIgnore
    var joinedCommunities: MutableList<Community> = mutableListOf()

    @ManyToMany
    @JoinTable(
        name = "user_follows",
        joinColumns = [JoinColumn(name = "follower_id")],
        inverseJoinColumns = [JoinColumn(name = "followed_id")]
    )
    @JsonIgnore
    var followedUsers: MutableList<User> = mutableListOf()

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is User) return false
        return id == other.id
    }

    override fun hashCode(): Int = id.hashCode()
}