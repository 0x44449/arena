import { customAlphabet } from 'nanoid';

/**
 * ID 생성기
 * - 12자 길이
 * - 숫자(0-9) + 대문자(A-Z) + 소문자(a-z)
 * - URL-safe (하이픈, 언더스코어 없음)
 * - 예시: "aB3dE7fG9hJ2"
 */
export const generateId = customAlphabet(
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  12,
);
