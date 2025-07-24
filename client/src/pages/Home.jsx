import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Home = () => {
  const navigate = useNavigate();
  const { activeuser } = useContext(AppContext);

  return (
    <div className="flex flex-col gap-5 p-10 items-center bg-blue-100 h-[100vh]">
      <h1 className="text-2xl font-bold">Welcome to the My Auth Client</h1>
      <div className="flex text-xl gap-5">
        <button
          hidden={activeuser}
          onClick={() => navigate("/login")}
          className="bg-green-500 text-white p-2 rounded">
          Login
        </button>
        <button
          hidden={activeuser}
          onClick={() => navigate("/signup")}
          className="bg-purple-500 text-white p-2 rounded">
          Signup
        </button>
        <button
          hidden={!activeuser}
          onClick={() => navigate("/dashboard")}
          className="bg-blue-500 text-white p-2 rounded">
          Dashboard
        </button>
      </div>
    </div>
  );
};

export default Home;
