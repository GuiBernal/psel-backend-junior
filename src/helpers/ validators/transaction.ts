import Joi from "joi";

export const value = Joi.number().required();
export const cvv = Joi.string().min(3).max(3).regex(/^\d+$/).required();
export const description = Joi.string().required();

export const transactionSchema = Joi.object({
  value,
  cvv,
  description,
});
