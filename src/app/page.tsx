import { getSession } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  const { user } = session;
  return (
    <main className="flex min-h-screen flex-col items-center">
      <div className="navbar bg-base-100">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl" href="/">
            PlantR
          </a>
        </div>
        <div className="flex-none">
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img alt="Tailwind CSS Navbar component" src={user.picture} />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li className="p-2 text-gray-500">{user.name}</li>
              <li className="p-2 text-gray-500">{user.email}</li>
              <li>
                <a href="/settings">Settings</a>
              </li>
              <li>
                <a className="text-red-500" href="/api/auth/logout">
                  Logout
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="flex flex-grow w-full justify-center items-center">
        <div>
          <p className="text-2xl">Welcome to PlantR</p>
        </div>
      </div>
    </main>
  );
}
