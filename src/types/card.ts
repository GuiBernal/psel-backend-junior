export interface CardBase {
  type: "virtual" | "physical";
  number: string;
  cvv: string;
}

export interface Pagination {
  currentPage: number;
  itemsPerPage: number;
}
