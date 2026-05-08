package com.doxa.service

import com.doxa.models.Post
import com.doxa.repository.PostRepository
import org.springframework.stereotype.Service

@Service
class PostService(private val postRepository: PostRepository) {

    fun getAllPosts(): List<Post> = postRepository.findAll()

    fun getPostsByCommunity(communityName: String): List<Post> {
        return postRepository.findByCommunityName(communityName)
    }

    fun getPostsByTag(tagName: String): List<Post> {
        return postRepository.findByTag(tagName)
    }

    fun createPost(post: Post): Post {
        return postRepository.save(post)
    }

    fun deletePost(id: String) {
        postRepository.deleteById(id)
    }
}