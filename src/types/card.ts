export interface CardBase {
  type: "virtual" | "physical";
  number: string;
  cvv: string;
}

export interface Pagination {
  page: number;
  pageSize: number;
}
