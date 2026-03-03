export interface PagedResult<T> {
  data: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}
export interface FilterOption {
  label: string;
  value: string;
  type?: "text" | "select";
  options?: { label: string; value: string }[];
}
