/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FileDto } from './FileDto';
import type { UserDto } from './UserDto';
export type ChatMessageDto = {
    sender: UserDto;
    attachments: Array<FileDto>;
    messageId: string;
    seq: number;
    channelId: string;
    message: string;
    createdAt: string;
    updatedAt: string;
};

