import { ApiPropertyOptional } from "@nestjs/swagger";

export class GetChatMessagesQuery {
  @ApiPropertyOptional() seq?: number;
  @ApiPropertyOptional() limit?: number;
  @ApiPropertyOptional() direction?: 'prev' | 'next';
}