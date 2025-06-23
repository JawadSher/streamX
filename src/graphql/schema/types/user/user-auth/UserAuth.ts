import { objectType } from "nexus";

export const UserLogout = objectType({
  name: "UserLogoutResponse",
  definition(t) {
    t.int("statusCode");
    t.string("message");
    t.boolean("success");
    t.string("code");
    t.field("data", {
      type: objectType({
        name: "data",
        definition(t){
          t.string("error"),
          t.string("null")
        }
      })
    })
  },
});

export const UserLogin = objectType({
  name: "UserLoginResponse",
  definition(t) {
    t.int("statusCode");
    t.string("message");
    t.boolean("success");
    t.string("code");
  },
});

export const UserSignUp = objectType({
  name: "UserSignupResponse",
  definition(t) {
    t.int("statusCode");
    t.string("message");
    t.boolean("success");
    t.string("code");
    t.field("data", {
      type: objectType({
        name: "resDat",
        definition(t) {
          t.string("error");
        },
      }),
    });
  },
});
