package com.doxa.service

import com.doxa.models.User
import com.doxa.repository.UserRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime

@Service
class UserService(private val userRepository: UserRepository) {

    fun findAllUsers(): List<User> = userRepository.findAll()

    fun findUserById(id: String) = userRepository.findById(id)

    fun saveUser(user: User): User {
        if (userRepository.findByEmail(user.email).isPresent) {
            throw RuntimeException("Este e-mail já está cadastrado.")
        }
        return userRepository.save(user)
    }

    fun existsUserByHandle(handle: String): Boolean {
        return userRepository.existsByHandle(handle)
    }

    fun findByEmail(email: String) = userRepository.findByEmail(email)

    @Transactional
    fun updateUser(id: String, user: User): User {
        return userRepository.findById(id).map { existingUser ->
            val updated = existingUser.apply {
                this.name = user.name
                this.email = user.email
                this.handle = user.handle
                this.bio = user.bio
                this.avatarUrl = user.avatarUrl
                this.bannerUrl = user.bannerUrl
                this.followers = user.followers
                this.following = user.following
                this.password = user.password
            }
            userRepository.save(updated)
        }.orElseThrow { RuntimeException("Usuário não encontrado") }
    }

    @Transactional
    fun deleteUser(id: String) {
        userRepository.deleteById(id)
    }

    @Transactional
    fun followUser(followerId: String, followedId: String): Boolean {
        if (followerId == followedId) return false

        return userRepository.findById(followerId).flatMap { follower ->
            userRepository.findById(followedId).map { followed ->
                if (!follower.followedUsers.contains(followed)) {
                    follower.followedUsers.add(followed)
                    follower.following += 1
                    followed.followers += 1
                    userRepository.save(follower)
                    userRepository.save(followed)
                    true
                } else {
                    false
                }
            }
        }.orElse(false)
    }

    @Transactional
    fun unfollowUser(followerId: String, followedId: String): Boolean {
        return userRepository.findById(followerId).flatMap { follower ->
            userRepository.findById(followedId).map { followed ->
                if (follower.followedUsers.contains(followed)) {
                    follower.followedUsers.remove(followed)
                    follower.following -= 1
                    followed.followers -= 1
                    userRepository.save(follower)
                    userRepository.save(followed)
                    true
                } else {
                    false
                }
            }
        }.orElse(false)
    }
}