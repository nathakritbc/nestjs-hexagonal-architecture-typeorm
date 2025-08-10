import { Response } from 'express';

export const setAccessToken = (res: Response, accessToken: string) => {
  res.cookie('access_token', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax', // process.env.NODE_ENV === 'production' ? 'lax' : 'none',
    maxAge: 1000 * 60 * 60 * 24,
  });
};
