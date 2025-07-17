export const arcJetENV = {
  ARCJET_KEY: process.env.ARCJET_KEY!,
};

export const mongoEnv = {
  MONGODB_URI: process.env.MONGODB_URI!,
};

export const nextAuthEnv = {
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET!,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL!,
};

export const googleAuthEnv = {
  AUTH_GOOGLE_CLIENT_ID: process.env.AUTH_GOOGLE_CLIENT_ID!,
  AUTH_GOOGLE_CLIENT_SECRET: process.env.AUTH_GOOGLE_CLIENT_SECRET!,
};

export const baseEnv = {
  BASE_URL: process.env.BASE_URL!,
};

export const upstashEnv = {
  UPSTASH_REDIS_URI: process.env.NEXT_PUBLIC_UPSTASH_REDIS_URI!,
  UPSTASH_REDIS_TOKEN: process.env.NEXT_PUBLIC_UPSTASH_REDIS_TOKEN!,
};

export const kafkaEnv = {
  KAFKA_CLIENT_ID: process.env.KAFKA_CLIENT_ID!,
  KAFKA_BROKER: process.env.KAFKA_BROKER!,
  KAFKA_USERNAME: process.env.KAFKA_USERNAME!,
  KAFKA_PASSWORD: process.env.KAFKA_PASSWORD!,
};

export const resendEnv = {
  NEXT_RESEND_API_KEY: process.env.NEXT_RESEND_API_KEY!,
};

export const cloudinaryEnv = {
  CLOUDINARY_CLOUD_NAME: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
  CLOUDINARY_API_KEY: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!,
  CLOUDINARY_API_SECRET: process.env.NEXT_CLOUDINARY_API_SECRET!,
  CLOUDINARY_URL: process.env.NEXT_CLOUDINARY_URL!,
};

export const graphqlEnv = {
  GRAPHQL_API: process.env.NEXT_PUBLIC_GRAPHQL_API!,
};

export const nodeEnv = {
  NODE_ENV: process.env.NODE_ENV!,
};
