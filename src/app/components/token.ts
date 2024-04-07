"use server";
import { sql } from "@vercel/postgres";
import { getSession } from "@auth0/nextjs-auth0";
async function getToken() {
  const session = await getSession();
  if (!session) {
    return null;
  }
  const user = session.user;
  const result =
    await sql`SELECT token FROM tokens WHERE user_id = ${user.sub}`;
  const existingToken = result.rows[0]?.token ?? null;
  if (existingToken) {
    return existingToken;
  }

  const newToken = crypto.randomUUID();

  const newTokenResponse =
    await sql`INSERT INTO tokens (user_id, token) VALUES (${user.sub}, ${newToken})`;
  return newTokenResponse;
}

export { getToken };
