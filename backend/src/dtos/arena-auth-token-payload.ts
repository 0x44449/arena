export class ArenaAuthTokenPayloadDto {
  userId: string;

  constructor(data: { userId: string }) {
    this.userId = data.userId;
  }
}