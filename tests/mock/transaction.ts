import { faker } from "@faker-js/faker";

import type { TransactionBase } from "../../src/types/transaction";

export function mockTransactionCreation(transaction: Partial<TransactionBase> = {}): TransactionBase {
  return {
    value: Number(faker.finance.amount()),
    description: faker.random.words(),
    cvv: faker.finance.creditCardCVV(),
    ...transaction,
  };
}
