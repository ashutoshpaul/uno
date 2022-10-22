const redis = require('redis');
import * as dotenv from 'dotenv';

dotenv.config();

function setup(): any {
  const redis_url: string | undefined = process.env.REDIS_URL;
  if(redis_url) {
  const redisClient = redis.createClient({
    url: process.env.REDIS_URL
  });
  return redisClient;
  }
  throw new Error('Redis not connected!');
}

export { setup };