package com.doxa.controller

import com.doxa.models.Post
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/posts")
class PostController {

    @GetMapping("/recommended")
    fun getRecommended(): List<Post> {
        return listOf(
            Post("1", "d://conquistas", "#vida", "Emprego na gringa!", "Estudando ADS...", "User99", "OP", "2 h", 1240, 156, null)
        )
    }
}