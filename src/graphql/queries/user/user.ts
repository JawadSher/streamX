import { gql } from '@apollo/client'

export const GET_USER = gql`
  query GetUser {
    getUser {
      statusCode
      success
      message
      code
      data {
        _id
        firstName
        lastName
        channelName
        email
        bio
        country
        accountStatus
        isVerified
        avatarURL
        bannerURL
        phoneNumber
        userName
        createdAt
        updatedAt
        watchHistory
        watchLater
        likedVideos
        disLikedVideos
        coolDownData {
          success
          coolDownTime
        }
      }
    }
  }
`
