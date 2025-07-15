import { nanoid } from "nanoid";

class IdGenerator {
  shortId(): string {
    return nanoid(12);
  }
}

export const idgen = new IdGenerator();