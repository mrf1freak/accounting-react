import "next-auth";

interface UserCommon {
  id: number;
  username: string;
}

declare module "next-auth" {
  type User = UserCommon;
  type DefaultUser = UserCommon;
  interface Session {
    user: User;
  }
}

declare module "next-auth/jwt" {
  type User = UserCommon;
  interface JWT {
    idToken?: string;
    user: UserCommon;
    username: string;
  }
}
