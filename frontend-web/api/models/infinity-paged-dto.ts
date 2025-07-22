export type InfinityPagedDto<T> = {
    items: Array<T>;
    hasNext: boolean;
    hasPrev: boolean;
};
