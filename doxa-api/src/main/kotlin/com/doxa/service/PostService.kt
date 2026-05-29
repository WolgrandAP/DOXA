package com.doxa.service

import com.doxa.models.Post
import com.doxa.repository.PostRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime

@Service
class PostService(private val postRepository: PostRepository) {

    fun getAllPosts(): List<Post> = postRepository.findAll()

    fun getPostsByCommunity(subject: String): List<Post> {
        return postRepository.findBySubject(subject)
    }

    fun getPostsByTag(tagName: String): List<Post> {
        return postRepository.findByTag(tagName)
    }

    fun getPostById(id: String) = postRepository.findById(id)

    fun createPost(post: Post): Post {
        return postRepository.save(post)
    }

    @Transactional
    fun updatePost(id: String, post: Post): Post {
        return postRepository.findById(id).map { existingPost ->
            existingPost.apply {
                this.title = post.title
                this.description = post.description
                this.subject = post.subject
                this.tag = post.tag
                this.upvotes = post.upvotes
                this.commentsCount = post.commentsCount
                this.imageUrl = post.imageUrl
                this.updatedAt = LocalDateTime.now()
            }
            postRepository.save(existingPost)
        }.orElseThrow { RuntimeException("Post not found") }
    }

    @Transactional
    fun deletePost(id: String) {
        postRepository.deleteById(id)
    }

    @Transactional
    fun likePost(id: String): Post {
        return postRepository.findById(id).map { post ->
            post.apply {
                this.upvotes += 1
                this.updatedAt = LocalDateTime.now()
            }
            postRepository.save(post)
        }.orElseThrow { RuntimeException("Post not found") }
    }
}