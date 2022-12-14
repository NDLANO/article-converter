declare global {
  var access_token: AccessToken;
  var access_token_expires_at: number;
  type AccessToken = {
    access_token: string;
    expires_in: number;
  };
}

export {};
