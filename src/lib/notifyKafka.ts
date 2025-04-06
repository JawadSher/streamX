import kafkaInstance from "./kafkaInstance";

interface IUserData {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  channelName: string;
  isVerified: boolean;
  password: string;
  bio: string;
  avatar: string | undefined | null;
  storageProvider: string;
}

export default async function notifyKakfa(userData: IUserData) {
  try {
    const kafka = await kafkaInstance();
    const producer = kafka.producer();
    await producer.connect();
    await producer.send({
      topic: "sign-up",
      messages: [
        {
          key: "sign-up",
          value: JSON.stringify(userData),
          headers: {
            source: "google-auth",
            timestamp: Date.now().toString(),
          },
        },
      ],
    });
    await producer.disconnect();
  } catch (error) {
    console.error("Error in notifyKafka:", error);
    throw error;
  }
}
