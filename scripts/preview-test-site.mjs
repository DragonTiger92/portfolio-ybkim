import { preview } from "astro";

const server = await preview({
  server: { host: "127.0.0.1", port: 4321 },
  vite: { preview: { strictPort: true } },
});

async function stopServer() {
  await server.stop();
}

process.once("SIGINT", stopServer);
process.once("SIGTERM", stopServer);
