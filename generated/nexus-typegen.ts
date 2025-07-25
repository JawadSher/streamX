/**
 * This file was generated by Nexus Schema
 * Do not make changes to this file directly
 */


import type { Context } from "./../src/graphql/context"




declare global {
  interface NexusGen extends NexusGenTypes {}
}

export interface NexusGenInputs {
}

export interface NexusGenEnums {
}

export interface NexusGenScalars {
  String: string
  Int: number
  Float: number
  Boolean: boolean
  ID: string
}

export interface NexusGenObjects {
  Mutation: {};
  Query: {};
  UserAccountData: { // root type
    error?: string | null; // String
    null?: string | null; // String
  }
  UserAccountDeleteResponse: { // root type
    code?: string | null; // String
    data?: NexusGenRootTypes['UserAccountData'] | null; // UserAccountData
    message?: string | null; // String
    statusCode?: number | null; // Int
    success?: boolean | null; // Boolean
  }
  UserAccountPasswdUpdateData: { // root type
    error?: string | null; // String
    null?: string | null; // String
  }
  UserAccountPasswdUpdateResponse: { // root type
    code?: string | null; // String
    data?: NexusGenRootTypes['UserAccountPasswdUpdateData'] | null; // UserAccountPasswdUpdateData
    message?: string | null; // String
    statusCode?: number | null; // Int
    success?: boolean | null; // Boolean
  }
  UserAccountUpdateData: { // root type
    error?: string | null; // String
    null?: string | null; // String
  }
  UserAccountUpdateResponse: { // root type
    code?: string | null; // String
    data?: NexusGenRootTypes['UserAccountUpdateData'] | null; // UserAccountUpdateData
    message?: string | null; // String
    statusCode?: number | null; // Int
    success?: boolean | null; // Boolean
  }
  UserAccountVerification: { // root type
    code?: string | null; // String
    data?: NexusGenRootTypes['UserAccountVerifyData'] | null; // UserAccountVerifyData
    message?: string | null; // String
    statusCode?: number | null; // Int
    success?: boolean | null; // Boolean
  }
  UserAccountVerifyData: { // root type
    OTP_Expires_On?: string | null; // String
    coolDownTime?: string | null; // String
    error?: string | null; // String
    null?: string | null; // String
  }
  UserData: { // root type
    _id?: string | null; // String
    accountStatus?: string | null; // String
    avatarURL?: string | null; // String
    bannerURL?: string | null; // String
    bio?: string | null; // String
    channelName?: string | null; // String
    coolDownData?: NexusGenRootTypes['coolDown'] | null; // coolDown
    country?: string | null; // String
    createdAt?: string | null; // String
    disLikedVideos?: Array<string | null> | null; // [String]
    email?: string | null; // String
    firstName?: string | null; // String
    isVerified?: boolean | null; // Boolean
    lastName?: string | null; // String
    likedVideos?: Array<string | null> | null; // [String]
    phoneNumber?: string | null; // String
    updatedAt?: string | null; // String
    userName?: string | null; // String
    watchHistory?: Array<string | null> | null; // [String]
    watchLater?: Array<string | null> | null; // [String]
  }
  UserNameAvailabilityData: { // root type
    available?: boolean | null; // Boolean
    validationError?: string | null; // String
  }
  UserNameCheckResponse: { // root type
    code?: string | null; // String
    data?: NexusGenRootTypes['UserNameAvailabilityData'] | null; // UserNameAvailabilityData
    message?: string | null; // String
    statusCode?: number | null; // Int
    success?: boolean | null; // Boolean
  }
  UserProfileResponse: { // root type
    code?: string | null; // String
    data?: NexusGenRootTypes['userProfileData'] | null; // userProfileData
    message?: string | null; // String
    statusCode?: number | null; // Int
    success?: boolean | null; // Boolean
  }
  UserResponse: { // root type
    code?: string | null; // String
    data?: NexusGenRootTypes['UserData'] | null; // UserData
    message?: string | null; // String
    statusCode?: number | null; // Int
    success?: boolean | null; // Boolean
  }
  UserSignupResponse: { // root type
    code?: string | null; // String
    data?: NexusGenRootTypes['userSignUpData'] | null; // userSignUpData
    message?: string | null; // String
    statusCode?: number | null; // Int
    success?: boolean | null; // Boolean
  }
  coolDown: { // root type
    coolDownTime?: string | null; // String
    success?: boolean | null; // Boolean
  }
  userProfileData: { // root type
    disLikedVideos?: Array<string | null> | null; // [String]
    likedVideos?: Array<string | null> | null; // [String]
    watchHistory?: Array<string | null> | null; // [String]
    watchLater?: Array<string | null> | null; // [String]
  }
  userSignUpData: { // root type
    error?: string | null; // String
  }
}

export interface NexusGenInterfaces {
}

export interface NexusGenUnions {
}

export type NexusGenRootTypes = NexusGenObjects

export type NexusGenAllTypes = NexusGenRootTypes & NexusGenScalars

export interface NexusGenFieldTypes {
  Mutation: { // field return type
    signUpUser: NexusGenRootTypes['UserSignupResponse'] | null; // UserSignupResponse
    userAccountDel: NexusGenRootTypes['UserAccountDeleteResponse'] | null; // UserAccountDeleteResponse
    userAccountPasswdUpdate: NexusGenRootTypes['UserAccountPasswdUpdateResponse'] | null; // UserAccountPasswdUpdateResponse
    userAccountUpdate: NexusGenRootTypes['UserAccountUpdateResponse'] | null; // UserAccountUpdateResponse
    userAccountVerify: NexusGenRootTypes['UserAccountVerification'] | null; // UserAccountVerification
  }
  Query: { // field return type
    checkUserName: NexusGenRootTypes['UserNameCheckResponse'] | null; // UserNameCheckResponse
    getProfile: NexusGenRootTypes['UserProfileResponse'] | null; // UserProfileResponse
    getUser: NexusGenRootTypes['UserResponse'] | null; // UserResponse
  }
  UserAccountData: { // field return type
    error: string | null; // String
    null: string | null; // String
  }
  UserAccountDeleteResponse: { // field return type
    code: string | null; // String
    data: NexusGenRootTypes['UserAccountData'] | null; // UserAccountData
    message: string | null; // String
    statusCode: number | null; // Int
    success: boolean | null; // Boolean
  }
  UserAccountPasswdUpdateData: { // field return type
    error: string | null; // String
    null: string | null; // String
  }
  UserAccountPasswdUpdateResponse: { // field return type
    code: string | null; // String
    data: NexusGenRootTypes['UserAccountPasswdUpdateData'] | null; // UserAccountPasswdUpdateData
    message: string | null; // String
    statusCode: number | null; // Int
    success: boolean | null; // Boolean
  }
  UserAccountUpdateData: { // field return type
    error: string | null; // String
    null: string | null; // String
  }
  UserAccountUpdateResponse: { // field return type
    code: string | null; // String
    data: NexusGenRootTypes['UserAccountUpdateData'] | null; // UserAccountUpdateData
    message: string | null; // String
    statusCode: number | null; // Int
    success: boolean | null; // Boolean
  }
  UserAccountVerification: { // field return type
    code: string | null; // String
    data: NexusGenRootTypes['UserAccountVerifyData'] | null; // UserAccountVerifyData
    message: string | null; // String
    statusCode: number | null; // Int
    success: boolean | null; // Boolean
  }
  UserAccountVerifyData: { // field return type
    OTP_Expires_On: string | null; // String
    coolDownTime: string | null; // String
    error: string | null; // String
    null: string | null; // String
  }
  UserData: { // field return type
    _id: string | null; // String
    accountStatus: string | null; // String
    avatarURL: string | null; // String
    bannerURL: string | null; // String
    bio: string | null; // String
    channelName: string | null; // String
    coolDownData: NexusGenRootTypes['coolDown'] | null; // coolDown
    country: string | null; // String
    createdAt: string | null; // String
    disLikedVideos: Array<string | null> | null; // [String]
    email: string | null; // String
    firstName: string | null; // String
    isVerified: boolean | null; // Boolean
    lastName: string | null; // String
    likedVideos: Array<string | null> | null; // [String]
    phoneNumber: string | null; // String
    updatedAt: string | null; // String
    userName: string | null; // String
    watchHistory: Array<string | null> | null; // [String]
    watchLater: Array<string | null> | null; // [String]
  }
  UserNameAvailabilityData: { // field return type
    available: boolean | null; // Boolean
    validationError: string | null; // String
  }
  UserNameCheckResponse: { // field return type
    code: string | null; // String
    data: NexusGenRootTypes['UserNameAvailabilityData'] | null; // UserNameAvailabilityData
    message: string | null; // String
    statusCode: number | null; // Int
    success: boolean | null; // Boolean
  }
  UserProfileResponse: { // field return type
    code: string | null; // String
    data: NexusGenRootTypes['userProfileData'] | null; // userProfileData
    message: string | null; // String
    statusCode: number | null; // Int
    success: boolean | null; // Boolean
  }
  UserResponse: { // field return type
    code: string | null; // String
    data: NexusGenRootTypes['UserData'] | null; // UserData
    message: string | null; // String
    statusCode: number | null; // Int
    success: boolean | null; // Boolean
  }
  UserSignupResponse: { // field return type
    code: string | null; // String
    data: NexusGenRootTypes['userSignUpData'] | null; // userSignUpData
    message: string | null; // String
    statusCode: number | null; // Int
    success: boolean | null; // Boolean
  }
  coolDown: { // field return type
    coolDownTime: string | null; // String
    success: boolean | null; // Boolean
  }
  userProfileData: { // field return type
    disLikedVideos: Array<string | null> | null; // [String]
    likedVideos: Array<string | null> | null; // [String]
    watchHistory: Array<string | null> | null; // [String]
    watchLater: Array<string | null> | null; // [String]
  }
  userSignUpData: { // field return type
    error: string | null; // String
  }
}

export interface NexusGenFieldTypeNames {
  Mutation: { // field return type name
    signUpUser: 'UserSignupResponse'
    userAccountDel: 'UserAccountDeleteResponse'
    userAccountPasswdUpdate: 'UserAccountPasswdUpdateResponse'
    userAccountUpdate: 'UserAccountUpdateResponse'
    userAccountVerify: 'UserAccountVerification'
  }
  Query: { // field return type name
    checkUserName: 'UserNameCheckResponse'
    getProfile: 'UserProfileResponse'
    getUser: 'UserResponse'
  }
  UserAccountData: { // field return type name
    error: 'String'
    null: 'String'
  }
  UserAccountDeleteResponse: { // field return type name
    code: 'String'
    data: 'UserAccountData'
    message: 'String'
    statusCode: 'Int'
    success: 'Boolean'
  }
  UserAccountPasswdUpdateData: { // field return type name
    error: 'String'
    null: 'String'
  }
  UserAccountPasswdUpdateResponse: { // field return type name
    code: 'String'
    data: 'UserAccountPasswdUpdateData'
    message: 'String'
    statusCode: 'Int'
    success: 'Boolean'
  }
  UserAccountUpdateData: { // field return type name
    error: 'String'
    null: 'String'
  }
  UserAccountUpdateResponse: { // field return type name
    code: 'String'
    data: 'UserAccountUpdateData'
    message: 'String'
    statusCode: 'Int'
    success: 'Boolean'
  }
  UserAccountVerification: { // field return type name
    code: 'String'
    data: 'UserAccountVerifyData'
    message: 'String'
    statusCode: 'Int'
    success: 'Boolean'
  }
  UserAccountVerifyData: { // field return type name
    OTP_Expires_On: 'String'
    coolDownTime: 'String'
    error: 'String'
    null: 'String'
  }
  UserData: { // field return type name
    _id: 'String'
    accountStatus: 'String'
    avatarURL: 'String'
    bannerURL: 'String'
    bio: 'String'
    channelName: 'String'
    coolDownData: 'coolDown'
    country: 'String'
    createdAt: 'String'
    disLikedVideos: 'String'
    email: 'String'
    firstName: 'String'
    isVerified: 'Boolean'
    lastName: 'String'
    likedVideos: 'String'
    phoneNumber: 'String'
    updatedAt: 'String'
    userName: 'String'
    watchHistory: 'String'
    watchLater: 'String'
  }
  UserNameAvailabilityData: { // field return type name
    available: 'Boolean'
    validationError: 'String'
  }
  UserNameCheckResponse: { // field return type name
    code: 'String'
    data: 'UserNameAvailabilityData'
    message: 'String'
    statusCode: 'Int'
    success: 'Boolean'
  }
  UserProfileResponse: { // field return type name
    code: 'String'
    data: 'userProfileData'
    message: 'String'
    statusCode: 'Int'
    success: 'Boolean'
  }
  UserResponse: { // field return type name
    code: 'String'
    data: 'UserData'
    message: 'String'
    statusCode: 'Int'
    success: 'Boolean'
  }
  UserSignupResponse: { // field return type name
    code: 'String'
    data: 'userSignUpData'
    message: 'String'
    statusCode: 'Int'
    success: 'Boolean'
  }
  coolDown: { // field return type name
    coolDownTime: 'String'
    success: 'Boolean'
  }
  userProfileData: { // field return type name
    disLikedVideos: 'String'
    likedVideos: 'String'
    watchHistory: 'String'
    watchLater: 'String'
  }
  userSignUpData: { // field return type name
    error: 'String'
  }
}

export interface NexusGenArgTypes {
  Mutation: {
    signUpUser: { // args
      email: string; // String!
      firstName: string; // String!
      lastName: string; // String!
      password: string; // String!
      userName: string; // String!
    }
    userAccountPasswdUpdate: { // args
      password: string; // String!
    }
    userAccountUpdate: { // args
      country?: string | null; // String
      firstName?: string | null; // String
      lastName?: string | null; // String
      phoneNumber?: string | null; // String
    }
    userAccountVerify: { // args
      state?: string | null; // String
      u_OTP?: string | null; // String
    }
  }
  Query: {
    checkUserName: { // args
      isAuthentic?: boolean | null; // Boolean
      userName?: string | null; // String
    }
  }
}

export interface NexusGenAbstractTypeMembers {
}

export interface NexusGenTypeInterfaces {
}

export type NexusGenObjectNames = keyof NexusGenObjects;

export type NexusGenInputNames = never;

export type NexusGenEnumNames = never;

export type NexusGenInterfaceNames = never;

export type NexusGenScalarNames = keyof NexusGenScalars;

export type NexusGenUnionNames = never;

export type NexusGenObjectsUsingAbstractStrategyIsTypeOf = never;

export type NexusGenAbstractsUsingStrategyResolveType = never;

export type NexusGenFeaturesConfig = {
  abstractTypeStrategies: {
    isTypeOf: false
    resolveType: true
    __typename: false
  }
}

export interface NexusGenTypes {
  context: Context;
  inputTypes: NexusGenInputs;
  rootTypes: NexusGenRootTypes;
  inputTypeShapes: NexusGenInputs & NexusGenEnums & NexusGenScalars;
  argTypes: NexusGenArgTypes;
  fieldTypes: NexusGenFieldTypes;
  fieldTypeNames: NexusGenFieldTypeNames;
  allTypes: NexusGenAllTypes;
  typeInterfaces: NexusGenTypeInterfaces;
  objectNames: NexusGenObjectNames;
  inputNames: NexusGenInputNames;
  enumNames: NexusGenEnumNames;
  interfaceNames: NexusGenInterfaceNames;
  scalarNames: NexusGenScalarNames;
  unionNames: NexusGenUnionNames;
  allInputTypes: NexusGenTypes['inputNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['scalarNames'];
  allOutputTypes: NexusGenTypes['objectNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['unionNames'] | NexusGenTypes['interfaceNames'] | NexusGenTypes['scalarNames'];
  allNamedTypes: NexusGenTypes['allInputTypes'] | NexusGenTypes['allOutputTypes']
  abstractTypes: NexusGenTypes['interfaceNames'] | NexusGenTypes['unionNames'];
  abstractTypeMembers: NexusGenAbstractTypeMembers;
  objectsUsingAbstractStrategyIsTypeOf: NexusGenObjectsUsingAbstractStrategyIsTypeOf;
  abstractsUsingStrategyResolveType: NexusGenAbstractsUsingStrategyResolveType;
  features: NexusGenFeaturesConfig;
}


declare global {
  interface NexusGenPluginTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginInputTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginFieldConfig<TypeName extends string, FieldName extends string> {
  }
  interface NexusGenPluginInputFieldConfig<TypeName extends string, FieldName extends string> {
  }
  interface NexusGenPluginSchemaConfig {
  }
  interface NexusGenPluginArgConfig {
  }
}