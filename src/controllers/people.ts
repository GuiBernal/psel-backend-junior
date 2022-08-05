import type { Request, Response } from "express";
import { db } from "../server";
import { PeopleBase } from "../types/people";
import { peopleSchema } from "../helpers/ validators/people";
import { sanatizePeopleInput } from "../helpers/sanatizer/people";
import * as bcrypt from "bcrypt";
import { DBPeople } from "../db";
import { v4 } from "uuid";

export async function createPeople(req: Request, res: Response) {
  const body: PeopleBase = req.body;
  const { error } = peopleSchema.validate(body.document);

  if (error) {
    return res.status(400).send(error.message);
  }

  const { name, document } = sanatizePeopleInput(body);

  const peopleExists = await db("peoples").where("document", document).first();

  if (peopleExists) {
    return res.status(409).send("Documento já cadastrado");
  }

  const hashPassword = await bcrypt.hash(body.password, 10);

  const { id: peopleId } = (
    await db("peoples")
      .insert({
        id: v4(),
        name,
        document,
        password: hashPassword,
      })
      .returning("id")
  )[0];

  const people: DBPeople = (await db("peoples").where("id", peopleId))[0];

  return res.status(200).json({
    id: peopleId,
    name: people.name,
    document: people.document,
    createdAt: people.createdAt,
    updatedAt: people.updatedAt,
  });
}
