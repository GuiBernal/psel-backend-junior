import supertest from "supertest";
import { v4 } from "uuid";
import app from "../src/app";
import { mockAccountCreation } from "./mock/account";
import { mockPeopleCreation } from "./mock/people";

describe("Account", () => {
  const request = supertest(app);

  describe("Create Account", () => {
    it("should create account", async () => {
      const { body: people } = await request.post("/people").send(mockPeopleCreation());
      const response = await request.post(`/people/${people.id}/accounts`).send(mockAccountCreation());

      expect(response.status).toBe(201);
      expect(response.body).toBeTruthy();
    });

    it("should return error when account is invalid", async () => {
      const { body: people } = await request.post("/people").send(mockPeopleCreation());
      const response = await request
        .post(`/people/${people.id}/accounts`)
        .send(mockAccountCreation({ account: "123456a-b" }));

      expect(response.status).toBe(400);
      expect(response.text).toStrictEqual("Conta Inválida");
    });

    it("should return error when branch is invalid", async () => {
      const { body: people } = await request.post("/people").send(mockPeopleCreation());
      const response = await request.post(`/people/${people.id}/accounts`).send(mockAccountCreation({ branch: "12c" }));

      expect(response.status).toBe(400);
      expect(response.text).toStrictEqual("Agência Inválida");
    });

    it("should return error when people is not found", async () => {
      const response = await request.post(`/people/${v4()}/accounts`).send(mockAccountCreation());

      expect(response.status).toBe(404);
      expect(response.text).toStrictEqual("Pessoa Não Encontrada");
    });
  });

  describe("Get Accounts", () => {
    it("should get accounts", async () => {
      const { body: people } = await request.post("/people").send(mockPeopleCreation());
      await request.post(`/people/${people.id}/accounts`).send(mockAccountCreation());

      const response = await request.get(`/people/${people.id}/accounts`);

      expect(response.status).toBe(200);
      expect(response.body).toBeTruthy();
    });

    it("should return error when people is not found", async () => {
      const response = await request.get(`/people/${v4()}/accounts`);

      expect(response.status).toBe(404);
      expect(response.text).toStrictEqual("Pessoa Não Encontrada");
    });
  });

  describe("Get Account Balance", () => {
    it("should get account balance", async () => {
      const { body: people } = await request.post("/people").send(mockPeopleCreation());
      const { body: account } = await request.post(`/people/${people.id}/accounts`).send(mockAccountCreation());

      const response = await request.get(`/accounts/${account.id}/balance`);

      expect(response.status).toBe(200);
      expect(response.body).toBeTruthy();
    });

    it("should return error when people is not found", async () => {
      const response = await request.get(`/accounts/${v4()}/balance`).send(mockAccountCreation());

      expect(response.status).toBe(404);
      expect(response.text).toStrictEqual("Conta Não Encontrada");
    });
  });
});
