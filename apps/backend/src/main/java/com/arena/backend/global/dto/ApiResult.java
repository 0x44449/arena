package com.arena.backend.global.dto;

import lombok.Getter;

@Getter
public class ApiResult {

    private final boolean success;
    private final String errorCode;

    protected ApiResult(boolean success, String errorCode) {
        this.success = success;
        this.errorCode = errorCode;
    }

    public static ApiResult success() {
        return new ApiResult(true, null);
    }

    public static ApiResult error(String errorCode) {
        return new ApiResult(false, errorCode);
    }
}
