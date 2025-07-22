import { Type } from '@nestjs/common';
import { InfinityPagedDto } from '@/dtos/infinity-paged.dto';
import { DataSchemaFactory } from '@/decorators/api-ok-result-with.decorator';
import { PagedDto } from './paged.dto';

const attachModels = <F extends DataSchemaFactory>(fn: F, models: Type<any>[]) => {
  fn.models = models;
  return fn;
};

// 단일 객체
export const singleOf = <T>(dto: Type<T>) =>
  attachModels<DataSchemaFactory>(
    (ref) => ref(dto),
    [dto],
  );

// 배열
export const arrayOf = <T>(dto: Type<T>) =>
  attachModels<DataSchemaFactory>(
    (ref) => ({
      type: 'array',
      items: ref(dto),
    }),
    [dto],
  );

// InfinityPaged<T>
export const infinityPagedOf = <T>(itemDto: Type<T>) =>
  attachModels<DataSchemaFactory>(
    (ref) => ({
      allOf: [
        ref(InfinityPagedDto),
        {
          properties: {
            items: {
              type: 'array',
              items: ref(itemDto),
            },
          },
        },
      ],
    }),
    [InfinityPagedDto, itemDto],
  );

// Paged<T>
export const pagedOf = <T>(itemDto: Type<T>) =>
  attachModels<DataSchemaFactory>(
    (ref) => ({
      allOf: [
        ref(PagedDto),
        {
          properties: {
            items: {
              type: 'array',
              items: ref(itemDto),
            },
          },
        },
      ],
    }),
    [PagedDto, itemDto],
  );