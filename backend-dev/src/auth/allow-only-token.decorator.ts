import { SetMetadata } from '@nestjs/common';

export const ALLOW_ONLY_TOKEN_KEY = 'ALLOW_ONLY_TOKEN';
export const AllowOnlyToken = () => SetMetadata(ALLOW_ONLY_TOKEN_KEY, true);