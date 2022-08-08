import type { Request, Response } from "express";
import { v4 } from "uuid";
import { DBAccount, DBCard, DBPeople } from "../db";
import { cardSchema } from "../helpers/ validators/card";
import { sanatizeCardInput } from "../helpers/sanatizer/card";
import { db } from "../server";
import { CardBase, Pagination } from "../types/card";

export async function createCard(req: Request, res: Response) {
  const { type, cvv, number } = req.body as CardBase;
  const accountId = req.params.accountId;

  const { error } = cardSchema.validate(req.body);

  if (error) {
    return res.status(400).send(error.message);
  }

  const account: DBAccount = await db("accounts").where("id", accountId).first();

  if (!account) {
    return res.status(404).send("Conta Não Encontrada");
  }

  if (type === "physical") {
    const findPhysicalCard: DBCard = await db("cards").where("type", "physical").first();

    if (findPhysicalCard) {
      return res.status(409).send("Já Existe um Cartão Físico Cadastrado");
    }
  }

  const sanatizedNumber = sanatizeCardInput(number);

  const { id: cardId } = (
    await db("cards")
      .insert({
        id: v4(),
        type,
        cvv,
        number: sanatizedNumber,
        accountId,
      })
      .returning("id")
  )[0];

  const findCard: DBCard = await db("cards").where("id", cardId).first();

  return res.status(201).json({
    id: accountId,
    type: findCard.type,
    number: findCard.number.slice(0, 4),
    cvv: findCard.cvv,
    createdAt: findCard.createdAt,
    updatedAt: findCard.updatedAt,
  });
}

export async function getCardByAccount(req: Request, res: Response) {
  const accountId = req.params.accountId;

  const account: DBAccount = (
    await db("accounts").where("id", accountId).select(["id", "branch", "account", "createdAt", "updatedAt"])
  )[0];

  if (!account) {
    return res.status(404).send("Conta Não Encontrada");
  }

  const findCards: DBCard[] = (
    await db("cards")
      .where("accountId", accountId)
      .select(["id", "type", "number", "cvv", "createdAt", "updatedAt"])
      .orderBy("createdAt", "asc")
  ).map(card => {
    card.number = card.number.slice(0, 4);

    return card;
  });

  res.status(200).json({
    id: account.id,
    branch: account.branch,
    account: account.account,
    cards: findCards,
    createdAt: account.createdAt,
    updatedAt: account.updatedAt,
  });
}

export async function getCardByPeople(req: Request, res: Response) {
  const peopleId = req.params.peopleId;
  const { page, pageSize } = req.query as unknown as Pagination;

  const people: DBPeople = (await db("peoples").where("id", peopleId))[0];

  if (!people) {
    return res.status(404).send("Pessoa Não Encontrada");
  }

  const findAccounts: string[] = (await db("accounts").where("peopleId", peopleId)).map(account => {
    return account.id;
  });

  const findCards: DBCard[] = (
    await db("cards")
      .whereIn("accountId", findAccounts)
      .select(["id", "type", "number", "cvv", "createdAt", "updatedAt"])
      .orderBy("createdAt", "asc")
      .offset((page - 1) * pageSize)
      .limit(pageSize)
  ).map(card => {
    card.number = card.number.slice(0, 4);

    return card;
  });

  res.status(200).json({
    cards: findCards,
    pagination: {
      itemsPerPage: pageSize,
      currentPage: page,
    },
  });
}
