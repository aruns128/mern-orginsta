import React, { useEffect, useContext } from "react";
import { Navbar } from "./components/Navbar";
import "./App.css";
import { BrowserRouter, Route, Switch, useHistory } from "react-router-dom";
import { Home } from "./components/screens/Home";
import { SignIn } from "./components/screens/SignIn";
import { SignUp } from "./components/screens/SignUp";
import { Profile } from "./components/screens/Profile";
import { CreatePost } from "./components/screens/CreatePost";
import { Store } from "./components/reducers/Store";
import UserProfile from "./components/screens/UserProfile";


const Routing = () => {
  const history = useHistory();
  const { dispatch } = useContext(Store);
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("orgInstaUser"));
    if (userInfo) {
      dispatch({ type: "USER", payload: userInfo });
    } else {
      history.push("/signin");
    }
  }, []);
  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route  path="/signin" component={SignIn} />
      <Route  path="/signup" component={SignUp} />
      <Route exact path="/profile" component={Profile} />
      <Route  path="/create" component={CreatePost} />
      <Route  path="/profile/:userid" component={UserProfile} />
    </Switch>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routing />
    </BrowserRouter>
  );
}

export default App;
