import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { ApolloServer } from "@apollo/server";
import { NextRequest } from "next/server";
import { tokenLimiter } from "@/lib/tokenLimiter";
import { schema } from "@/graphql/schema";
import { createContext } from "@/graphql/context";

const server = new ApolloServer({
  schema,
});

const handler = startServerAndCreateNextHandler(server, {
  context: async (req: NextRequest) => createContext(req),
});

export async function GET(request: NextRequest) {
  const rateLimitResponse = await tokenLimiter(request, {
    maxTokens: 50,
    refillRate: 3,
  });

  if (rateLimitResponse) return rateLimitResponse;

  return handler(request);
}

export async function POST(request: NextRequest) {
  const rateLimitResponse = await tokenLimiter(request, {
    maxTokens: 50,
    refillRate: 3,
  });

  if (rateLimitResponse) return rateLimitResponse;

  return handler(request);
}
