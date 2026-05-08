package com.doxa.controller

import com.doxa.models.Community
import com.doxa.service.CommunityService
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/communities")
class CommunityController(private val communityService: CommunityService) {

    @GetMapping
    fun listAll(): List<Community> = communityService.getAllCommunities()

    @PostMapping
    fun create(@RequestBody community: Community): Community {
        return communityService.createCommunity(community)
    }
}