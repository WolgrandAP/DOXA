package com.doxa.service

import com.doxa.models.User
import com.doxa.repository.UserRepository
import org.springframework.stereotype.Service
import java.util.*

@Service
class UserService(
    private val userRepository: UserRepository
) {

    fun findAllUsers(): List<User> = userRepository.findAll()

    fun findUserById(id: String): Optional<User> = userRepository.findById(id)

    fun saveUser(user: User): User {
        if (userRepository.findByEmail(user.email).isPresent) {
            throw RuntimeException("Este e-mail já está cadastrado.")
        }

        val newUser = if (user.id.isBlank()) {
            user.copy(id = UUID.randomUUID().toString())
        } else {
            user
        }

        return userRepository.save(newUser)
    }

    fun findByEmail(email: String): Optional<User> = userRepository.findByEmail(email)
}