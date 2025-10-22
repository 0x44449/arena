export class GetChatMessageQueryDto {
  seq?: number;
  limit?: number;
  direction?: 'prev' | 'next';
}