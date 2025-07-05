import { objectType } from "nexus";

export const UserProfile = objectType({
  name: "UserProfileResponse",
  definition(t) {
    t.int("statusCode");
    t.boolean("success");
    t.string("code");
    t.string("message");
    t.field("data", {
      type: objectType({
        name: "userProfileData",
        definition(t) {
          t.list.string("watchHistory");
          t.list.string("watchLater");
          t.list.string("likedVideos");
          t.list.string("disLikedVideos");
        },
      }),
    });
  },
});
