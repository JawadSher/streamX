"use client";

import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "@/lib/apolloClient";

export function ApoloProvider({ children }: { children: React.ReactNode }) {
  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
}
