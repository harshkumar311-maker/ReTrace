package com.retrace.retrace_backend.exception;

public class ItemNotFoundException extends RuntimeException {
    public ItemNotFoundException(Long id) {
        super("Item not found with id: " + id);
    }
}
