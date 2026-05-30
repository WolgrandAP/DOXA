package com.doxa.service

import com.doxa.dto.*
import com.doxa.models.*
import com.doxa.repository.*
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

@Service
class SyncService(
    private val userRepository: UserRepository,
    private val postRepository: PostRepository,
    private val communityRepository: CommunityRepository,
    private val commentRepository: CommentRepository,
    private val userSavedPostRepository: UserSavedPostRepository,
    private val userCommunityRepository: UserCommunityRepository,
    private val userFollowRepository: UserFollowRepository
) {
    @Transactional
    fun pushSync(request: SyncPushRequest) {
        for (dto in request.users) {
            val user = userRepository.findById(dto.id).orElse(null)
            if (user != null) {
                user.name = dto.name
                user.email = dto.email
                user.password = dto.password
                user.handle = dto.handle
                user.bio = dto.bio
                user.avatarUrl = dto.avatarUrl
                user.bannerUrl = dto.bannerUrl
                user.followers = dto.followers
                user.following = dto.following
                user.isSynced = 1
                userRepository.save(user)
            } else {
                val newUser = User(
                    id = dto.id,
                    name = dto.name,
                    email = dto.email,
                    password = dto.password,
                    handle = dto.handle,
                    bio = dto.bio,
                    avatarUrl = dto.avatarUrl,
                    bannerUrl = dto.bannerUrl,
                    followers = dto.followers,
                    following = dto.following,
                    isSynced = 1
                )
                userRepository.save(newUser)
            }
        }

        for (dto in request.communities) {
            val community = communityRepository.findById(dto.id).orElse(null)
            if (community != null) {
                community.name = dto.name
                community.description = dto.description ?: ""
                community.members = dto.members
                community.creatorId = dto.creator_id
                community.bannerUrl = dto.banner_url
                community.isJoined = dto.is_joined
                community.isSynced = 1
                community.updatedAt = LocalDateTime.now()
                communityRepository.save(community)
            } else {
                val newCommunity = Community(
                    id = dto.id,
                    name = dto.name,
                    description = dto.description ?: "",
                    creatorId = dto.creator_id,
                    members = dto.members,
                    isJoined = dto.is_joined,
                    bannerUrl = dto.banner_url,
                    isSynced = 1,
                    createdAt = parseDateTime(dto.created_at),
                    updatedAt = parseDateTime(dto.updated_at)
                )
                communityRepository.save(newCommunity)
            }
        }

        for (dto in request.posts) {
            val post = postRepository.findById(dto.id).orElse(null)
            if (post != null) {
                post.userId = dto.user_id
                post.author = dto.author
                post.title = dto.title
                post.description = dto.description
                post.subject = dto.subject
                post.tag = dto.tag
                post.role = dto.role
                post.time = dto.time
                post.imageUrl = dto.image_url
                post.upvotes = dto.upvotes
                post.commentsCount = dto.comments_count
                post.isSaved = dto.is_saved
                post.isSynced = 1
                post.updatedAt = LocalDateTime.now()
                postRepository.save(post)
            } else {
                val newPost = Post(
                    id = dto.id,
                    userId = dto.user_id,
                    author = dto.author,
                    title = dto.title,
                    description = dto.description,
                    subject = dto.subject,
                    tag = dto.tag,
                    role = dto.role,
                    time = dto.time,
                    imageUrl = dto.image_url,
                    upvotes = dto.upvotes,
                    commentsCount = dto.comments_count,
                    isSaved = dto.is_saved,
                    isSynced = 1,
                    createdAt = parseDateTime(dto.created_at),
                    updatedAt = parseDateTime(dto.updated_at)
                )
                postRepository.save(newPost)
            }
        }

        for (dto in request.comments) {
            val comment = commentRepository.findById(dto.id).orElse(null)
            if (comment != null) {
                comment.text = dto.text
                comment.likes = dto.likes
                comment.isLiked = dto.isLiked
                comment.isSynced = 1
                comment.updatedAt = LocalDateTime.now()
                commentRepository.save(comment)
            } else {
                val newComment = Comment(
                    id = dto.id,
                    postId = dto.post_id,
                    userId = dto.user_id,
                    author = dto.author,
                    avatar = dto.avatar,
                    text = dto.text,
                    time = dto.time,
                    likes = dto.likes,
                    isLiked = dto.isLiked,
                    replies = dto.replies,
                    isSynced = 1,
                    createdAt = parseDateTime(dto.created_at),
                    updatedAt = parseDateTime(dto.updated_at)
                )
                commentRepository.save(newComment)
            }
        }

        for (rel in request.userSavedPosts) {
            val id = UserSavedPostId(rel.userId, rel.postId)
            if (!userSavedPostRepository.existsById(id)) {
                userSavedPostRepository.save(UserSavedPost(rel.userId, rel.postId))
            }
        }

        for (rel in request.userCommunities) {
            val id = UserCommunityId(rel.userId, rel.communityId)
            if (!userCommunityRepository.existsById(id)) {
                userCommunityRepository.save(UserCommunityEntity(rel.userId, rel.communityId))
            }
        }

        for (rel in request.userFollows) {
            val id = UserFollowId(rel.followerId, rel.followedId)
            if (!userFollowRepository.existsById(id)) {
                userFollowRepository.save(UserFollow(rel.followerId, rel.followedId))
            }
        }
    }

    @Transactional(readOnly = true)
    fun pullSync(): SyncPullResponse {
        val currentServerTime = LocalDateTime.now()

        val users = userRepository.findAll().map { user ->
            SyncUserDTO(
                id = user.id,
                name = user.name,
                email = user.email,
                password = user.password,
                handle = user.handle,
                bio = user.bio,
                avatarUrl = user.avatarUrl,
                bannerUrl = user.bannerUrl,
                followers = user.followers,
                following = user.following,
                is_synced = 1
            )
        }

        val posts = postRepository.findAll().map { post ->
            SyncPostDTO(
                id = post.id,
                user_id = post.userId,
                author = post.author,
                title = post.title,
                description = post.description,
                subject = post.subject,
                tag = post.tag,
                role = post.role,
                time = post.time,
                image_url = post.imageUrl,
                upvotes = post.upvotes,
                comments_count = post.commentsCount,
                is_saved = post.isSaved,
                created_at = post.createdAt.toString(),
                updated_at = post.updatedAt.toString(),
                is_synced = 1
            )
        }

        val communities = communityRepository.findAll().map { comm ->
            SyncCommunityDTO(
                id = comm.id,
                name = comm.name,
                members = comm.members,
                description = comm.description,
                is_joined = comm.isJoined,
                creator_id = comm.creatorId,
                banner_url = comm.bannerUrl,
                created_at = comm.createdAt.toString(),
                updated_at = comm.updatedAt.toString(),
                is_synced = 1
            )
        }

        val comments = commentRepository.findAll().map { comment ->
            SyncCommentDTO(
                id = comment.id,
                post_id = comment.postId,
                user_id = comment.userId,
                author = comment.author,
                avatar = comment.avatar,
                text = comment.text,
                time = comment.time,
                likes = comment.likes,
                isLiked = comment.isLiked,
                replies = comment.replies,
                is_synced = 1,
                created_at = comment.createdAt.toString(),
                updated_at = comment.updatedAt.toString()
            )
        }

        val userSavedPosts = userSavedPostRepository.findAll().map {
            UserPostRelation(it.userId, it.postId)
        }

        val userCommunities = userCommunityRepository.findAll().map {
            UserCommunityRelation(it.userId, it.communityId)
        }

        val userFollows = userFollowRepository.findAll().map {
            UserFollowRelation(it.followerId, it.followedId)
        }

        return SyncPullResponse(
            serverTimestamp = currentServerTime,
            users = users,
            posts = posts,
            communities = communities,
            comments = comments,
            userSavedPosts = userSavedPosts,
            userCommunities = userCommunities,
            userFollows = userFollows
        )
    }

    private fun parseDateTime(dateStr: String?): LocalDateTime {
        if (dateStr.isNullOrBlank()) return LocalDateTime.now()
        return try {
            LocalDateTime.parse(dateStr)
        } catch (e: Exception) {
            try {
                LocalDateTime.parse(dateStr, DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))
            } catch (e2: Exception) {
                LocalDateTime.now()
            }
        }
    }
}