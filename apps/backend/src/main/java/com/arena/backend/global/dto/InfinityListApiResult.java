package com.arena.backend.global.dto;

import java.util.List;
import lombok.Getter;

@Getter
public class InfinityListApiResult<T> extends ApiResult {

    private final List<T> data;
    private final boolean hasNext;
    private final boolean hasPrev;

    private InfinityListApiResult(List<T> data, boolean hasNext, boolean hasPrev) {
        super(true, null);
        this.data = data;
        this.hasNext = hasNext;
        this.hasPrev = hasPrev;
    }

    public static <T> InfinityListApiResult<T> of(List<T> data, boolean hasNext, boolean hasPrev) {
        return new InfinityListApiResult<>(data, hasNext, hasPrev);
    }
}
