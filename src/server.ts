import { serverHttp } from "./http";
import "./websocket";

serverHttp.listen(3000, () => console.log("Pai ta on na 3000"));