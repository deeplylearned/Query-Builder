export interface IQuery {
    _id: string;
    queryName: string;
    index: string;
    filters: any[];
    aggFilters: any[];
    outputCols: any[];
}