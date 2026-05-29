package com.doxa.service

import com.doxa.models.Community
import com.doxa.repository.CommunityRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime
import java.util.Optional

@Service
class CommunityService(private val communityRepository: CommunityRepository) {

    fun createCommunity(community: Community): Community {
        if (community.name.isNullOrEmpty()) {
            throw RuntimeException("Nome da comunidade é obrigatório.")
        }

        if (community.description.isNullOrEmpty()) {
            throw RuntimeException("Descrição da comunidade é obrigatória.")
        }

        return communityRepository.save(community)
    }

    fun getCommunityByName(communityName: String): Optional<Community> {
        return communityRepository.findByName(communityName)
    }

    fun getAllCommunities(): List<Community> = communityRepository.findAll()

    fun getCommunityById(id: String) = communityRepository.findById(id)

    @Transactional
    fun updateCommunity(id: String, community: Community): Community {
        return communityRepository.findById(id).map { existingCommunity ->
            val updated = existingCommunity.apply {
                this.name = community.name
                this.description = community.description
                this.members = community.members
                this.bannerUrl = community.bannerUrl
                this.updatedAt = LocalDateTime.now()
            }
            communityRepository.save(updated)
        }.orElseThrow { RuntimeException("Comunidade não encontrada") }
    }

    @Transactional
    fun deleteCommunity(id: String) {
        communityRepository.deleteById(id)
    }

    @Transactional
    fun addMemberToCommunity(communityId: String, userId: String): Boolean {
        return communityRepository.findById(communityId).map { community ->
            val memberCount = community.members.toIntOrNull() ?: 0
            community.members = (memberCount + 1).toString()
            community.updatedAt = LocalDateTime.now()
            communityRepository.save(community)
            true
        }.orElse(false)
    }
}