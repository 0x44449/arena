export class SessionCookieDto {
  cookie: string;

  constructor(data: { cookie: string }) {
    this.cookie = data.cookie;
  }
}