export interface TransactionBase {
  value: number;
  description: string;
  cvv: string;
  type: "credit" | "debit";
}
