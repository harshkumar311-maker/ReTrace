package com.retrace.retrace_backend.dto;

import com.retrace.retrace_backend.entity.User;

public class AuthResponse {

    private Long id;
    private String name;
    private String email;
    private String phone;
    private User.Role role;
    private String token;

    public AuthResponse() {
    }

    public AuthResponse(Long id, String name, String email, String phone, User.Role role, String token) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.role = role;
        this.token = token;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public User.Role getRole() {
        return role;
    }

    public void setRole(User.Role role) {
        this.role = role;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}