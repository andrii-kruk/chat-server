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

const signIn = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) throw HttpError(409, "Email or password invalid");
  if (!user.verify) throw HttpError(409, "Your email is not verified");

  const passwordCompare = bcrypt.compare(password, user.password);
  if (!passwordCompare) throw HttpError(409, "Email or password invalid");

  const token = jwt.sign({ username: user.username, email: user.email }, JWT_SECRET, { expiresIn: "23h" });
  user.token = token;
  user.save();

  res.status(200).json({token});
};

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
