import type { Request, Response } from "express";
import { db } from "../infra/database/db";
import { PeopleBase } from "../types/people";
import { peopleSchema } from "../helpers/ validators/people";
import { sanatizePeopleInput } from "../helpers/sanatizer/people";
import * as bcrypt from "bcrypt";
import { DBPeople } from "../db";
import { v4 } from "uuid";

export async function createPeople(req: Request, res: Response) {
  const peopleInput: PeopleBase = req.body;
  const { error } = peopleSchema.validate(peopleInput.document);

  if (error) {
    return res.status(400).send(error.message);
  }

  const { name, document } = sanatizePeopleInput(peopleInput);

  const peopleExists = await db("peoples").where("document", document).first();

  if (peopleExists) {
    return res.status(409).send("Documento já cadastrado");
  }

  const hashPassword = await bcrypt.hash(peopleInput.password, 10);

  const { id: peopleId }: { id: string } = (
    await db("peoples")
      .insert({
        id: v4(),
        name,
        document,
        password: hashPassword,
      })
      .returning("id")
  )[0];

  const people: DBPeople = await db("peoples").where("id", peopleId).first();

  return res.status(201).json({
    id: peopleId,
    name: people.name,
    document: people.document,
    createdAt: people.createdAt,
    updatedAt: people.updatedAt,
  });
}
