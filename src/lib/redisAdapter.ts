import { v4 as uuidv4 } from 'uuid';

export function RedisAdapter(client: any): any {
  return {
    async createUser(user: Record<string, any>): Promise<Record<string, any>> {
      const id = uuidv4();
      const newUser = { ...user, id };

      try {
        await client.hset(`user:${id}`, newUser); 
        if (user.email) {
          await client.set(`user:email:${user.email}`, id); 
        }
        return newUser;
      } catch (error) {
        console.error("Error creating user:", error);
        throw error;
      }
    },

    async getUser(id: string): Promise<Record<string, any> | null> {
      try {
        const userData = await client.hgetall(`user:${id}`);
        return userData && Object.keys(userData).length > 0 ? userData : null;
      } catch (error) {
        console.error("Error getting user:", error);
        return null;
      }
    },

    async getUserByEmail(email: string): Promise<Record<string, any> | null> {
      try {
        const id = await client.get(`user:email:${email}`);
        if (!id) return null;
        return this.getUser(id);
      } catch (error) {
        console.error("Error getting user by email:", error);
        return null;
      }
    },

    async getUserByAccount({
      provider,
      providerAccountId,
    }: {
      provider: string;
      providerAccountId: string;
    }): Promise<Record<string, any> | null> {
      try {
        const accountKey = `account:${provider}:${providerAccountId}`;
        const userId = await client.get(accountKey);
        if (!userId) return null;
        return this.getUser(userId);
      } catch (error) {
        console.error("Error getting user by account:", error);
        return null;
      }
    },

    async updateUser(user: Record<string, any>): Promise<Record<string, any>> {
      try {
        await client.hset(`user:${user.id}`, user);
        return user;
      } catch (error) {
        console.error("Error updating user:", error);
        throw error;
      }
    },

    async linkAccount(account: Record<string, any>): Promise<Record<string, any>> {
      try {
        const accountKey = `account:${account.provider}:${account.providerAccountId}`;
        await client.set(accountKey, account.userId);
        await client.hset(`account:${account.userId}:${account.provider}`, account);
        return account;
      } catch (error) {
        console.error("Error linking account:", error);
        throw error;
      }
    },

    async createSession({
      sessionToken,
      userId,
      expires,
    }: {
      sessionToken: string;
      userId: string;
      expires: Date;
    }): Promise<Record<string, any>> {
      const session = { sessionToken, userId, expires: expires.toISOString() };
      try {
        await client.set(`session:${sessionToken}`, JSON.stringify(session));
        await client.expireat(
          `session:${sessionToken}`,
          Math.floor(expires.getTime() / 1000)
        );
        return session;
      } catch (error) {
        console.error("Error creating session:", error);
        throw error;
      }
    },

    async getSessionAndUser(
      sessionToken: string
    ): Promise<{ session: Record<string, any>; user: Record<string, any> } | null> {
      try {
        const sessionStr = await client.get(`session:${sessionToken}`);
        if (!sessionStr) return null;
        const session = JSON.parse(sessionStr);
        const user = await this.getUser(session.userId);
        if (!user) return null;
        return { session, user };
      } catch (error) {
        console.error("Error getting session and user:", error);
        return null;
      }
    },

    async updateSession(session: Record<string, any>): Promise<Record<string, any>> {
      try {
        await client.set(`session:${session.sessionToken}`, JSON.stringify(session));
        if (session.expires) {
          await client.expireAt(
            `session:${session.sessionToken}`,
            Math.floor(new Date(session.expires).getTime() / 1000)
          );
        }
        return session;
      } catch (error) {
        console.error("Error updating session:", error);
        throw error;
      }
    },

    async deleteSession(sessionToken: string): Promise<void> {
      try {
        await client.del(`session:${sessionToken}`);
      } catch (error) {
        console.error("Error deleting session:", error);
        throw error;
      }
    },

    async createVerificationToken({
      identifier,
      expires,
      token,
    }: {
      identifier: string;
      expires: Date;
      token: string;
    }): Promise<Record<string, any>> {
      const verificationToken = { identifier, expires: expires.toISOString(), token };
      try {
        await client.set(`verification:${token}`, JSON.stringify(verificationToken));
        await client.expireAt(
          `verification:${token}`,
          Math.floor(expires.getTime() / 1000)
        );
        return verificationToken;
      } catch (error) {
        console.error("Error creating verification token:", error);
        throw error;
      }
    },

    async useVerificationToken({
      identifier,
      token,
    }: {
      identifier: string;
      token: string;
    }): Promise<Record<string, any> | null> {
      const tokenKey = `verification:${token}`;
      try {
        const verificationTokenStr = await client.get(tokenKey);
        if (!verificationTokenStr) return null;
        const verificationToken = JSON.parse(verificationTokenStr);
        await client.del(tokenKey);
        return verificationToken;
      } catch (error) {
        console.error("Error using verification token:", error);
        return null;
      }
    },
  };
}