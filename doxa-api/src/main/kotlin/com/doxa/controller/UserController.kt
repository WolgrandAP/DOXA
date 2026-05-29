package com.doxa.controller

import com.doxa.models.User
import com.doxa.service.UserService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = ["*"])
class UserController(
    private val userService: UserService
) {

    @GetMapping
    fun getAllUsers(): List<User> = userService.findAllUsers()

    @GetMapping("/{id}")
    fun getUserById(@PathVariable id: String): ResponseEntity<User> {
        return userService.findUserById(id)
            .map { ResponseEntity.ok(it) }
            .orElse(ResponseEntity.notFound().build())
    }

    @PostMapping
    fun createUser(@RequestBody user: User): ResponseEntity<User> {
        return try {
            val savedUser = userService.saveUser(user)
            ResponseEntity.status(HttpStatus.CREATED).body(savedUser)
        } catch (e: Exception) {
            ResponseEntity.status(HttpStatus.BAD_REQUEST).build()
        }
    }

    @PutMapping("/{id}")
    fun updateUser(@PathVariable id: String, @RequestBody user: User): ResponseEntity<User> {
        return try {
            val updatedUser = userService.updateUser(id, user)
            ResponseEntity.ok(updatedUser)
        } catch (e: Exception) {
            ResponseEntity.notFound().build()
        }
    }

    @DeleteMapping("/{id}")
    fun deleteUser(@PathVariable id: String): ResponseEntity<Void> {
        return try {
            userService.deleteUser(id)
            ResponseEntity.noContent().build()
        } catch (e: Exception) {
            ResponseEntity.notFound().build()
        }
    }

    @PostMapping("/{followerId}/follow/{followedId}")
    fun followUser(@PathVariable followerId: String, @PathVariable followedId: String): ResponseEntity<Map<String, Any>> {
        return try {
            val success = userService.followUser(followerId, followedId)
            if (success) {
                ResponseEntity.ok(mapOf("success" to true, "message" to "Usuário seguido com sucesso"))
            } else {
                ResponseEntity.badRequest().body(mapOf("success" to false, "message" to "Não foi possível seguir o usuário"))
            }
        } catch (e: Exception) {
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(mapOf("success" to false, "message" to e.message))
        }
    }

    @PostMapping("/{followerId}/unfollow/{followedId}")
    fun unfollowUser(@PathVariable followerId: String, @PathVariable followedId: String): ResponseEntity<Map<String, Any>> {
        return try {
            val success = userService.unfollowUser(followerId, followedId)
            if (success) {
                ResponseEntity.ok(mapOf("success" to true, "message" to "Usuário deixado de seguir com sucesso"))
            } else {
                ResponseEntity.badRequest().body(mapOf("success" to false, "message" to "Não foi possível deixar de seguir o usuário"))
            }
        } catch (e: Exception) {
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(mapOf("success" to false, "message" to e.message))
        }
    }

    @GetMapping("/{email}/by-email")
    fun getUserByEmail(@PathVariable email: String): ResponseEntity<User> {
        return userService.findByEmail(email)
            .map { ResponseEntity.ok(it) }
            .orElse(ResponseEntity.notFound().build())
    }
}