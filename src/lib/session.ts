/* eslint-disable @typescript-eslint/no-unused-vars */
import 'server-only';
import { jwtVerify } from 'jose';

const secretKey = process.env.SESSION_SECRET;
if (!secretKey) {
  throw new Error('SESSION_SECRET is not defined');
}
const encodedKey = new TextEncoder().encode(secretKey);

export async function decrypt(session: string | undefined = '') {
  try {
    if (!session) {
      throw new Error('Session token is undefined');
    }

    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (error) {
    return null;
  }
}