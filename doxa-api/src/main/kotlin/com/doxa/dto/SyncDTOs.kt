package com.doxa.dto

import com.doxa.models.Comment
import com.doxa.models.Community
import com.doxa.models.Post
import com.doxa.models.User

data class SyncPushRequest(
    val users: List<User> = emptyList(),
    val posts: List<Post> = emptyList(),
    val communities: List<Community> = emptyList(),
    val comments: List<Comment> = emptyList(),
    val userSavedPosts: List<UserPostRelation> = emptyList(),
    val userCommunities: List<UserCommunityRelation> = emptyList(),
    val userFollows: List<UserFollowRelation> = emptyList()
)

data class SyncPullResponse(
    val users: List<User> = emptyList(),
    val posts: List<Post> = emptyList(),
    val communities: List<Community> = emptyList(),
    val comments: List<Comment> = emptyList(),
    val userSavedPosts: List<UserPostRelation> = emptyList(),
    val userCommunities: List<UserCommunityRelation> = emptyList(),
    val userFollows: List<UserFollowRelation> = emptyList()
)

data class UserPostRelation(val userId: String, val postId: String)
data class UserCommunityRelation(val userId: String, val communityId: String)
data class UserFollowRelation(val followerId: String, val followedId: String)
