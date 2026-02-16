package com.arena.backend.global.exception;

import com.arena.backend.global.dto.ApiResult;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(WellKnownException.class)
    public ResponseEntity<ApiResult> handleWellKnown(WellKnownException e) {
        log.warn("Business error: {}", e.getErrorCode());
        return ResponseEntity.ok(ApiResult.error(e.getErrorCode()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResult> handleUnexpected(Exception e) {
        log.error("Unexpected error", e);
        return ResponseEntity.internalServerError()
                .body(ApiResult.error("INTERNAL_SERVER_ERROR"));
    }
}
