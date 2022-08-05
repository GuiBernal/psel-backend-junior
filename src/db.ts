interface BaseModel {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DBPeople extends BaseModel {
  name: string;
  document: string;
  password: string;
  balance: number;
}

export interface DBAccount extends BaseModel {
  branch: string;
  account: string;
  peopleId: string;
}

export interface DBCard extends BaseModel {
  type: "virtual" | "physical";
  number: string;
  cvv: string;
  accountId: string;
}

export interface DBTransaction extends BaseModel {
  value: number;
  description: string;
  type: "credit" | "debit";
  cardId: string;
}
