package com.arena.backend.global.dto;

import lombok.Getter;

@Getter
public class SingleApiResult<T> extends ApiResult {

    private final T data;

    private SingleApiResult(T data) {
        super(true, null);
        this.data = data;
    }

    public static <T> SingleApiResult<T> of(T data) {
        return new SingleApiResult<>(data);
    }
}
