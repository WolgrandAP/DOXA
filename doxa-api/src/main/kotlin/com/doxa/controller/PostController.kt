package com.doxa.controller

import com.doxa.models.Post
import com.doxa.service.PostService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/posts")
class PostController(
    private val postService: PostService
) {

    @GetMapping
    fun getAllPosts(): List<Post> = postService.getAllPosts()

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
}