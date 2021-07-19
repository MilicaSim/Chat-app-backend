export class PaginationDto<R> {
  
    data: R[];
    pageSize: number = 15;
    page: number = 1;
    totalCount: number;
    totalPages: number;
  }