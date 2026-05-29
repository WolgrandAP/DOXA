package com.doxa.service

import com.doxa.dto.*
import com.doxa.repository.*
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime

@Service
class SyncService(
    private val userRepository: UserRepository,
    private val postRepository: PostRepository,
    private val communityRepository: CommunityRepository,
    private val commentRepository: CommentRepository
) {
    @Transactional
    fun pushSync(request: SyncPushRequest) {
        if (request.users.isNotEmpty()) userRepository.saveAll(request.users)
        if (request.communities.isNotEmpty()) communityRepository.saveAll(request.communities)
        if (request.posts.isNotEmpty()) postRepository.saveAll(request.posts)
        if (request.comments.isNotEmpty()) commentRepository.saveAll(request.comments)

        for (rel in request.userSavedPosts) {
            val user = userRepository.findById(rel.userId).orElse(null)
            val post = postRepository.findById(rel.postId).orElse(null)
            if (user != null && post != null) {
                if (!user.savedPosts.contains(post)) {
                    user.savedPosts.add(post)
                    userRepository.save(user)
                }
            }
        }

        for (rel in request.userCommunities) {
            val user = userRepository.findById(rel.userId).orElse(null)
            val community = communityRepository.findById(rel.communityId).orElse(null)
            if (user != null && community != null) {
                if (!user.joinedCommunities.contains(community)) {
                    user.joinedCommunities.add(community)
                    userRepository.save(user)
                }
            }
        }
    }

    @Transactional(readOnly = true)
    fun pullSync(lastSync: LocalDateTime?): SyncPullResponse {
        val currentServerTime = LocalDateTime.now()

        val users = if (lastSync == null) userRepository.findAll() else userRepository.findByUpdatedAtAfter(lastSync)
        val posts = if (lastSync == null) postRepository.findAll() else postRepository.findByUpdatedAtAfter(lastSync)
        val communities = if (lastSync == null) communityRepository.findAll() else communityRepository.findByUpdatedAtAfter(lastSync)
        val comments = if (lastSync == null) commentRepository.findAll() else commentRepository.findByUpdatedAtAfter(lastSync)

        val userSavedPosts = mutableListOf<UserPostRelation>()
        val userCommunities = mutableListOf<UserCommunityRelation>()

        for (user in users) {
            user.savedPosts.forEach { post -> userSavedPosts.add(UserPostRelation(user.id, post.id)) }
            user.joinedCommunities.forEach { comm -> userCommunities.add(UserCommunityRelation(user.id, comm.id)) }
        }

        return SyncPullResponse(
            serverTimestamp = currentServerTime,
            users = users,
            posts = posts,
            communities = communities,
            userSavedPosts = userSavedPosts,
            userCommunities = userCommunities
        )
    }
}