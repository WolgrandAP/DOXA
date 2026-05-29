package com.doxa.controller

import com.doxa.models.Comment
import com.doxa.service.CommentService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/comments")
@CrossOrigin(origins = ["*"])
class CommentController(
    private val commentService: CommentService
) {

    @GetMapping("/{id}")
    fun getCommentById(@PathVariable id: String): ResponseEntity<Comment> {
        return commentService.getCommentById(id)
            .map { ResponseEntity.ok(it) }
            .orElse(ResponseEntity.notFound().build())
    }

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

    @PutMapping("/{id}")
    fun updateComment(@PathVariable id: String, @RequestBody comment: Comment): ResponseEntity<Comment> {
        return try {
            val updatedComment = commentService.updateComment(id, comment)
            ResponseEntity.ok(updatedComment)
        } catch (e: Exception) {
            ResponseEntity.notFound().build()
        }
    }

    @DeleteMapping("/{id}")
    fun deleteComment(@PathVariable id: String): ResponseEntity<Void> {
        return try {
            commentService.deleteComment(id)
            ResponseEntity.noContent().build()
        } catch (e: Exception) {
            ResponseEntity.notFound().build()
        }
    }

    @PostMapping("/{id}/like")
    fun likeComment(@PathVariable id: String): ResponseEntity<Comment> {
        return try {
            val likedComment = commentService.likeComment(id)
            ResponseEntity.ok(likedComment)
        } catch (e: Exception) {
            ResponseEntity.notFound().build()
        }
    }
}