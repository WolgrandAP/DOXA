package com.doxa.service

import com.doxa.models.User
import com.doxa.repository.UserRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class UserService(private val userRepository: UserRepository) {

    fun findAllUsers(): List<User> = userRepository.findAll()

    fun findUserById(id: Long) = userRepository.findById(id)

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
    fun updateUser(id: Long, user: User): User {
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
    fun deleteUser(id: Long) {
        userRepository.deleteById(id)
    }
}