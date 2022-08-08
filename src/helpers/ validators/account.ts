import Joi from "joi";

export const account = Joi.string()
  .min(9)
  .max(10)
  .regex(/^\d+-\d$/)
  .message("Conta Inválida")
  .required();
export const branch = Joi.string().min(3).max(4).regex(/^\d+$/).message("Agência Inválida").required();

export const accountSchema = Joi.object({
  account,
  branch,
});
