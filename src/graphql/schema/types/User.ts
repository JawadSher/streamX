import { objectType } from "nexus";

export const User = objectType({
  name: "UserResponse",
  definition(t) {
    t.int("statusCode");
    t.boolean("success");
    t.string("message");
    t.field("data", {
      type: objectType({
        name: "UserData",
        definition(t) {
          t.string("_id");
          t.nullable.string("firstName");
          t.nullable.string("lastName");
          t.nullable.string("channelName");
          t.nullable.list.string("watchHistory");
          t.nullable.list.string("watchLater");
          t.nullable.list.string("likedVideos");
          t.nullable.list.string("disLikedVideos");
          t.nullable.string("email");
          t.nullable.string("bio");
          t.nullable.string("country");
          t.nullable.string("accountStatus");
          t.nullable.boolean("isVerified");
          t.nullable.string("avatarURL");
          t.nullable.string("bannerURL");
          t.nullable.string("phoneNumber");
          t.nullable.string("userName");
          t.nullable.string("createdAt");
          t.nullable.string("updatedAt");
        },
      }),
    });
  },
});
