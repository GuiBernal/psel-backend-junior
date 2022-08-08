import { cpf as doc } from "cpf-cnpj-validator";
import Joi from "joi";

export const peopleSchema = Joi.string()
  .custom((document, helper) => {
    if (!doc.isValid(document)) {
      return helper.message({ custom: "CPF Inválido" });
    }
  })
  .required();
