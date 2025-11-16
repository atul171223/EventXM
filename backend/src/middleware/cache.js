import redis from "../utils/redis.js";

// cache for static keys like "events:list"
export const cache = (key) => async (req, res, next) => {
  const data = await redis.get(key);
  if (data) return res.json(JSON.parse(data));
  next();
};

// cache for dynamic keys like event:id
export const cacheDynamic = (prefix) => async (req, res, next) => {
  const id = req.params.id;
  const key = `${prefix}:${id}`;
  const data = await redis.get(key);
  if (data) return res.json(JSON.parse(data));
  next();
};