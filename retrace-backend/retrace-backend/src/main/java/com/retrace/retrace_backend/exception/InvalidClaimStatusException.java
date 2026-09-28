package com.retrace.retrace_backend.exception;

public class InvalidClaimStatusException extends RuntimeException {
    public InvalidClaimStatusException(String status) {
        super("Invalid claim status: '" + status + "'. Expected one of PENDING, APPROVED, REJECTED.");
    }
}
