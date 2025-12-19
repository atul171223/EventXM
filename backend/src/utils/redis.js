// import { createClient } from "redis";

// const client = createClient();

// client.on("error", (err) => {
//   console.error("Redis error:", err);
// });

// await client.connect();

// export default client;

let redis = {
  get: async () => null,
  set: async () => null,
  del: async () => null,
};

if (process.env.NODE_ENV !== "production") {
  const { createClient } = await import("redis");
  redis = createClient();

  redis.on("error", (err) => {
    console.error("Redis error:", err);
  });

  await redis.connect();
}

export default redis;