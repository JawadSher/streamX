import 'next-auth';
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
    interface User {
        _id?: string;
        firstName?: string;
        lastName?: string;
        userName?: string;
        email?: string;
        channelName?: string;
        phoneNumber?: string;
        country?: string;
        isVerified?: boolean;
    }

    interface Session {
        user?: {
            _id?: string;
            firstName?: string;
            lastName?: string;
            userName?: string;
            email?: string;
            channelName?: string;
            phoneNumber?: string;
            country?: string;
            isVerified?: boolean;
        } & DefaultSession['user'];
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        _id?: string;
        firstName?: string;
        lastName?: string;
        userName?: string;
        email?: string;
        channelName?: string;
        phoneNumber?: string;
        country?: string;
        isVerified?: boolean;
    }
}