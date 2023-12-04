import { userSchema } from "../schemas/index.js";
import { validateBody } from "../decorators/index.js";

const userSignUpValidate = validateBody(userSchema.signUpSchema);
const userSignInValidate = validateBody(userSchema.signInSchema);

export default {
  userSignUpValidate,
  userSignInValidate,
};
