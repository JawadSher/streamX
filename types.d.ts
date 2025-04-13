import { Connection } from "mongoose";
import { RedisClientType } from "redis";

interface RedisCache {
    client: Redis | null;
    promise: Promise<Redis> | null;
}

declare global{
    var mongoose:{
        conn: Connection | null;
        promise: Promise<Connection> | null;
    };
    
    var redis: RedisCache;
}

export {};