import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { nanoid } from "nanoid";

import { ctrlWrapper } from "../decorators/index.js";
import { HttpError, generateAvatar, sendEmail } from "../helpers/index.js";

import { User } from "../models/index.js";

const { JWT_SECRET } = process.env;

const signUp = async (req, res) => {
  const { username, email, password } = req.body;

  const user = await User.findOne({ email });
  if (user) throw HttpError(409, "Email already in use.");

  const verificationCode = nanoid();
  await sendEmail(email, verificationCode);

  const avatar = await generateAvatar(username);
  const hashPassword = await bcrypt.hash(password, 10);
  const token = jwt.sign({ username, email }, JWT_SECRET, { expiresIn: "23h" });

  await User.create({ ...req.body, password: hashPassword, avatar, verificationCode, token });

  res.json({ username, email, avatar, token });
};

const signIn = async (req, res) => {};

const verifyEmail = (req, res) => {};

export default {
  signUp: ctrlWrapper(signUp),
  signIn: ctrlWrapper(signIn),
  verifyEmail: ctrlWrapper(verifyEmail),
};
