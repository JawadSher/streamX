import { objectType } from "nexus";

export const UserAssetsUpload = objectType({
  name: "UserAssetsUploadResponse",
  definition(t) {
    t.int("statusCode");
    t.boolean("success");
    t.string("code");
    t.string("message");
    t.field("data", {
      type: objectType({
        name: "UserAssetsUploadData",
        definition(t) {
          t.string("error");
          t.string("null");
        },
      }),
    });
  },
});
