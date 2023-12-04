import { HttpError } from "./index.js";

const generateAvatar = async (username) => {
  const res = await fetch(`https://ui-avatars.com/api/?name=${username[0]}`);

  if (!res.ok) throw HttpError(res.status);

  return `https://ui-avatars.com/api/?name=${username[0]}&size=256`;
};

export default generateAvatar;
