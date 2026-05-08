package com.doxa.config

import org.springframework.context.annotation.Configuration
import org.springframework.web.servlet.config.annotation.CorsRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer

@Configuration
class WebConfig : WebMvcConfigurer {
    override fun addCorsMappings(registry: CorsRegistry) {
        registry.addMapping("/**") // Libera todas as rotas
            .allowedOrigins("*")     // Em produção, você colocará o endereço do app
            .allowedMethods("GET", "POST", "PUT", "DELETE")
    }
}