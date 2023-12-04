import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { nanoid } from "nanoid";

import { ctrlWrapper } from "../decorators/index.js";
import { HttpError, generateAvatar, sendEmail } from "../helpers/index.js";

import { User } from "../models/index.js";

const { JWT_SECRET, CLIENT_URL } = process.env;

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

const verifyEmail = async (req, res) => {
  const { verificationCode } = req.params;

  const user = await User.findOne({ verificationCode });
  const { _id: id } = user;

  await User.findByIdAndUpdate(id, {
    verify: true,
    verificationCode: null,
  });

  res.redirect(302, CLIENT_URL);
};

export default {
  signUp: ctrlWrapper(signUp),
  signIn: ctrlWrapper(signIn),
  verifyEmail: ctrlWrapper(verifyEmail),
};
