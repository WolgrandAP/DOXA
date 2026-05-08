package com.doxa.repository

import com.doxa.models.Post
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface PostRepository : JpaRepository<Post, String> {
    fun findByTag(tag: String): List<Post>

    fun findByCommunityName(communityName: String): List<Post>
}