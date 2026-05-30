package com.doxa.dto

import java.time.LocalDateTime

// ============================================================
// DTOs that match exactly what the React Native frontend sends/expects
// ============================================================

// --- Push Request (what the frontend sends) ---

data class SyncPushRequest(
    val users: List<SyncUserDTO> = emptyList(),
    val posts: List<SyncPostDTO> = emptyList(),
    val communities: List<SyncCommunityDTO> = emptyList(),
    val comments: List<SyncCommentDTO> = emptyList(),
    val userSavedPosts: List<UserPostRelation> = emptyList(),
    val userCommunities: List<UserCommunityRelation> = emptyList(),
    val userFollows: List<UserFollowRelation> = emptyList()
)

// --- Pull Response (what the frontend expects) ---

data class SyncPullResponse(
    val serverTimestamp: LocalDateTime,
    val users: List<SyncUserDTO> = emptyList(),
    val posts: List<SyncPostDTO> = emptyList(),
    val communities: List<SyncCommunityDTO> = emptyList(),
    val comments: List<SyncCommentDTO> = emptyList(),
    val userSavedPosts: List<UserPostRelation> = emptyList(),
    val userCommunities: List<UserCommunityRelation> = emptyList(),
    val userFollows: List<UserFollowRelation> = emptyList()
)

// --- Flat DTOs matching the SQLite schema from the frontend ---

data class SyncUserDTO(
    val id: Long = 0,
    val name: String = "",
    val email: String = "",
    val password: String = "",
    val handle: String = "",
    val bio: String? = null,
    val avatarUrl: String? = null,
    val bannerUrl: String? = null,
    val followers: Int = 0,
    val following: Int = 0,
    val is_synced: Int = 0
)

data class SyncPostDTO(
    val id: String = "",
    val user_id: Long = 0,
    val author: String = "",
    val title: String = "",
    val description: String? = null,
    val subject: String? = null,
    val tag: String? = null,
    val role: String = "",
    val time: String = "",
    val image_url: String? = null,
    val upvotes: Int = 0,
    val comments_count: Int = 0,
    val is_saved: Int = 0,
    val created_at: String? = null,
    val updated_at: String? = null,
    val is_synced: Int = 0
)

data class SyncCommunityDTO(
    val id: String = "",
    val name: String = "",
    val members: String = "0",
    val description: String? = null,
    val is_joined: Int = 0,
    val creator_id: Long = 0,
    val banner_url: String? = null,
    val created_at: String? = null,
    val updated_at: String? = null,
    val is_synced: Int = 0
)

data class SyncCommentDTO(
    val id: String = "",
    val post_id: String = "",
    val user_id: Long = 0,
    val author: String? = null,
    val avatar: String? = null,
    val text: String = "",
    val time: String = "",
    val likes: Int = 0,
    val isLiked: Int = 0,
    val replies: String = "[]",
    val is_synced: Int = 0,
    val created_at: String? = null,
    val updated_at: String? = null
)

// --- Relationship DTOs ---

data class UserPostRelation(val userId: Long = 0, val postId: String = "")
data class UserCommunityRelation(val userId: Long = 0, val communityId: String = "")
data class UserFollowRelation(val followerId: Long = 0, val followedId: Long = 0)