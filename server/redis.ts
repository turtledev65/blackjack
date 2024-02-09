import { createClient } from "redis";

const client = await createClient()
  .on("connect", () => console.log("Redis client started successfully"))
  .on("error", (err: any) =>
    console.error("Redis client error:", err, typeof err),
  )
  .connect();

export default client;
