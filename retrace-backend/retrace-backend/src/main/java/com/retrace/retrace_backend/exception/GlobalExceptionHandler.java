package com.retrace.retrace_backend.exception;

import com.retrace.retrace_backend.dto.ErrorResponse;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(
            MethodArgumentNotValidException ex) {

        Map<String, String> errors = new LinkedHashMap<>();

        ex.getBindingResult()
                .getFieldErrors()
                .forEach(fieldError ->
                        errors.put(
                                fieldError.getField(),
                                fieldError.getDefaultMessage()
                        )
                );

        ErrorResponse body = ErrorResponse.builder()
                .status(HttpStatus.BAD_REQUEST.value())
                .message("Validation failed")
                .errors(errors)
                .build();

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(body);
    }

    @ExceptionHandler(ItemNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleItemNotFound(
            ItemNotFoundException ex) {

        return notFound(ex.getMessage());
    }

    @ExceptionHandler(ClaimNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleClaimNotFound(
            ClaimNotFoundException ex) {

        return notFound(ex.getMessage());
    }

    @ExceptionHandler(InvalidClaimStatusException.class)
    public ResponseEntity<ErrorResponse> handleInvalidClaimStatus(
            InvalidClaimStatusException ex) {

        return badRequest(ex.getMessage());
    }

    @ExceptionHandler(InvalidItemOperationException.class)
    public ResponseEntity<ErrorResponse> handleInvalidItemOperation(
            InvalidItemOperationException ex) {

        return badRequest(ex.getMessage());
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ErrorResponse> handleTypeMismatch(
            MethodArgumentTypeMismatchException ex) {

        String expected = ex.getRequiredType() != null
                ? ex.getRequiredType().getSimpleName()
                : "the expected type";

        return badRequest(
                "Invalid value '" + ex.getValue()
                        + "' for parameter '" + ex.getName()
                        + "'. Expected " + expected + "."
        );
    }

    @ExceptionHandler(DataAccessException.class)
    public ResponseEntity<ErrorResponse> handleDataAccess(
            DataAccessException ex) {

        ErrorResponse body = ErrorResponse.builder()
                .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .message("A database error occurred. Please try again later.")
                .build();

        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(body);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleUnexpected(Exception ex) {

        // Temporary: print the real exception in the backend terminal
        // so we can find the actual cause of the 500 error.
        ex.printStackTrace();

        ErrorResponse body = ErrorResponse.builder()
                .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .message("An unexpected error occurred.")
                .build();

        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(body);
    }

    private ResponseEntity<ErrorResponse> notFound(String message) {

        ErrorResponse body = ErrorResponse.builder()
                .status(HttpStatus.NOT_FOUND.value())
                .message(message)
                .build();

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(body);
    }

    private ResponseEntity<ErrorResponse> badRequest(String message) {

        ErrorResponse body = ErrorResponse.builder()
                .status(HttpStatus.BAD_REQUEST.value())
                .message(message)
                .build();

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(body);
    }
}