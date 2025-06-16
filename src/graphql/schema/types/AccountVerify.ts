import { objectType } from "nexus";

export const AccountVerify = objectType({
  name: "UserAccountVerification",
  definition(t) {
    t.int("statusCode");
    t.boolean("success");
    t.string("code");
    t.string("message");
    t.field("data", {
      type: objectType({
        name: "UserAccountVerifyData",
        definition(t) {
          t.string("coolDownTime");
          t.string("OTP_Expires_On");
          t.string("error");
          t.string("null");
        },
      }),
    });
  },
});
