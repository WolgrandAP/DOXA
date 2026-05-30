package com.doxa.service

import com.doxa.models.Comment
import com.doxa.repository.CommentRepository
import com.doxa.repository.PostRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime

@Service
class CommentService(
    private val commentRepository: CommentRepository,
    private val postRepository: PostRepository
) {
    fun getCommentsByPost(postId: String): List<Comment> = commentRepository.findByPostId(postId)

    fun getCommentById(id: String) = commentRepository.findById(id)

    @Transactional
    fun addComment(comment: Comment): Comment {
        val post = postRepository.findById(comment.postId)
            .orElseThrow { RuntimeException("Post not found.") }

        post.commentsCount += 1
        post.updatedAt = LocalDateTime.now()
        postRepository.save(post)

        return commentRepository.save(comment)
    }

    @Transactional
    fun updateComment(id: String, comment: Comment): Comment {
        return commentRepository.findById(id).map { existingComment ->
            existingComment.apply {
                this.text = comment.text
                this.updatedAt = LocalDateTime.now()
            }
            commentRepository.save(existingComment)
        }.orElseThrow { RuntimeException("Comment not found") }
    }

    @Transactional
    fun deleteComment(id: String) {
        commentRepository.findById(id).ifPresent { comment ->
            val post = postRepository.findById(comment.postId).orElse(null)
            if (post != null) {
                post.commentsCount -= 1
                post.updatedAt = LocalDateTime.now()
                postRepository.save(post)
            }
            commentRepository.deleteById(id)
        }
    }

    @Transactional
    fun likeComment(id: String): Comment {
        return commentRepository.findById(id).map { comment ->
            comment.apply {
                this.likes += 1
                this.updatedAt = LocalDateTime.now()
            }
            commentRepository.save(comment)
        }.orElseThrow { RuntimeException("Comment not found") }
    }
}