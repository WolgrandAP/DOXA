package com.doxa.dto

import com.doxa.models.Comment
import com.doxa.models.Community
import com.doxa.models.Post
import com.doxa.models.User
import java.time.LocalDateTime

data class SyncPushRequest(
    val users: List<User> = emptyList(),
    val posts: List<Post> = emptyList(),
    val communities: List<Community> = emptyList(),
    val comments: List<Comment> = emptyList(),
    val userSavedPosts: List<UserPostRelation> = emptyList(),
    val userCommunities: List<UserCommunityRelation> = emptyList()
)

data class SyncPullResponse(
    val serverTimestamp: LocalDateTime,
    val users: List<User> = emptyList(),
    val posts: List<Post> = emptyList(),
    val communities: List<Community> = emptyList(),
    val comments: List<Comment> = emptyList(),
    val userSavedPosts: List<UserPostRelation> = emptyList(),
    val userCommunities: List<UserCommunityRelation> = emptyList()
)

data class UserPostRelation(val userId: String, val postId: String)
data class UserCommunityRelation(val userId: String, val communityId: String)