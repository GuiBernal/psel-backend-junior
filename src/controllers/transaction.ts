import type { Request, Response } from "express";
import { db } from "../infra/database/db";
import { transactionSchema } from "../helpers/ validators/transaction";
import { DBAccount, DBCard, DBTransaction } from "../db";
import { v4 } from "uuid";
import { TransactionBase } from "../types/transaction";
import { Pagination } from "../types/card";

export async function createTransaction(req: Request, res: Response) {
  const { value, description, cvv } = req.body as TransactionBase;
  const accountId = req.params.accountId;

  const { error } = transactionSchema.validate(req.body);

  if (error) {
    return res.status(400).send(error.message);
  }

  const account: DBAccount = await db("accounts").where("id", accountId).first();

  if (!account) {
    return res.status(404).send("Conta Não Encontrada");
  }

  const balance = Number(account.balance);

  if (balance + value < 0) {
    return res.status(400).send("Saldo Insuficiente");
  }

  const card: DBCard = await db("cards").where("cvv", cvv).andWhere("accountId", accountId).first();

  if (!card) {
    return res.status(404).send("Cartão Não Encontrado");
  }

  const type = value > 0 ? "credit" : "debit";

  const { id: transactionId }: { id: string } = (
    await db("transactions")
      .insert({
        id: v4(),
        value,
        description,
        type: value > 0 ? "credit" : "debit",
        cardId: card.id,
      })
      .returning("id")
  )[0];

  await db("accounts")
    .update("balance", balance + value)
    .where("id", accountId);

  const findTransaction: DBTransaction = await db("transactions").where("id", transactionId).first();

  return res.status(201).json({
    id: findTransaction.id,
    value: value,
    description,
    cvv,
    createdAt: findTransaction.createdAt,
    updatedAt: findTransaction.updatedAt,
  });
}

export async function getTransactions(req: Request, res: Response) {
  const accountId = req.params.accountId;
  const { currentPage, itemsPerPage } = req.query as unknown as Pagination;

  const account: DBAccount = await db("accounts").where("id", accountId).first();

  if (!account) {
    return res.status(404).send("Conta Não Encontrada");
  }

  const findCards: string[] = (await db("cards").where("accountId", accountId)).map(card => {
    return card.id;
  });

  const findTransactions: DBTransaction[] = (
    await db("transactions")
      .whereIn("cardId", findCards)
      .select(["id", "value", "description", "createdAt", "updatedAt"])
      .orderBy("createdAt", "asc")
      .offset(currentPage ? (currentPage - 1) * itemsPerPage : 0)
      .limit(itemsPerPage ?? 100)
  ).map(trans => {
    trans.value = Number(trans.value);

    return trans;
  });

  res.status(200).json({
    transactions: findTransactions,
    pagination: {
      itemsPerPage: itemsPerPage,
      currentPage: currentPage,
    },
  });
}

export async function revertTransaction(req: Request, res: Response) {
  const accountId = req.params.accountId;
  const transactionId = req.params.transactionId;

  const account: DBAccount = await db("accounts").where("id", accountId).first();

  if (!account) {
    return res.status(404).send("Conta Não Encontrada");
  }

  const transaction: DBTransaction = await db("transactions").where("id", transactionId).first();

  if (!transaction) {
    return res.status(404).send("Transação Não Encontrada");
  }

  if (transaction.isReverted) {
    return res.status(409).send("Transação já Revertida");
  }

  const balance = Number(account.balance);

  if (transaction.value > 0 && transaction.value > balance) {
    return res.status(400).send("Saldo Insuficiente Para Reversão");
  }

  const { id: revertId }: { id: string } = (
    await db("transactions")
      .insert({
        id: v4(),
        value: -transaction.value,
        description: "Estorno de cobrança indevida.",
        cardId: transaction.cardId,
        type: transaction.type === "credit" ? "debit" : "credit",
      })
      .returning("id")
  )[0];

  await db("accounts")
    .update("balance", balance - transaction.value)
    .where("id", accountId);

  await db("transactions").update("isReverted", true).where("id", transactionId);

  const findTransaction: DBTransaction = await db("transactions").where("id", revertId).first();

  return res.status(201).json({
    id: findTransaction.id,
    value: findTransaction.value,
    description: findTransaction.description,
    createdAt: findTransaction.createdAt,
    updatedAt: findTransaction.updatedAt,
  });
}
