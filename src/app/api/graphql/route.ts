import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { ApolloServer } from "@apollo/server";
import { NextRequest } from "next/server";
import { schema } from "@/graphql/schema";
import { createContext } from "@/graphql/context";
import { nodeEnv } from "@/configs/env-exports";

const server = new ApolloServer({
  schema,
  introspection: nodeEnv.NODE_ENV !== "production",
});

const handler = startServerAndCreateNextHandler(server, {
  context: async (req: NextRequest) => createContext(req),
});

export async function GET(request: NextRequest) {
  return handler(request);
}

export async function POST(request: NextRequest) {
  return handler(request);
}
