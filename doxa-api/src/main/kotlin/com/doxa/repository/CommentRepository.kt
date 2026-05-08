package com.doxa.repository

import com.doxa.models.Comment
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface CommentRepository : JpaRepository<Comment, String>{
    fun findByPostId(postId: String) : List<Comment>
}