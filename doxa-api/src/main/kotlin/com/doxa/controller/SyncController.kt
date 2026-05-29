package com.doxa.controller

import com.doxa.dto.SyncPullResponse
import com.doxa.dto.SyncPushRequest
import com.doxa.service.SyncService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/sync")
@CrossOrigin(origins = ["*"])
class SyncController(private val syncService: SyncService) {

    @PostMapping("/push")
    fun push(@RequestBody request: SyncPushRequest): ResponseEntity<String> {
        syncService.pushSync(request)
        return ResponseEntity.ok("Sync push successful")
    }

    @GetMapping("/pull")
    fun pull(): ResponseEntity<SyncPullResponse> {
        val response = syncService.pullSync()
        return ResponseEntity.ok(response)
    }
}
