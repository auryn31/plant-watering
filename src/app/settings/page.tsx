"use client";
import { useEffect, useState } from "react";
import { getToken } from "../components/token";

export default function Settings() {
  const [token, setToken] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const startTimeForToast = () => {
    setTimeout(() => {
      setToastMsg(null);
    }, 2000);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setToastMsg("Copied to clipboard");
      startTimeForToast();
    } catch (error) {
      setToastMsg("Failed to copy to clipboard");
      startTimeForToast();
    }
  };

  useEffect(() => {
    getToken().then(setToken);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="flex flex-col xl:flex-row gap-4 items-center">
        <p className="text-lg">Token:</p>
        {token ? (
          <p className="text-neutral-content text-center">{token}</p>
        ) : (
          <span className="loading loading-spinner"></span>
        )}
        <button
          className={`btn btn-ghost ${token === null && "btn-disabled"}`}
          onClick={() => copyToClipboard(token ?? "")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75"
            />
          </svg>
        </button>
        {toastMsg && (
          <div className="toast">
            <div
              className={`alert ${toastMsg.includes("Copied") ? "alert-success" : "alert-error"}`}
            >
              <span>{toastMsg}</span>
              <button
                className="btn btn-ghost"
                onClick={() => setToastMsg(null)}
              >
                x
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
