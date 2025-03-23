import { Connection } from "mongoose";
import { RedisClientType } from "redis";

declare global{
    var mongoose:{
        conn: Connection | null;
        promise: Promise<Connection> | null;
    };
    
    var redis:{
        client: RedisClientType | null;
        promise: Promise<RedisClientType> | null;
    }
}

export {};