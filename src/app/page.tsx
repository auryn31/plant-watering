import { getSession } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  return (
    <main className="flex min-h-screen flex-col items-center">
      <div className="flex flex-grow w-full justify-center items-center">
        <div>
          <p className="text-2xl">Welcome to PlantR</p>
        </div>
      </div>
    </main>
  );
}
