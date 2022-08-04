import supertest from "supertest";

import app from "../src/app";

describe("Auth", () => {
  const request = supertest(app);

  it("root rote should return 200", async () => {
    const response = await request.get("/");

    expect(response.status).toBe(200);
    expect(response.body).toBeTruthy();
  });
});
