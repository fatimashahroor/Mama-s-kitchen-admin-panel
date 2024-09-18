import "./style.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authLocal } from "./auth-local";
import { authRemote } from "./auth-remote";
const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(false);

  const loginHandler = async () => {
    const data = await authRemote.login(email, password);
    console.log(data);
    if (data.user.roles[0] === 1) {
      authLocal.saveToken(data.access_token);
      navigate("/users");
    } else {
      setErrorMessage(true);
    }
  };
  return (
    <div className="page">
      <div className="welcome-section">
        <h1>Welcome to <br></br>Mama's Kitchen</h1>
      </div>
      <div className="card">
        <p>Login</p>
        <input 
          type="text"
          className="inputField"
          placeholder="Email address"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="inputField"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className= 'submit' onClick={loginHandler}>Submit</button>
        {errorMessage && <p className="errorMsg">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default Login;