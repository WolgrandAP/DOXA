package com.doxa.controller

import com.doxa.models.Comment
import com.doxa.service.CommentService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/comments")
class CommentController(
    private val commentService: CommentService
) {

    @GetMapping("/post/{postId}")
    fun getCommentsByPost(@PathVariable postId: String): List<Comment> {
        return commentService.getCommentsByPost(postId)
    }

    @PostMapping
    fun addComment(@RequestBody comment: Comment): ResponseEntity<Comment> {
        return try {
            val savedComment = commentService.addComment(comment)
            ResponseEntity.status(HttpStatus.CREATED).body(savedComment)
        } catch (e: Exception) {
            ResponseEntity.status(HttpStatus.BAD_REQUEST).build()
        }
    }
}