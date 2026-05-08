package com.doxa.service

import com.doxa.models.User
import com.doxa.repository.UserRepository
import org.springframework.stereotype.Service

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

    fun existsUserByUsername(username: String): Boolean {
        return userRepository.existsByUsername(username)
    }

    fun findByEmail(email: String) = userRepository.findByEmail(email)
}