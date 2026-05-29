package com.doxa.repository

import com.doxa.models.User
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.time.LocalDateTime
import java.util.Optional

@Repository
interface UserRepository : JpaRepository<User, String> {
    fun findByEmail(email: String): Optional<User>
    fun existsByHandle(handle: String): Boolean

    fun findByUpdatedAtAfter(updatedAt: LocalDateTime): List<User>
}