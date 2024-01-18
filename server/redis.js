import { createClient } from "redis";

const client = await createClient(process.env.REDIS_DB_URL)
  .on("error", (err) => console.error("Redis client error:", err))
  .connect();

export default client;
