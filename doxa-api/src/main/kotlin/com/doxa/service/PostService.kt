package com.doxa.service

import com.doxa.models.Post
import com.doxa.repository.PostRepository
import org.springframework.stereotype.Service
import java.util.UUID

@Service
class PostService(
    private val postRepository: PostRepository
) {

    fun getAllPosts(): List<Post> {
        return postRepository.findAll()
    }

    fun getPostsBySubject(subject: String): List<Post> {
        return postRepository.findBySubject(subject)
    }

    fun getPostsByTag(tag: String): List<Post> {
        return postRepository.findByTag(tag)
    }

    fun createPost(post: Post): Post {
        // Falta fazer uma verificação se o post já existe
        val postToSave = if(post.id.isNullOrBlank()) {
            post.copy(id = UUID.randomUUID().toString())
        } else {
            post
        }
        return postRepository.save<Post>(postToSave)
    }
}