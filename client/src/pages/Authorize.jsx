import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { BACKEND } from "../config/env";

const Authorize = () => {
    const [searchParams] = useSearchParams();
    const clientId = searchParams.get("client_id");
    const redirecturi = searchParams.get("redirect_uri");

    console.log(redirecturi)
    
    if (!clientId || !redirecturi) return;

    fetch(BACKEND + "/authorize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
          console.log("Authorization code received:", data.code);
          window.location.href = `${redirecturi}?code=${data.code}`;
      })
      .catch(err => {
        console.error("Authorization error:", err);
      });


  return (
    <div>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-200 to-blue-200">
        <div className="w-full max-w-md bg-white text-black rounded-lg shadow-2xl flex flex-col items-center p-10 border-2 border-green-500">
          <div className="w-16 h-16 flex items-center justify-center mb-6">
            <svg
              className="w-16 h-16 text-green-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-extrabold mb-4 text-green-700 text-center">
            Data Authorization Successful!
          </h2>
          <p className="text-lg text-gray-700 text-center mb-2">
            You have successfully authorized your data.
          </p>
          <p className="text-base text-gray-500 text-center">
            Redirecting you back to your app...
          </p>
        </div>
      </div>
    </div>
  );
};

export default Authorize;
