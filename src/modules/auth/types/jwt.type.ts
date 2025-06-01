import { JwtPayload } from "jsonwebtoken";

export type JwtPayloadType = JwtPayload & {
  id: string;
  name?: string;
  email?: string;
  username?: string;
};
