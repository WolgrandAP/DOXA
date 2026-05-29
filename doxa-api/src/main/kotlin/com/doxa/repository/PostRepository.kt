package com.doxa.repository

import com.doxa.models.Post
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.time.LocalDateTime

@Repository
interface PostRepository : JpaRepository<Post, String> {
    fun findByTag(tag: String): List<Post>
    fun findBySubject(subject: String): List<Post>

    fun findByUpdatedAtAfter(updatedAt: LocalDateTime): List<Post>
}