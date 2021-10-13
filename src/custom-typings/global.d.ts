type AccessToken = {
  access_token: string;
  expires_in: number;
};

declare module NodeJS {
  interface Global {
    access_token: AccessToken;
    access_token_expires_at: number;
  }
}
