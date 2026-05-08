package com.doxa

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class DoxaApiApplication

fun main(args: Array<String>) {
    runApplication<DoxaApiApplication>(*args)
}