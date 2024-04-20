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
    await sql`SELECT token_id FROM token WHERE user_id = ${user.sub}`;
  const existingToken = result.rows[0]?.token_id ?? null;
  if (existingToken) {
    return existingToken;
  }

  const newToken = crypto.randomUUID();

  console.log(
    `INSERT INTO user (user_id, name, email) VALUES (${user.sub}, ${user.name}, ${user.email})`,
  );
  const createuser =
    await sql`INSERT INTO plant_user (user_id, name, email) VALUES (${user.sub}, ${user.name}, ${user.email})`;
  console.log(createuser);
  const newTokenResponse =
    await sql`INSERT INTO token (user_id, token_id) VALUES (${user.sub}, ${newToken})`;
  console.log(user);
  console.log(newTokenResponse);
  return newTokenResponse;
}

async function checkToken(token: string) {
  console.log(token);
  const result =
    await sql`SELECT token_id FROM token WHERE token_id = ${token}`;
  console.log(result);
  const existingToken = result.rows[0]?.token_id ?? null;
  return existingToken ? true : false;
}

export { getToken, checkToken };
