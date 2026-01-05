import { ApiProperty } from "@nestjs/swagger";
import { MessageDto } from "src/dtos/message.dto";

export class MessageSyncDataDto {
  @ApiProperty({ description: "새로 생성된 메시지", type: [MessageDto] })
  created: MessageDto[];

  @ApiProperty({ description: "수정된 메시지", type: [MessageDto] })
  updated: MessageDto[];

  @ApiProperty({ description: "삭제된 메시지 ID", type: [String] })
  deleted: string[];

  @ApiProperty({ description: "true면 전체 재조회 필요" })
  requireFullSync: boolean;
}
