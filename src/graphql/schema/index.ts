import { makeSchema } from "nexus";
import { join } from "path";
import * as types from "@/graphql/schema/types";
import * as resolvers from "./resolvers";

export const schema = makeSchema({
   types: [
    ...Object.values(types),
    ...Object.values(resolvers),
  ],

  outputs: {
    schema: join(process.cwd(), "generated", "schema.graphql"),
    typegen: join(process.cwd(), "generated", "nexus-typegen.ts"),
  },

  contextType: {
    module: join(process.cwd(), "src", "graphql", "context.ts"),
    export: "Context",
  },
});
