import client from "@/lib/redis";

export async function rateLimit(userKey: string, limit: number, expiry: number){
    const key =  `rate-limit:${userKey}`;
    const currentRequests = await client.incr(key);

    if(currentRequests === 1){
        await client.expire(key,expiry);
    }

    if(currentRequests > limit){
        return {allowed:false,remaining:0};
    }

    const remaining = limit - currentRequests;
    return {allowed: true, remaining }
}