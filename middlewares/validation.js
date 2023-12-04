import { userSchema } from "../schemas/index.js";
import { validateBody } from "../decorators/index.js";

const userSignUpValidate = validateBody(userSchema.signUpSchema);

export default {
  userSignUpValidate,
};
