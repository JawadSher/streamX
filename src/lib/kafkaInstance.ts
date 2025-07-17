import { kafkaEnv } from "@/configs/env-exports";
import { Kafka } from "kafkajs";

export default async function kafkaInstance() {
  if (!kafkaEnv.KAFKA_CLIENT_ID) throw new Error("KAFKA_CLIENT_ID Not Found");
  if (!kafkaEnv.KAFKA_BROKER) throw new Error("KAFKA_BROKER_IP Not Found");
  if (!kafkaEnv.KAFKA_USERNAME) throw new Error("KAFKA_USERNAME Not Found");
  if (!kafkaEnv.KAFKA_PASSWORD) throw new Error("KAFKA_PASSWORD Not Found");

  return new Kafka({
    clientId: kafkaEnv.KAFKA_CLIENT_ID,
    brokers: [kafkaEnv.KAFKA_BROKER],
    ssl: true,
    sasl: {
      mechanism: "plain",
      username: kafkaEnv.KAFKA_USERNAME,
      password: kafkaEnv.KAFKA_PASSWORD,
    },
    connectionTimeout: 30000,
    authenticationTimeout: 10000,
    retry: {
      initialRetryTime: 300,
      retries: 5,
    },
  });
}
