import gql from "graphql-tag";

export const GET_USER_PROFILE = gql`
  query GetProfile {
    getProfile {
      statusCode
      success
      code
      message
      data {
        watchHistory
        likedVideos
        disLikedVideos
        watchLater
      }
    }
  }
`;
