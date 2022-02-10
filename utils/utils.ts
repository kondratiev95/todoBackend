import jwt from "jsonwebtoken";

export const getUserId = (accessToken) => {
  const decodedToken: any = jwt.decode(accessToken);
  return decodedToken.id;
};
