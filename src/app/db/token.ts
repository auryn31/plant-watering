"use server";
import { getSession } from "@auth0/nextjs-auth0";
import { DB } from "@/sql/types";
import { createKysely } from "@vercel/postgres-kysely";

const db = createKysely<DB>();

async function getToken(): Promise<string | null> {
  const session = await getSession();
  if (!session) {
    return null;
  }
  const user = session.user;
  const result = await db
    .selectFrom("token")
    .select("token_id")
    .where("user_id", "=", user.sub)
    .executeTakeFirst();
  if (result) {
    return result.token_id;
  }
  const newToken = crypto.randomUUID();

  await db
    .insertInto("plant_user")
    .values({
      user_id: user.sub,
      name: user.name,
      email: user.email,
    })
    .executeTakeFirstOrThrow();
  await db
    .insertInto("token")
    .values({
      user_id: user.sub,
      token_id: newToken,
    })
    .executeTakeFirstOrThrow();
  return newToken;
}

async function checkToken(token: string): Promise<boolean> {
  const result = await db
    .selectFrom("token")
    .select("token_id")
    .where("token_id", "=", token)
    .executeTakeFirst();
  return result?.token_id ? true : false;
}

export { getToken, checkToken };
