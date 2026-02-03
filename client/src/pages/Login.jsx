import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";


const Login = () => {
  React.useEffect(() => {
    setError("");
    setSuccess("");
  }, []);
  const navigate = useNavigate();

  const {
    email,
    setEmail,
    password,
    setPassword,
    error,
    setError,
    success,
    setSuccess,
    setActiveuser,
  } = useContext(AppContext);



  const handleLogin = () => {
    setError("");
    setSuccess("");
    fetch(process.env.BACKEND + "/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setError("");
          setSuccess("Login Successful");
          setActiveuser(email);
          navigate("/dashboard");
        }
      });
  };

  return (
    <div className="h-[90vh] flex items-center justify-center ">
      <div className="bg-white  rounded-2xl shadow-xl p-10 flex flex-col gap-5 w-md ">
        <h1 className="text-3xl text-[#36a3eb] font-bold text-center ">
          Login{" "}
        </h1>

        <div className="w-full h-10 text-center text-[17px]">
          {error && <p className="text-red-600">{error}</p>}
          {success && <p className="text-green-600">{success}</p>}
        </div>

        <div>
          <label className="loginlabel">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            className="logininput"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="loginlabel">Password</label>
          <div className="relative">
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              className="logininput"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />


          </div>
        </div>

        <button
          onClick={handleLogin}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-md text-lg transition">
          Login
        </button>


        <button
          type="button"
          className="w-full mt-2  text-blue-600 font-semibold py-3 rounded-md text-xl transition"
          onClick={() => navigate("/signup")}>
          Don't have an account?{" "}
          <span
            className="text-gray-400 cursor-pointer hover:text-black"
            onClick={() => navigate("/signup")}>
            Signup
          </span>
        </button>
      </div>
    </div>
  );
};

export default Login;
