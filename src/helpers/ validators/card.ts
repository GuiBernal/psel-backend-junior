import Joi from "joi";

export const number = Joi.string()
  .min(19)
  .max(19)
  .custom((number, helper) => {
    if (!/^\d+$/.test(number.replace(/\s/g, ""))) {
      return helper.message({ custom: "Número Inválido" });
    }
  })
  .required();
export const cvv = Joi.string().min(3).max(3).regex(/^\d+$/).required();
export const type = Joi.string().valid("virtual", "physical").required();

export const cardSchema = Joi.object({
  number,
  cvv,
  type,
});
