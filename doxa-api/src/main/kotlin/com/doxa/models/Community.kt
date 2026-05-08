package com.doxa.models

import jakarta.persistence.*
import com.fasterxml.jackson.annotation.JsonIgnore

@Entity
@Table(name = "communities")
class Community(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    val id: String? = null,

    @Column(unique = true, nullable = false)
    var name: String = "",

    @Column(columnDefinition = "TEXT")
    var description: String = "",

    @ManyToOne
    @JoinColumn(name = "creator_id")
    val creator: User = User(),

    @Column(name = "topics")
    var topics: MutableList<String> = mutableListOf()
) {
    @OneToMany(mappedBy = "community", cascade = [CascadeType.ALL])
    @JsonIgnore
    var posts: MutableList<Post> = mutableListOf()

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is Community) return false
        return id == other.id
    }

    override fun hashCode(): Int = id.hashCode()
}