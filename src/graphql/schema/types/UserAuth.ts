import { objectType } from "nexus";

export const UserLogout = objectType({
  name: "UserLogoutResponse",
  definition(t) {
    t.int("statusCode");
    t.string("message");
    t.boolean("success");
  },
});