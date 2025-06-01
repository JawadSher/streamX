import { objectType } from "nexus";

export const UserNameAvailabilityData = objectType({
  name: "UserNameAvailabilityData",
  definition(t) {
    t.boolean("available");
    t.string("validationError")
  },
});

export const UserName = objectType({
  name: "UserNameCheckResponse",
  definition(t) {
    t.int("statusCode");
    t.string("message");
    t.boolean("success");
    t.string("code");
    t.nullable.field("data", {
      type: "UserNameAvailabilityData",
    });
  },
});