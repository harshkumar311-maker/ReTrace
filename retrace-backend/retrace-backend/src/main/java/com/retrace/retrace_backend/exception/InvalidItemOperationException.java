package com.retrace.retrace_backend.exception;

/**
 * Thrown when an operation is attempted against an item in a state that
 * doesn't make sense for that operation — e.g. asking for matches against
 * an item that is actually a FOUND report, or filing a claim where the
 * "lost" item isn't actually LOST.
 */
public class InvalidItemOperationException extends RuntimeException {
    public InvalidItemOperationException(String message) {
        super(message);
    }
}
