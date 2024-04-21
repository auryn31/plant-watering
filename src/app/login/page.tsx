export default function Login() {
  return (
    <main className="flex flex-col gap-4 justify-center w-full h-screen grow items-center">
      <h1 className="text-4xl">PlantW</h1>
      <a className="btn btn-accent" href="/api/auth/login">
        Login/Singup
      </a>
    </main>
  );
}
