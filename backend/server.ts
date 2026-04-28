import "dotenv/config";

import app from "@/lib/app.js";
import { createServer } from "http";
import initializeSocket from "@/lib/socket.js";

const port = process.env.PORT;

const server = createServer(app);

const io = initializeSocket(server);

app.set("io", io);

server.listen(port, () => console.log(`🚀 Server running at http://localhost:${port}`));
