import { objectType } from "nexus";

export const createApiResponse = (name: string, dataType: any) =>
  objectType({
    name,
    definition(t) {
      t.int("statusCode");
      t.boolean("success");
      t.string("message");
      t.nullable.field("data", {
        type: dataType,
      });
    },
  });
