import { objectType } from "nexus";

export const UserAccountPasswdUpdate = objectType({
  name: "UserAccountPasswdUpdateResponse",
  definition(t) {
    t.int("statusCode");
    t.boolean("success");
    t.string("code");
    t.string("message");
    t.field("data", {
      type: objectType({
        name: "UserAccountPasswdUpdateData",
        definition(t) {
          t.string("error");
          t.string("null");
        },
      }),
    });
  },
});