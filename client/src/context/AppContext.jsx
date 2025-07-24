import React, { createContext, useState } from "react";
export const AppContext = createContext();

const AppProvider = (props) => {
  const [activeuser, setActiveuser] = useState("");
  const [name ,setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  return (
    <AppContext.Provider
      value={{

        activeuser,
        setActiveuser,
        name,
        setName,
        email,
        setEmail,
        password,
        setPassword,
        confirmPassword,
        setConfirmPassword,
        error,
        setError,
        success,
        setSuccess,

          
      }}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppProvider;
