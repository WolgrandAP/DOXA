package com.doxa.repository

import com.doxa.models.*
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface UserSavedPostRepository : JpaRepository<UserSavedPost, UserSavedPostId> {
    fun findByUserId(userId: Long): List<UserSavedPost>
}

@Repository
interface UserCommunityRepository : JpaRepository<UserCommunityEntity, UserCommunityId> {
    fun findByUserId(userId: Long): List<UserCommunityEntity>
}

@Repository
interface UserFollowRepository : JpaRepository<UserFollow, UserFollowId> {
    fun findByFollowerId(followerId: Long): List<UserFollow>
    fun findByFollowedId(followedId: Long): List<UserFollow>
}
