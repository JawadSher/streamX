import { Kafka } from "kafkajs";

export default async function kafkaInstance() {
    if(!process.env.KAFKA_CLIENT_ID) throw new Error("KAFKA_CLIENT_ID Not Found")
    if(!process.env.KAFKA_BROKER_IP) throw new Error("KAFKA_BROKER_IP Not Found")
    if(!process.env.KAFKA_BROKER_PORT) throw new Error("KAFKA_BROKER_PORT Not Found")

  return new Kafka({
    clientId: process.env.KAFKA_CLIENT_ID,
    brokers: [
      `${process.env.KAFKA_BROKER_IP}:${process.env.KAFKA_BROKER_PORT}`,
    ],
  });
}
