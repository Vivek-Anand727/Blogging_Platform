import client from "@/lib/redis";

export async function cacheResponse( key: string ,fetchFunction: Function , expiry: number ){

    expiry = expiry?? 600;

    const cachedData = await client.get(key);
    if(cachedData){
        return JSON.parse(cachedData);
    }

    const freshData = await fetchFunction();
    await client.set(key,JSON.stringify(freshData) , {EX : expiry});

    return freshData;

}