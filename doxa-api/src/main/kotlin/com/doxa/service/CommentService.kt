package com.doxa.service

import com.doxa.models.Comment
import com.doxa.repository.CommentRepository
import com.doxa.repository.PostRepository
import jakarta.transaction.Transactional
import org.springframework.stereotype.Service

@Service
class CommentService(
    private val commentRepository: CommentRepository,
    private val postRepository: PostRepository
) {
    fun getCommentsByPost(postId: String): List<Comment> = commentRepository.findByPostId(postId)

    @Transactional
    fun addComment(comment: Comment): Comment {
        val post = postRepository.findById(comment.post.id)
            .orElseThrow { RuntimeException("Post não encontrado.") }

        post.comments += 1
        postRepository.save(post)

        return commentRepository.save(comment)
    }

    fun deleteComment(id: String) = commentRepository.deleteById(id)
}