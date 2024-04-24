import React from "react";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import auth from './fireBase';

function SignUpForm() {
  const [state, setState] = React.useState({
    name: "",
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

  const handleOnSubmit = async (evt) => {
    evt.preventDefault();

    const { name, email, password } = state;
    try {
      await handleSignup(email, password);
      alert("Signup successful!");
      setState({
        name: "",
        email: "",
        password: ""
      });
    } catch (error) {
      alert(error.message);
    }
  };


  const handleSignup = async (email, password) => {
    try {
      console.log(email, password);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      //const user = userCredential.user;
      alert('Signup successful!');
    } catch (error) {
      alert(error.message);
    }
  };


  return (
    <div className="form-container sign-up-container">
      <form onSubmit={handleOnSubmit}>
        <h1>Create Account</h1>
        {/* <input
          type="text"
          name="name"
          value={state.name}
          onChange={handleChange}
          placeholder="Name"
          required
        /> */}
        <input
          type="email"
          name="email"
          value={state.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <input
          type="password"
          name="password"
          value={state.password}
          onChange={handleChange}
          placeholder="Password"
          required
        />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default SignUpForm;
