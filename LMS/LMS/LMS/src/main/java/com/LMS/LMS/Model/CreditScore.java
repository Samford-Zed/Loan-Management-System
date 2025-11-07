package com.LMS.LMS.Model;

import jakarta.persistence.*;
import java.util.Date;

@Entity
public class CreditScore {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @OneToOne
    @JoinColumn(name = "user_id", unique = true)
    private Users user;

    private int score; // Range: 300–900

    private Date lastUpdated;

    public CreditScore() {}

    public CreditScore(Users user) {
        this.user = user;
        this.score = 600; // default on registration
        this.lastUpdated = new Date();
    }

    // Getters and setters
    public int getId() { return id; }
    public Users getUser() { return user; }
    public void setUser(Users user) { this.user = user; }
    public int getScore() { return score; }
    public void setScore(int score) { this.score = score; }
    public Date getLastUpdated() { return lastUpdated; }
    public void setLastUpdated(Date lastUpdated) { this.lastUpdated = lastUpdated; }
}
