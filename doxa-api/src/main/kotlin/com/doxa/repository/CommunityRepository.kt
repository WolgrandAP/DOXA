package com.doxa.repository

import com.doxa.models.Community
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.time.LocalDateTime
import java.util.Optional

@Repository
interface CommunityRepository : JpaRepository<Community, String> {
    fun findByName(name: String): Optional<Community>

    fun findByUpdatedAtAfter(updatedAt: LocalDateTime): List<Community>
}