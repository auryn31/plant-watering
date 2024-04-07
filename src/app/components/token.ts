"use server";
import { sql } from "@vercel/postgres";
import { getSession } from "@auth0/nextjs-auth0";
async function getToken() {
  "use server";
  const session = await getSession();
  if (!session) {
    return null;
  }
  const user = session.user;
  const result =
    await sql`SELECT token FROM tokens WHERE user_id = ${user.sub}`;
  return result.rows[0]?.token ?? null;
}

export { getToken };
