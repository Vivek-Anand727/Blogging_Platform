import { createClient } from "redis";

const client = createClient({
  url: process.env.REDIS_URL
});

client.on("error", (err) => {
  console.error("Redis Client Error", err);
});

(async () => {
  try {
    await client.connect();
    console.log("Connected to Redis");
  } catch (err) {
    console.error("Redis connection failed:", err);
  }
})();

export default client;
