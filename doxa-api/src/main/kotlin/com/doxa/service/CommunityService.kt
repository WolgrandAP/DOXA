package com.doxa.service

import com.doxa.models.Community
import com.doxa.repository.CommunityRepository
import org.springframework.stereotype.Service
import java.util.Optional

@Service
class CommunityService(private val communityRepository: CommunityRepository) {

    fun createCommunity(community: Community): Community {
        // Validação de regra de negócio: Máximo 3 tópicos
        if (community.topics.size > 3) {
            throw RuntimeException("Uma comunidade pode ter no máximo 3 tópicos relacionados.")
        }

        if (community.topics.isEmpty()) {
            throw RuntimeException("Selecione pelo menos 1 tópico para a comunidade.")
        }

        return communityRepository.save(community)
    }

    fun getCommunityByName(communityName: String): Optional<Community> {
        return communityRepository.findByName(communityName)
    }

    fun getAllCommunities(): List<Community> = communityRepository.findAll()

    fun getCommunityById(id: String) = communityRepository.findById(id)
}