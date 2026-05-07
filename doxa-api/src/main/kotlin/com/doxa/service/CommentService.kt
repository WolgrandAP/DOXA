package com.doxa.service

import com.doxa.models.Comment
import com.doxa.models.Post
import com.doxa.repository.CommentRepository
import com.doxa.repository.PostRepository
import org.springframework.stereotype.Service
import java.util.UUID

@Service
class CommentService(
    private val commentRepository: CommentRepository,
    private val postRepository: PostRepository
) {

    fun getCommentsByPost(postId: String): List<Comment> {
        return commentRepository.findByPostId(postId)
    }

    fun addComment(comment: Comment): Comment {
        val post = postRepository.findById(comment.post.id).orElseThrow { RuntimeException("Não é possível comentar: o post não foi encontrado.") }

        val commentToSave = if (comment.id.isBlank()) {
            comment.copy(id = UUID.randomUUID().toString())
        } else {
            comment
        }

        post.comments += 1

        postRepository.save<Post>(post)

        return commentRepository.save<Comment>(commentToSave)
    }

    fun deleteComment(id: String) {
        commentRepository.deleteById(id)
    }
}