package com.doxa.controller

import com.doxa.models.Community
import com.doxa.service.CommunityService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/communities")
@CrossOrigin(origins = ["*"])
class CommunityController(private val communityService: CommunityService) {

    @GetMapping
    fun listAll(): List<Community> = communityService.getAllCommunities()

    @GetMapping("/{id}")
    fun getById(@PathVariable id: String): ResponseEntity<Community> {
        return communityService.getCommunityById(id)
            .map { ResponseEntity.ok(it) }
            .orElse(ResponseEntity.notFound().build())
    }

    @GetMapping("/by-name/{name}")
    fun getByName(@PathVariable name: String): ResponseEntity<Community> {
        return communityService.getCommunityByName(name)
            .map { ResponseEntity.ok(it) }
            .orElse(ResponseEntity.notFound().build())
    }

    @PostMapping
    fun create(@RequestBody community: Community): ResponseEntity<Community> {
        return try {
            val created = communityService.createCommunity(community)
            ResponseEntity.status(HttpStatus.CREATED).body(created)
        } catch (e: Exception) {
            ResponseEntity.status(HttpStatus.BAD_REQUEST).build()
        }
    }

    @PutMapping("/{id}")
    fun update(@PathVariable id: String, @RequestBody community: Community): ResponseEntity<Community> {
        return try {
            val updated = communityService.updateCommunity(id, community)
            ResponseEntity.ok(updated)
        } catch (e: Exception) {
            ResponseEntity.notFound().build()
        }
    }

    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: String): ResponseEntity<Void> {
        return try {
            communityService.deleteCommunity(id)
            ResponseEntity.noContent().build()
        } catch (e: Exception) {
            ResponseEntity.notFound().build()
        }
    }

    @PostMapping("/{id}/add-member/{userId}")
    fun addMember(@PathVariable id: String, @PathVariable userId: String): ResponseEntity<Map<String, Any>> {
        return try {
            val success = communityService.addMemberToCommunity(id, userId)
            if (success) {
                ResponseEntity.ok(mapOf("success" to true, "message" to "Membro adicionado com sucesso"))
            } else {
                ResponseEntity.badRequest().body(mapOf("success" to false, "message" to "Erro ao adicionar membro"))
            }
        } catch (e: Exception) {
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(mapOf("success" to false, "message" to e.message))
        }
    }
}