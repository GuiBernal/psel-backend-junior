import { faker } from "@faker-js/faker";

import type { CardBase } from "../../src/types/card";

export function mockCardCreation(card: Partial<CardBase> = {}): CardBase {
  return {
    number: faker.finance.creditCardNumber("#### #### #### ####"),
    cvv: faker.finance.creditCardCVV(),
    type: "virtual",
    ...card,
  };
}
