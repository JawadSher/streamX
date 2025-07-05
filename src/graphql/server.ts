import { ApolloServer } from "@apollo/server";
import { schema } from "@/graphql/schema";

export const server = new ApolloServer({
    schema,
    csrfPrevention: true,
    introspection: process.env.NODE_ENV !== 'production'
})