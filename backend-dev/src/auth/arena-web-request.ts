import { Request } from "express";
import ArenaWebCredential from "./arena-web-credential";

export interface ArenaWebRequest extends Request {
  credential?: ArenaWebCredential;
}