import WebSocket from "ws";

export const JWT_SECRET_TOKEN = "fusdgjkfdshjbvfsdhjfvsdhjv1213vhjvdshjfvsjh";

export function processMessage(payload: string) {
  try {
    return JSON.parse(payload);
  } catch (error) {
    return null;
  }
}

export interface CustomWebSocket extends WebSocket {
  connectionID: string;
}
