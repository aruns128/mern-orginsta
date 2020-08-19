import React, { useEffect, useState, useContext } from "react";
import pimage from "../images/profile/logo192.png";
import { Store } from "../reducers/Store";

export const Profile = () => {
  const [mypics, setPics] = useState([]);
  const {state} = useContext(Store);
  useEffect(() => {
    fetch(`/myposts`, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setPics(result.myposts);
      });
  }, []);

  return (
    <div style={{ maxWidth: "550px", margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          margin: "18px 0",
          borderBottom: "1px solid grey",
        }}
      >
        <div>
          <img
            style={{ width: "160px", height: "160px", borderRadius: "80px" }}
            src={pimage}
            alt='summa'
          />
        </div>
        <div>
          <h4>{state ? state.user.name : "loading"}</h4>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "108%",
            }}
          >
            <h6>{mypics.length} posts</h6>
            <h6>{state ? state.user.followers.length:0} followers</h6>
            <h6>{state ? state.user.following.length:0} following</h6>
          </div>
        </div>
      </div>
      <div className="gallery">
        {mypics.map((item) => {
          return (
            <img
              style={{ width: "160px", height: "160px", borderRadius: "80px" }}
              key={item._id}
              src={item.photo}
              alt={item.title}
            />
          );
        })}
      </div>
    </div>
  );
};
