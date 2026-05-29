package com.doxa.service

import com.doxa.dto.*
import com.doxa.repository.*
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class SyncService(
    private val userRepository: UserRepository,
    private val postRepository: PostRepository,
    private val communityRepository: CommunityRepository,
    private val commentRepository: CommentRepository
) {
    @Transactional
    fun pushSync(request: SyncPushRequest) {
        // Salvar entidades base
        if (request.users.isNotEmpty()) userRepository.saveAll(request.users)
        if (request.communities.isNotEmpty()) communityRepository.saveAll(request.communities)
        if (request.posts.isNotEmpty()) postRepository.saveAll(request.posts)
        if (request.comments.isNotEmpty()) commentRepository.saveAll(request.comments)

        // Salvar relacionamentos
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

        for (rel in request.userFollows) {
            val follower = userRepository.findById(rel.followerId).orElse(null)
            val followed = userRepository.findById(rel.followedId).orElse(null)
            if (follower != null && followed != null) {
                if (!follower.followedUsers.contains(followed)) {
                    follower.followedUsers.add(followed)
                    userRepository.save(follower)
                }
            }
        }
    }

    @Transactional(readOnly = true)
    fun pullSync(): SyncPullResponse {
        val users = userRepository.findAll()
        val posts = postRepository.findAll()
        val communities = communityRepository.findAll()
        val comments = commentRepository.findAll()

        val userSavedPosts = mutableListOf<UserPostRelation>()
        val userCommunities = mutableListOf<UserCommunityRelation>()
        val userFollows = mutableListOf<UserFollowRelation>()

        for (user in users) {
            user.savedPosts.forEach { post -> userSavedPosts.add(UserPostRelation(user.id, post.id)) }
            user.joinedCommunities.forEach { comm -> userCommunities.add(UserCommunityRelation(user.id, comm.id ?: "")) }
            user.followedUsers.forEach { followed -> userFollows.add(UserFollowRelation(user.id, followed.id)) }
        }

        return SyncPullResponse(
            users = users,
            posts = posts,
            communities = communities,
            comments = comments,
            userSavedPosts = userSavedPosts,
            userCommunities = userCommunities,
            userFollows = userFollows
        )
    }
}
