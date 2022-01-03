import { serverHttp } from "./http";
import "./websocket";

serverHttp.listen(3001, () => console.log("Pai ta on na 3001"));
