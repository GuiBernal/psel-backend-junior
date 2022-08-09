import { faker } from "@faker-js/faker";

import type { AccountBase } from "../../src/types/account";

export function mockAccountCreation(account: Partial<AccountBase> = {}): AccountBase {
  return {
    branch: faker.phone.number("###"),
    account: faker.phone.number("#######-#"),
    ...account,
  };
}
