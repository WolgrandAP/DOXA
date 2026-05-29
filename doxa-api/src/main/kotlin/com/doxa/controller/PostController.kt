package com.doxa.controller

import com.doxa.models.Post
import com.doxa.service.PostService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = ["*"])
class PostController(
    private val postService: PostService
) {

    @GetMapping
    fun getAllPosts(): List<Post> = postService.getAllPosts()

    @GetMapping("/{id}")
    fun getPostById(@PathVariable id: String): ResponseEntity<Post> {
        return postService.getPostById(id)
            .map { ResponseEntity.ok(it) }
            .orElse(ResponseEntity.notFound().build())
    }

    @GetMapping("/subject/{subject}")
    fun getPostsBySubject(@PathVariable subject: String): List<Post> {
        return postService.getPostsByCommunity(subject)
    }

    @GetMapping("/tag/{tagName}")
    fun getPostsByTag(@PathVariable tagName: String): List<Post> {
        return postService.getPostsByTag(tagName)
    }

    @PostMapping
    fun createPost(@RequestBody post: Post): ResponseEntity<Post> {
        return try {
            val newPost = postService.createPost(post)
            ResponseEntity.status(HttpStatus.CREATED).body(newPost)
        } catch (e: Exception) {
            ResponseEntity.status(HttpStatus.BAD_REQUEST).build()
        }
    }

    @PutMapping("/{id}")
    fun updatePost(@PathVariable id: String, @RequestBody post: Post): ResponseEntity<Post> {
        return try {
            val updatedPost = postService.updatePost(id, post)
            ResponseEntity.ok(updatedPost)
        } catch (e: Exception) {
            ResponseEntity.notFound().build()
        }
    }

    @DeleteMapping("/{id}")
    fun deletePost(@PathVariable id: String): ResponseEntity<Void> {
        return try {
            postService.deletePost(id)
            ResponseEntity.noContent().build()
        } catch (e: Exception) {
            ResponseEntity.notFound().build()
        }
    }

    @PostMapping("/{id}/like")
    fun likePost(@PathVariable id: String): ResponseEntity<Post> {
        return try {
            val likedPost = postService.likePost(id)
            ResponseEntity.ok(likedPost)
        } catch (e: Exception) {
            ResponseEntity.notFound().build()
        }
    }
}