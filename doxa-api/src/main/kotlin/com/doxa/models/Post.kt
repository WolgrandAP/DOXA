package com.doxa.models

import jakarta.persistence.*
import com.fasterxml.jackson.annotation.JsonIgnore

@Entity
@Table(name = "posts")
class Post(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    val id: String = "",

    @ManyToOne
    @JoinColumn(name = "community_id")
    var community: Community = Community(),

    var tag: String = "",
    var title: String = "",

    @Column(columnDefinition = "TEXT")
    var description: String? = null,

    @ManyToOne
    @JoinColumn(name = "user_id")
    val author: User = User(),

    var role: String = "",
    val time: String = "",
    var votes: Int = 0,
    var comments: Int = 0,
    var imageUrl: String? = null
) {
    @OneToMany(mappedBy = "post", cascade = [CascadeType.ALL])
    @JsonIgnore
    var commentsList: MutableList<Comment> = mutableListOf()

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is Post) return false
        return id == other.id
    }

    override fun hashCode(): Int = id.hashCode()
}