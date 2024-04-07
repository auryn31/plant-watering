export default function Login() {
  return (
    <main className="flex flex-col gap-4 justify-center w-full h-screen grow items-center">
      <h1 className="text-4xl">PlantR</h1>
      <a className="btn btn-info" href="/api/auth/login">
        Login
      </a>
    </main>
  );
}
