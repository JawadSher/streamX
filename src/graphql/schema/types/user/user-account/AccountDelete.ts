import { objectType } from "nexus";

export const AccountDelete = objectType({
  name: "UserAccountDeleteResponse",
  definition(t) {
    t.int("statusCode");
    t.boolean("success");
    t.string("code");
    t.string("message");
    t.field("data", {
      type: objectType({
        name: "UserAccountData",
        definition(t) {
          t.string("error");
          t.string("null");
        },
      }),
    });
  },
});
