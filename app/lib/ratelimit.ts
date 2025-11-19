import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export const ratelimit = new Ratelimit({
    redis : Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(10, "1 h"),
    analytics : true,
    prefix : "whatsapp_ratelimit",
})

