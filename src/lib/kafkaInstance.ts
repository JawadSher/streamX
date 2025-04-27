import { Kafka } from "kafkajs";

export default async function kafkaInstance() {
    if(!process.env.KAFKA_CLIENT_ID) throw new Error("KAFKA_CLIENT_ID Not Found")
    if(!process.env.KAFKA_BROKER) throw new Error("KAFKA_BROKER_IP Not Found")
    if(!process.env.KAFKA_USERNAME) throw new Error("KAFKA_USERNAME Not Found")
    if(!process.env.KAFKA_PASSWORD) throw new Error("KAFKA_PASSWORD Not Found")

      return new Kafka({
        clientId: process.env.KAFKA_CLIENT_ID,
        brokers: [process.env.KAFKA_BROKER],
        ssl: true,
        sasl: {
            mechanism: "plain",
            username: process.env.KAFKA_USERNAME,
            password: process.env.KAFKA_PASSWORD
        },
        connectionTimeout: 30000,
        authenticationTimeout: 10000,
        retry: {
            initialRetryTime: 300,
            retries: 5
        }
    });
}
