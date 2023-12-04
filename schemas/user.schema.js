import Joi from "joi";

const signUpSchema = Joi.object({
  username: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().required().min(6),
});

export default {
  signUpSchema,
};
