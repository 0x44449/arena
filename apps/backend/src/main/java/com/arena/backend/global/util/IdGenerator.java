package com.arena.backend.global.util;

import java.security.SecureRandom;

public final class IdGenerator {

    private static final String ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    private static final int ID_LENGTH = 12;
    private static final SecureRandom RANDOM = new SecureRandom();

    private IdGenerator() {
    }

    public static String generate() {
        StringBuilder sb = new StringBuilder(ID_LENGTH);
        for (int i = 0; i < ID_LENGTH; i++) {
            sb.append(ALPHABET.charAt(RANDOM.nextInt(ALPHABET.length())));
        }
        return sb.toString();
    }
}
