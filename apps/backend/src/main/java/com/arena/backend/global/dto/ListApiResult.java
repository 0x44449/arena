package com.arena.backend.global.dto;

import java.util.List;
import lombok.Getter;

@Getter
public class ListApiResult<T> extends ApiResult {

    private final List<T> data;

    private ListApiResult(List<T> data) {
        super(true, null);
        this.data = data;
    }

    public static <T> ListApiResult<T> of(List<T> data) {
        return new ListApiResult<>(data);
    }
}
