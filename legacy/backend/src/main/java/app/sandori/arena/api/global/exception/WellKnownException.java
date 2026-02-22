package app.sandori.arena.api.global.exception;

import lombok.Getter;

@Getter
public class WellKnownException extends RuntimeException {

    private final String errorCode;

    public WellKnownException(String errorCode) {
        super(errorCode);
        this.errorCode = errorCode;
    }

    public WellKnownException(String errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
    }
}
