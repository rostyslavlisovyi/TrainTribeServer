export class PaginatedResponse<T = unknown> {
  data: T[];
  totalItems: number;
  totalPages: number;
  pageSize: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;

  constructor(params: {
    data: T[];
    totalItems: number;
    pageSize: number;
    currentPage: number;
  }) {
    const { data, totalItems, pageSize, currentPage } = params;

    this.data = data;
    this.totalItems = totalItems;
    this.pageSize = pageSize;
    this.currentPage = currentPage;

    this.totalPages = totalItems > 0 ? Math.ceil(totalItems / pageSize) : 1;
    this.hasNextPage = currentPage < this.totalPages;
    this.hasPreviousPage = currentPage > 1;
  }

  toJSON() {
    return {
      data: this.data,
      totalItems: this.totalItems,
      totalPages: this.totalPages,
      pageSize: this.pageSize,
      currentPage: this.currentPage,
      hasNextPage: this.hasNextPage,
      hasPreviousPage: this.hasPreviousPage
    };
  }
}
