import { faker } from "@faker-js/faker";
import { cpf } from "cpf-cnpj-validator";

import type { PeopleBase } from "../../src/types/people";

export function mockPeopleCreation(people: Partial<PeopleBase> = {}): PeopleBase {
  return {
    name: `${faker.name.findName()} ${faker.name.lastName()}`,
    document: cpf.generate(),
    password: faker.internet.password(),
    ...people,
  };
}
