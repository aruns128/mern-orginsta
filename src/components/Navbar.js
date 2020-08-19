import React, { useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { Store } from "./reducers/Store";

export const Navbar = () => {
  const { state, dispatch } = useContext(Store);
  const history = useHistory()
  const renderList = () => {
    if (state) {
      if (state.user) {
        return [
          <li key={"key1"}>
            <Link to="/profile">Profile</Link>
          </li>,
          <li key={"key2"}>
            <Link to="/create">Create Post</Link>
          </li>,
          <li key={"key3"}>
           <button className="btn #e53935 red darken-1" onClick={()=>{
             localStorage.clear()
             dispatch({type:"LOGOUT"})
             history.push("/signin")
           }}>
            Sign Out
          </button>
         </li>,
        ];
      }
    } else {
      return [
        <li key={"key4"}>
          <Link to="/signin">Sign In</Link>
        </li>,
        <li key={"key5"}>
          <Link to="/signup">Sign up</Link>
        </li>,
      ];
    }
  };
  return (
    <nav>
      <div className="nav-wrapper white">
        <Link to={state ? (state.user ? "/" : "/signin"):" "} className="brand-logo left">
          OrgInsta
        </Link>
        <ul id="nav-mobile" className="right">
          {renderList()}
        </ul>
      </div>
    </nav>
  );
};
