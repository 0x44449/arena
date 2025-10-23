import { Socket } from "socket.io";
import ArenaWsCredential from "./arena-ws-credential";

export interface ArenaWsSocket extends Socket {
  data: {
    credential: ArenaWsCredential;
  };
}