import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Dashboard = () => {
  const { activeuser } = useContext(AppContext);
  const [user, setUser] = useState({});
  const [clients, setClients] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${process.env.BACKEND}/userdetails?email=${activeuser}`)
      .then((res) => res.json())
      .then((data) => setUser(data));

    fetch(`${process.env.BACKEND}/clients?email=${activeuser}`)
      .then((res) => res.json())
      .then((data) => setClients(data));
  }, [activeuser]);

  return (
    <div className="min-h-screen bg-blue-100 flex flex-col items-center pt-10">
      <div className="text-4xl font-bold mb-8">Dashboard</div>
      <div className="bg-white border border-black rounded-lg shadow-lg p-6 mb-6 w-[400px]">
        <div className="text-2xl font-semibold mb-2">User Details</div>
        <div>Name: {user.name }</div>
        <div>Email: {user.email}</div>
      </div>
      <div className="bg-white border border-black rounded-lg shadow-lg p-6 mb-6 w-[400px]">
        <div className="text-2xl font-semibold mb-2">Registered Clients</div>
        {clients.length === 0 ? (
          <div>No clients registered.</div>
        ) : (
          clients.map((client) => (
            <div
              key={client.clientId}
              className="cursor-pointer mb-4 p-3 border border-black rounded hover:bg-blue-50"
              onClick={() => navigate(`/clientdetails/${client.clientId}`)}>
              <div className="font-bold">{client.appname}</div>
              <div>Client ID: {client.clientId}</div>
              <div>Redirect URL: {client.redirecturl}</div>
            </div>
          ))
        )}
      </div>
      <button
        className="px-6 py-2 bg-blue-500 text-white rounded font-semibold"
        onClick={() => navigate("/createclient")}>
        Register New Client
      </button>
    </div>
  );
};

export default Dashboard;
