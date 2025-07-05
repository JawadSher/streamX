import { objectType } from "nexus";

export const UserSignUp = objectType({
  name: "UserSignupResponse",
  definition(t) {
    t.int("statusCode");
    t.string("message");
    t.boolean("success");
    t.string("code");
    t.field("data", {
      type: objectType({
        name: "userSignUpData",
        definition(t) {
          t.string("error");
        },
      }),
    });
  },
});
