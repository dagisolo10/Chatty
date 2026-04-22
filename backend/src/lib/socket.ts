import type { Server } from "http";
import { WebSocketServer, WebSocket } from "ws";

export default function initializeSocket(server: Server) {
    const wss = new WebSocketServer({ server });

    console.log("🚀 Web Socket connecting...");

    wss.on("connection", (socket, request) => {
        console.log("✅ WS Connected");

        const ip = request.socket.remoteAddress;
        console.log(ip, ": Connected to the webSocket");

        socket.on("message", (rawData) => {
            try {
                // const data = JSON.parse(rawData.toString());
                // const payload = JSON.stringify(data);
                const payload = rawData.toString();

                console.log("Received:", payload);

                for (const client of wss.clients) {
                    if (client.readyState === WebSocket.OPEN) client.send(payload);
                }
            } catch (e) {
                console.error("Failed to parse message", e);
            }
        });
        socket.on("close", () => console.log(ip, ": Disconnected"));
        socket.on("error", (err) => console.error(`❌ Error: ${err.message}: ${ip}`));
    });
}
