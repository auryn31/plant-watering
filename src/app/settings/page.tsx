"use client";
import { useEffect, useState } from "react";
import { getToken } from "../db/token";
import { TokenView } from "../components/tokenView";

export default function Settings() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    getToken().then(setToken);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      {token && <TokenView token={token} />}
    </main>
  );
}
