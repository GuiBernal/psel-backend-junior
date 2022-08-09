import supertest from "supertest";
import app from "../src/app";
import { mockPeopleCreation } from "./mock/people";
describe("People", () => {
  const request = supertest(app);

  describe("Create People", () => {
    it("should create people", async () => {
      const response = await request.post("/people").send(mockPeopleCreation());

      expect(response.status).toBe(201);
      expect(response.body).toBeTruthy();
    });

    it("should return error when document is invalid", async () => {
      const response = await request.post("/people").send(mockPeopleCreation({ document: "invalid" }));

      expect(response.status).toBe(400);
      expect(response.text).toStrictEqual("CPF Inválido");
    });

    it("should return error when document is already in use", async () => {
      const peopleMock = mockPeopleCreation();

      await request.post("/people").send(peopleMock);
      const response = await request.post("/people").send(mockPeopleCreation({ document: peopleMock.document }));

      expect(response.status).toBe(409);
      expect(response.text).toStrictEqual("Documento já cadastrado");
    });
  });
});
