import { Session, getSession } from "@auth0/nextjs-auth0";

export default async function Home() {
  const { user } = (await getSession()) as Session;

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <a href="/api/auth/logout">Logout</a>
      {user && (
        <div>
          <img src={user.picture} alt={user.name} />
          <h2>{user.name}</h2>
          <p>{user.email}</p>
        </div>
      )}
    </main>
  );
}
