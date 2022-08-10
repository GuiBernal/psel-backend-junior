import supertest from "supertest";
import { v4 } from "uuid";
import app from "../src/app";
import { DBTransaction } from "../src/db";
import { db } from "../src/infra/database/db";
import { mockAccountCreation } from "./mock/account";
import { mockCardCreation } from "./mock/card";
import { mockPeopleCreation } from "./mock/people";
import { mockTransactionCreation } from "./mock/transaction";

describe("Transaction", () => {
  const request = supertest(app);

  describe("Create Transaction", () => {
    it("should create transaction", async () => {
      const { body: people } = await request.post("/people").send(mockPeopleCreation());
      const { body: account } = await request.post(`/people/${people.id}/accounts`).send(mockAccountCreation());
      const { body: card } = await request.post(`/accounts/${account.id}/cards`).send(mockCardCreation());
      const response = await request
        .post(`/accounts/${account.id}/transactions`)
        .send(mockTransactionCreation({ cvv: card.cvv }));

      expect(response.status).toBe(201);
      expect(response.body).toBeTruthy();
    });

    it("should return error when cvv is invalid", async () => {
      const { body: people } = await request.post("/people").send(mockPeopleCreation());
      const { body: account } = await request.post(`/people/${people.id}/accounts`).send(mockAccountCreation());
      const response = await request
        .post(`/accounts/${account.id}/transactions`)
        .send(mockTransactionCreation({ cvv: "1a2" }));

      expect(response.status).toBe(400);
    });

    it("should return error when account is not found", async () => {
      const response = await request
        .post(`/accounts/${v4()}/transactions`)
        .send(mockTransactionCreation({ cvv: "123" }));

      expect(response.status).toBe(404);
      expect(response.text).toStrictEqual("Conta Não Encontrada");
    });

    it("should return error when balance is not enough", async () => {
      const { body: people } = await request.post("/people").send(mockPeopleCreation());
      const { body: account } = await request.post(`/people/${people.id}/accounts`).send(mockAccountCreation());
      const { body: card } = await request.post(`/accounts/${account.id}/cards`).send(mockCardCreation());
      const response = await request
        .post(`/accounts/${account.id}/transactions`)
        .send(mockTransactionCreation({ cvv: card.cvv, value: -100 }));

      expect(response.status).toBe(400);
      expect(response.text).toStrictEqual("Saldo Insuficiente");
    });

    it("should return error when card is not found", async () => {
      const { body: people } = await request.post("/people").send(mockPeopleCreation());
      const { body: account } = await request.post(`/people/${people.id}/accounts`).send(mockAccountCreation());
      const response = await request
        .post(`/accounts/${account.id}/transactions`)
        .send(mockTransactionCreation({ cvv: "123" }));

      expect(response.status).toBe(404);
      expect(response.text).toStrictEqual("Cartão Não Encontrado");
    });
  });

  describe("Get Transaction", () => {
    it("should get transactions", async () => {
      const { body: people } = await request.post("/people").send(mockPeopleCreation());
      const { body: account } = await request.post(`/people/${people.id}/accounts`).send(mockAccountCreation());
      const { body: card } = await request.post(`/accounts/${account.id}/cards`).send(mockCardCreation());
      await request.post(`/accounts/${account.id}/transactions`).send(mockTransactionCreation({ cvv: card.cvv }));
      const response = await request.get(`/accounts/${account.id}/transactions?currentPage=1&itemsPerPage=5`);

      expect(response.status).toBe(200);
      expect(response.body.transactions).toBeTruthy();
    });

    it("should get transactions without pagination", async () => {
      const { body: people } = await request.post("/people").send(mockPeopleCreation());
      const { body: account } = await request.post(`/people/${people.id}/accounts`).send(mockAccountCreation());
      const { body: card } = await request.post(`/accounts/${account.id}/cards`).send(mockCardCreation());
      await request.post(`/accounts/${account.id}/transactions`).send(mockTransactionCreation({ cvv: card.cvv }));
      const response = await request.get(`/accounts/${account.id}/transactions`);

      expect(response.status).toBe(200);
      expect(response.body.transactions).toBeTruthy();
    });

    it("should return error when account is not found", async () => {
      const response = await request.get(`/accounts/${v4()}/transactions`);

      expect(response.status).toBe(404);
      expect(response.text).toStrictEqual("Conta Não Encontrada");
    });
  });

  describe("Revert Transaction", () => {
    it("should revert positive transaction", async () => {
      const { body: people } = await request.post("/people").send(mockPeopleCreation());
      const { body: account } = await request.post(`/people/${people.id}/accounts`).send(mockAccountCreation());
      const { body: card } = await request.post(`/accounts/${account.id}/cards`).send(mockCardCreation());
      const { body: transaction } = await request
        .post(`/accounts/${account.id}/transactions`)
        .send(mockTransactionCreation({ cvv: card.cvv }));
      const response = await request.post(`/accounts/${account.id}/transactions/${transaction.id}/revert`);

      const revert: DBTransaction = await db("transactions").where("id", response.body.id).first();

      expect(response.status).toBe(201);
      expect(response.body).toBeTruthy();
      expect(revert.type).toStrictEqual("debit");
    });

    it("should revert negative transaction", async () => {
      const { body: people } = await request.post("/people").send(mockPeopleCreation());
      const { body: account } = await request.post(`/people/${people.id}/accounts`).send(mockAccountCreation());
      const { body: card } = await request.post(`/accounts/${account.id}/cards`).send(mockCardCreation());
      await request
        .post(`/accounts/${account.id}/transactions`)
        .send(mockTransactionCreation({ cvv: card.cvv, value: 100 }));
      const { body: transaction } = await request
        .post(`/accounts/${account.id}/transactions`)
        .send(mockTransactionCreation({ cvv: card.cvv, value: -20 }));
      const response = await request.post(`/accounts/${account.id}/transactions/${transaction.id}/revert`);

      const revert: DBTransaction = await db("transactions").where("id", response.body.id).first();

      expect(response.status).toBe(201);
      expect(response.body).toBeTruthy();
      expect(revert.type).toStrictEqual("credit");
    });

    it("should return error when account is not found", async () => {
      const { body: people } = await request.post("/people").send(mockPeopleCreation());
      const { body: account } = await request.post(`/people/${people.id}/accounts`).send(mockAccountCreation());
      const { body: card } = await request.post(`/accounts/${account.id}/cards`).send(mockCardCreation());
      const { body: transaction } = await request
        .post(`/accounts/${account.id}/transactions`)
        .send(mockTransactionCreation({ cvv: card.cvv }));
      const response = await request.post(`/accounts/${v4()}/transactions/${transaction.id}/revert`);

      expect(response.status).toBe(404);
      expect(response.text).toStrictEqual("Conta Não Encontrada");
    });

    it("should return error when transaction is not found", async () => {
      const { body: people } = await request.post("/people").send(mockPeopleCreation());
      const { body: account } = await request.post(`/people/${people.id}/accounts`).send(mockAccountCreation());
      const response = await request.post(`/accounts/${account.id}/transactions/${v4()}/revert`);

      expect(response.status).toBe(404);
      expect(response.text).toStrictEqual("Transação Não Encontrada");
    });

    it("should return error when transaction is already reverted", async () => {
      const { body: people } = await request.post("/people").send(mockPeopleCreation());
      const { body: account } = await request.post(`/people/${people.id}/accounts`).send(mockAccountCreation());
      const { body: card } = await request.post(`/accounts/${account.id}/cards`).send(mockCardCreation());
      const { body: transaction } = await request
        .post(`/accounts/${account.id}/transactions`)
        .send(mockTransactionCreation({ cvv: card.cvv }));
      await request.post(`/accounts/${account.id}/transactions/${transaction.id}/revert`);
      const response = await request.post(`/accounts/${account.id}/transactions/${transaction.id}/revert`);

      expect(response.status).toBe(409);
      expect(response.text).toStrictEqual("Transação já Revertida");
    });

    it("should return error when balance is not enough to revert", async () => {
      const { body: people } = await request.post("/people").send(mockPeopleCreation());
      const { body: account } = await request.post(`/people/${people.id}/accounts`).send(mockAccountCreation());
      const { body: card } = await request.post(`/accounts/${account.id}/cards`).send(mockCardCreation());
      const { body: transaction } = await request
        .post(`/accounts/${account.id}/transactions`)
        .send(mockTransactionCreation({ cvv: card.cvv, value: 100 }));
      await request
        .post(`/accounts/${account.id}/transactions`)
        .send(mockTransactionCreation({ cvv: card.cvv, value: -50 }));
      const response = await request.post(`/accounts/${account.id}/transactions/${transaction.id}/revert`);

      expect(response.status).toBe(400);
      expect(response.text).toStrictEqual("Saldo Insuficiente Para Reversão");
    });
  });
});
