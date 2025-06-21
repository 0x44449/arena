class TokenManager {
  static getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  static setAccessToken(token: string): void {
    localStorage.setItem('accessToken', token);
  }

  static removeAccessToken(): void {
    localStorage.removeItem('accessToken');
  }

  static getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  static setRefreshToken(token: string): void {
    localStorage.setItem('refreshToken', token);
  }

  static removeRefreshToken(): void {
    localStorage.removeItem('refreshToken');
  }
}

export default TokenManager;