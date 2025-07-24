import React, { useEffect, useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import { useParams } from "react-router-dom";

const ClientDetails = () => {
  const { id } = useParams();
  const { activeuser } = useContext(AppContext);
  const [client, setClient] = useState(null);

  const clientId = id;

  useEffect(() => {
    fetch(`http://localhost:3000/client?clientId=${clientId}`)
      .then((res) => res.json())
      .then((data) => setClient(data));
  }, [activeuser, clientId]);

  if (!client) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-100">
      <div className="flex flex-col p-10 justify-center bg-white rounded-lg shadow-lg border border-black w-[400px]">
        <div className="font-bold text-4xl mb-5 text-center">
          Client Details
        </div>
        <div className="font-semibold text-2xl mb-2">App Name</div>
        <div className="p-2 border border-black rounded mb-4 bg-gray-100">
          {client.appname}
        </div>
        <div className="font-semibold text-2xl mb-2">Homepage URL</div>
        <div className="p-2 border border-black rounded mb-4 bg-gray-100">
          {client.homepageurl}
        </div>
        <div className="font-semibold text-2xl mb-2">Redirect URL</div>
        <div className="p-2 border border-black rounded mb-4 bg-gray-100">
          {client.redirecturl}
        </div>
        <div className="font-semibold text-2xl mb-2">Description</div>
        <div className="p-2 border border-black rounded mb-4 bg-gray-100">
          {client.description}
        </div>
        <div className="font-semibold text-2xl mb-2">Client ID</div>
        <div className="p-2 border border-black rounded mb-4 bg-gray-100">
          {client.clientId}
        </div>
        <div className="font-semibold text-2xl mb-2">Client Secret</div>
        <div className="p-2 border border-black rounded mb-4 bg-gray-100">
          {client.clientSecret}
        </div>
      </div>
    </div>
  );
};

export default ClientDetails;
