import { createClient } from "redis";

const client = await createClient()
  .on("error", (err: any) =>
    console.error("Redis client error:", err, typeof err),
  )
  .connect();

export default client;
