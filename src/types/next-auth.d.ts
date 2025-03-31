import 'next-auth';
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
    interface User {
        _id?: string;
        firstName?: string;
        lastName?: string;
        userName?: string;
        email?: string | undefined;
        channelName?: string;
        phoneNumber?: string;
        country?: string;
        isVerified?: boolean;
        id?: string;
    }

    interface Session {
        user?: {
            _id?: string;
            firstName?: string;
            lastName?: string;
            userName?: string;
            email?: string | undefined;
            channelName?: string;
            phoneNumber?: string;
            country?: string;
            isVerified?: boolean;
            id?: string;
        } & DefaultSession['user'];
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        _id?: string;
        firstName?: string;
        lastName?: string;
        userName?: string;
        email?: string | undefined;
        channelName?: string;
        phoneNumber?: string;
        country?: string;
        isVerified?: boolean;
        id?: string;
    }
}