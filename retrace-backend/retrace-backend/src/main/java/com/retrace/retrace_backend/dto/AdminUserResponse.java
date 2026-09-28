package com.retrace.retrace_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AdminUserResponse {

    private Long id;
    private String name;
    private String email;
    private long reports;
    private String status;
    private String role;
}