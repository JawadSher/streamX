import { IRedisDBUser } from "@/interfaces/IRedisDBUser";
import kafkaInstance from "./kafkaInstance";
import { IUserAccountUpdate } from "@/interfaces/IUserAccountUpdate";

interface Props{
  userData?: IRedisDBUser | IUserAccountUpdate,
  action?: "sign-up" | "user-update"; 
}

export default async function notifyKakfa({ userData, action = "sign-up" }: Props) {
  try {
    const kafka = await kafkaInstance();
    const producer = kafka.producer();
    await producer.connect();

    const topic = action === "sign-up" ? "sign-up" : "user-update";
    await producer.send({
      topic,
      messages: [
        {
          key: "sign-up",
          value: JSON.stringify(userData),
          headers: {
            source: "streamX-app",
            timestamp: Date.now().toString(),
          },
        },
      ],
    });

    console.log(`Sent ${action} message to topic ${topic}`);
    await producer.disconnect();
  } catch (error) {
    console.error("Error in notifyKafka:", error);
    throw error;
  }
}
