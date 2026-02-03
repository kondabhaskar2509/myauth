import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { BACKEND } from "../config/env";

const CreateClient = () => {
  const navigate = useNavigate();
  const { activeuser } =
    useContext(AppContext);

  const [form, setForm] = useState({
    appname: "",
    homepageurl: "",
    redirecturl: "",
    description: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  function generateClientCredentials(length) {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const ClientId = generateClientCredentials(16);
    const ClientSecret = generateClientCredentials(32);
    const Code = generateClientCredentials(48);

    fetch(BACKEND + "/createclient", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        appname: form.appname,
        homepageurl: form.homepageurl,
        redirecturl: form.redirecturl,
        description: form.description,
        clientId: ClientId,
        clientSecret: ClientSecret,
        email: activeuser,
        code: Code,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        navigate("/dashboard");
      });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-100 border ">
      <form
        className="flex flex-col p-10 justify-center bg-white rounded-lg shadow-lg"
        onSubmit={handleSubmit}>
        <div className="font-bold text-4xl mb-5 text-center ">
          {" "}
          Create New Client{" "}
        </div>
        <div className="font-semibold text-2xl"> Enter Your App Name </div>
        <input
          type="text"
          name="appname"
          value={form.appname}
          onChange={handleChange}
          placeholder="Enter App Name"
          required
          className="p-2 border border-black  my-2 w-100 rounded mb-4"
        />
        <div className="font-semibold text-2xl"> Enter Homepage Url</div>
        <input
          type="text"
          name="homepageurl"
          value={form.homepageurl}
          onChange={handleChange}
          placeholder="Enter Homepage Url"
          required
          className="p-2 border border-black my-2 w-100 rounded mb-4"
        />
        <div className="font-semibold text-2xl">Enter Redirect Url</div>
        <input
          type="text"
          name="redirecturl"
          value={form.redirecturl}
          onChange={handleChange}
          placeholder="Enter Redirect Url"
          required
          className="p-2 border border-black my-2 w-100 rounded mb-4"
        />
        <div className="font-semibold text-2xl">Enter Small Description</div>
        <input
          type="text"
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Enter Small Description"
          required
          className="p-2 border border-black my-2 w-100 rounded mb-4"
        />

        <button
          type="submit"
          className="px-6 py-2 bg-blue-500 text-white rounded font-semibold">
          Submit
        </button>
      </form>
    </div>
  );
};

export default CreateClient;
