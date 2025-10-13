import { SetMetadata } from '@nestjs/common';

export const ALLOW_PUBLIC_KEY = 'ALLOW_PUBLIC';
export const AllowPublic = () => SetMetadata(ALLOW_PUBLIC_KEY, true);