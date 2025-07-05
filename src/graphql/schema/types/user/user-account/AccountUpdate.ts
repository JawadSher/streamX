import { objectType } from "nexus";

export const AccountUpdate = objectType({
  name: "UserAccountUpdateResponse",
  definition(t) {
    t.int("statusCode");
    t.boolean("success");
    t.string("code");
    t.string("message");
    t.field("data", {
      type: objectType({
        name: "UserAccountUpdateData",
        definition(t) {
          t.string("error");
          t.string("null");
        },
      }),
    });
  },
});
