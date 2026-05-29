package com.doxa.controller

import com.doxa.dto.SyncPullResponse
import com.doxa.dto.SyncPushRequest
import com.doxa.service.SyncService
import org.springframework.format.annotation.DateTimeFormat
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.time.LocalDateTime

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
    fun pull(
        @RequestParam(required = false)
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
        lastSync: LocalDateTime?
    ): ResponseEntity<SyncPullResponse> {
        val response = syncService.pullSync(lastSync)
        return ResponseEntity.ok(response)
    }
}