import React from "react";
import auth from './fireBase';
import { signInWithEmailAndPassword } from 'firebase/auth';

import { useNavigate } from "react-router-dom";
function SignInForm() {
    const Navigate = useNavigate();
  const [state, setState] = React.useState({
    email: "",
    password: ""
  });
  const handleChange = evt => {
    const value = evt.target.value;
    setState({
      ...state,
      [evt.target.name]: value
    });
  };


  const handleSignIn = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      throw error;
    }
  };

  const handleOnSubmit = async (evt) => {
    evt.preventDefault();

    const { email, password } = state;
    try {
      await handleSignIn(email, password);
      localStorage.setItem("email", email);
      alert("Sign in successful!");
      Navigate("/main");
      setState({
        email: "",
        password: ""
      });
    } catch (error) {
      alert(error.message);
    }
  };


  return (
    <div className="form-container sign-in-container">
      <form onSubmit={handleOnSubmit}>
        <h1>Sign in</h1>
        <input
          type="email"
          placeholder="Email"
          name="email"
          value={state.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={state.password}
          onChange={handleChange}
        />
        {/* <a href="#">Forgot your password?</a> */}
        <button
        type="submit"
        >Sign In</button>
      </form>
    </div>
  );
}

export default SignInForm;
