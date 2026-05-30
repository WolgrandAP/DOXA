package com.doxa.models

import jakarta.persistence.*
import java.io.Serializable

@Entity
@Table(name = "user_saved_posts")
@IdClass(UserSavedPostId::class)
class UserSavedPost(
    @Id
    @Column(name = "user_id")
    val userId: Long = 0,

    @Id
    @Column(name = "post_id")
    val postId: String = ""
)

data class UserSavedPostId(
    val userId: Long = 0,
    val postId: String = ""
) : Serializable

@Entity
@Table(name = "user_communities")
@IdClass(UserCommunityId::class)
class UserCommunityEntity(
    @Id
    @Column(name = "user_id")
    val userId: Long = 0,

    @Id
    @Column(name = "community_id")
    val communityId: String = ""
)

data class UserCommunityId(
    val userId: Long = 0,
    val communityId: String = ""
) : Serializable

@Entity
@Table(name = "user_follows")
@IdClass(UserFollowId::class)
class UserFollow(
    @Id
    @Column(name = "follower_id")
    val followerId: Long = 0,

    @Id
    @Column(name = "followed_id")
    val followedId: Long = 0
)

data class UserFollowId(
    val followerId: Long = 0,
    val followedId: Long = 0
) : Serializable
