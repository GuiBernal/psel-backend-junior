import supertest from "supertest";
import { v4 } from "uuid";
import app from "../src/app";
import { mockAccountCreation } from "./mock/account";
import { mockCardCreation } from "./mock/card";
import { mockPeopleCreation } from "./mock/people";

describe("Card", () => {
  const request = supertest(app);

  describe("Create Card", () => {
    it("should create card", async () => {
      const { body: people } = await request.post("/people").send(mockPeopleCreation());
      const { body: account } = await request.post(`/people/${people.id}/accounts`).send(mockAccountCreation());
      const response = await request.post(`/accounts/${account.id}/cards`).send(mockCardCreation());

      expect(response.status).toBe(201);
      expect(response.body).toBeTruthy();
    });

    it("should return error when number is invalid", async () => {
      const { body: people } = await request.post("/people").send(mockPeopleCreation());
      const { body: account } = await request.post(`/people/${people.id}/accounts`).send(mockAccountCreation());
      const response = await request
        .post(`/accounts/${account.id}/cards`)
        .send(mockCardCreation({ number: "a179 b447 c594 d978" }));

      expect(response.status).toBe(400);
      expect(response.text).toStrictEqual("Número Inválido");
    });

    it("should return error when cvv is invalid", async () => {
      const { body: people } = await request.post("/people").send(mockPeopleCreation());
      const { body: account } = await request.post(`/people/${people.id}/accounts`).send(mockAccountCreation());
      const response = await request.post(`/accounts/${account.id}/cards`).send(mockCardCreation({ cvv: "1a2" }));

      expect(response.status).toBe(400);
    });

    it("should return error when type is invalid", async () => {
      const { body: people } = await request.post("/people").send(mockPeopleCreation());
      const { body: account } = await request.post(`/people/${people.id}/accounts`).send(mockAccountCreation());
      const response = await request.post(`/accounts/${account.id}/cards`).send(mockCardCreation({ type: undefined }));

      expect(response.status).toBe(400);
    });

    it("should return error when account is not found", async () => {
      const response = await request.post(`/accounts/${v4()}/cards`).send(mockCardCreation());

      expect(response.status).toBe(404);
      expect(response.text).toStrictEqual("Conta Não Encontrada");
    });

    it("should return error when physical card already exists", async () => {
      const { body: people } = await request.post("/people").send(mockPeopleCreation());
      const { body: account } = await request.post(`/people/${people.id}/accounts`).send(mockAccountCreation());
      await request.post(`/accounts/${account.id}/cards`).send(mockCardCreation({ type: "physical" }));
      const response = await request.post(`/accounts/${account.id}/cards`).send(mockCardCreation({ type: "physical" }));

      expect(response.status).toBe(409);
      expect(response.text).toStrictEqual("Já Existe um Cartão Físico Cadastrado");
    });
  });

  describe("Get Cards By Account", () => {
    it("should create card", async () => {
      const { body: people } = await request.post("/people").send(mockPeopleCreation());
      const { body: account } = await request.post(`/people/${people.id}/accounts`).send(mockAccountCreation());
      await request.post(`/accounts/${account.id}/cards`).send(mockCardCreation());

      const response = await request.get(`/accounts/${account.id}/cards`);

      expect(response.status).toBe(200);
      expect(response.body.cards).toBeTruthy();
    });

    it("should return error when account is not found", async () => {
      const response = await request.get(`/accounts/${v4()}/cards`);

      expect(response.status).toBe(404);
      expect(response.text).toStrictEqual("Conta Não Encontrada");
    });
  });

  describe("Get Cards By People", () => {
    it("should create card", async () => {
      const { body: people } = await request.post("/people").send(mockPeopleCreation());
      const { body: account } = await request.post(`/people/${people.id}/accounts`).send(mockAccountCreation());
      await request.post(`/accounts/${account.id}/cards`).send(mockCardCreation());

      const response = await request.get(`/people/${people.id}/cards?currentPage=1&itemsPerPage=5`);

      expect(response.status).toBe(200);
      expect(response.body.cards).toBeTruthy();
    });

    it("should create card without pagination", async () => {
      const { body: people } = await request.post("/people").send(mockPeopleCreation());
      const { body: account } = await request.post(`/people/${people.id}/accounts`).send(mockAccountCreation());
      await request.post(`/accounts/${account.id}/cards`).send(mockCardCreation());

      const response = await request.get(`/people/${people.id}/cards`);

      expect(response.status).toBe(200);
      expect(response.body.cards).toBeTruthy();
    });

    it("should return error when people is not found", async () => {
      const response = await request.get(`/people/${v4()}/cards`);

      expect(response.status).toBe(404);
      expect(response.text).toStrictEqual("Pessoa Não Encontrada");
    });
  });
});
