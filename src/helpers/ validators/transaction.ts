import Joi from "joi";

export const value = Joi.number()
  .custom((value, helper) => {
    if (value === 0) {
      return helper.message({ custom: "Transação Precisa de Valor Válido" });
    }
  })
  .required();
export const cvv = Joi.string().min(3).max(3).regex(/^\d+$/).required();
export const description = Joi.string().required();

export const transactionSchema = Joi.object({
  value,
  cvv,
  description,
});
