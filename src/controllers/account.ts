import type { Request, Response } from "express";
import { v4 } from "uuid";
import { DBAccount, DBPeople } from "../db";
import { accountSchema } from "../helpers/ validators/account";
import { db } from "../infra/database/db";
import { AccountBase } from "../types/account";

export async function createAccount(req: Request, res: Response) {
  const { account, branch } = req.body as AccountBase;
  const peopleId = req.params.peopleId;

  const { error } = accountSchema.validate(req.body);

  if (error) {
    return res.status(400).send(error.message);
  }

  const people: DBPeople = await db("peoples").where("id", peopleId).first();

  if (!people) {
    return res.status(404).send("Pessoa Não Encontrada");
  }

  const { id: accountId } = (
    await db("accounts")
      .insert({
        id: v4(),
        account,
        branch,
        peopleId,
      })
      .returning("id")
  )[0];

  const findAccount: DBAccount = await db("accounts").where("id", accountId).first();

  return res.status(201).json({
    id: accountId,
    account: findAccount.account,
    branch: findAccount.branch,
    createdAt: findAccount.createdAt,
    updatedAt: findAccount.updatedAt,
  });
}

export async function getAccounts(req: Request, res: Response) {
  const peopleId = req.params.peopleId;

  const people: DBPeople = (await db("peoples").where("id", peopleId))[0];

  if (!people) {
    return res.status(404).send("Pessoa Não Encontrada");
  }

  const findAccounts: DBAccount[] = await db("accounts").select(["id", "branch", "account", "createdAt", "updatedAt"]);

  res.status(200).json(findAccounts);
}

export async function getBalance(req: Request, res: Response) {
  const accountId = req.params.accountId;

  const account: DBAccount = await db("accounts").where("id", accountId).first();

  if (!account) {
    return res.status(404).send("Conta Não Encontrada");
  }

  res.status(200).json({
    balance: Number(account.balance),
  });
}
