export interface IUserAccountUpdate{
    _id?: string;
    firstName?: string;
    lastName?: string;
    password?: string;
    phoneNumber?: string;
    country?: string;
    verificationCode?: string;
    accountStatus?: string;
    isVerified?: boolean;
}