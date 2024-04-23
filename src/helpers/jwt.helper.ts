import jwt from "jsonwebtoken";
const Secret = "UMA SENHA AGORA HAHAHAHAHA";
export const ConvertJWT = (obj: Object) => {
  return jwt.sign(obj, Secret);
};


export const VerifyJWT = (token: string) => {
  return jwt.verify(token, Secret);
};
