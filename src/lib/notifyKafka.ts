import { IRedisDBUser } from "@/interfaces/IRedisDBUser";
import kafkaInstance from "./kafkaInstance";
import { IUserAccountUpdate } from "@/interfaces/IUserAccountUpdate";

interface passwdChangeData {
  userId: string;
  password: string;
}

interface Props {
  userData?: IRedisDBUser | IUserAccountUpdate | string | passwdChangeData;
  action?:
    | "sign-up"
    | "user-update"
    | "user-account-deletion"
    | "user-passwd-change";
}

export default async function notifyKakfa({
  userData,
  action = "sign-up",
}: Props) {
  try {
    const kafka = await kafkaInstance();
    const producer = kafka.producer();
    await producer.connect();

    let topic = "sign-up";
    switch (action) {
      case "sign-up":
        topic = "sign-up";
        break;
      case "user-update":
        topic = "user-update";
        break;
      case "user-account-deletion":
        topic = "user-account-deletion";
        break;
      case "user-passwd-change":
        topic = "user-passwd-change";
        break;
    }
    await producer.send({
      topic,
      messages: [
        {
          key: topic,
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
