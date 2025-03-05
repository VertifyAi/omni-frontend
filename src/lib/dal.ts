import "server-only";

import { cookies } from "next/headers";
import { decrypt } from "@/lib/session";
import { cache } from "react";

export const verifySession = cache(async () => {
  const cookie = (await cookies()).get("vertify-auth")?.value;
  if (!cookie) {
    return { isAuth: false };
  }

  const session = await decrypt(cookie);

  if (session) {
    if (session.exp && session.exp < Date.now() / 1000) {
      return { isAuth: false };
    }

    if (!session.sub) {
      return { isAuth: false };
    }
  } else {
    return { isAuth: false };
  }

  return { isAuth: true, userId: session.userId };
});
