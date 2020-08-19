import React, { useEffect, useState, useContext } from "react";
import pimage from "../images/profile/logo192.png";
import { Store } from "../reducers/Store";
import { useParams } from "react-router-dom";

const Profile = () => {
  const [userProfile, setProfile] = useState(null);
  const [showfollow, setShowFollow] = useState(true);
  const { state, dispatch } = useContext(Store);
  const { userid } = useParams();
  useEffect(() => {
    fetch(`/user/${userid}`, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setProfile(result);
      });
  }, []);

  //followuser
  const followUser = () => {
    fetch(`/follow`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        followId: userid
      })
    })
      .then((res) => res.json())
      .then((result) => {
        dispatch({ type: "UPDATE", payload: { following: result.following, followers: result.followers } })
        localStorage.setItem("USER", JSON.stringify(result));
        setProfile((prevState => {
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: [...prevState.user.followers, result._id]
            }
          }
        }))
        setShowFollow(false)
      });
  }

  //unfollow
  const unfollowUser = () => {
    fetch(`/unfollow`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        unfollowId: userid
      })
    })
      .then((res) => res.json())
      .then((result) => {
        dispatch({ type: "UPDATE", payload: { following: result.following, followers: result.followers } })
        localStorage.setItem("USER", JSON.stringify(result));
        setProfile((prevState => {
          const newFollower = prevState.user.followers.filter((item)=>item !== result._id)
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers:newFollower
            }
          }
        }))
        setShowFollow(true)
      });
  }
  return (
    <>
      {userProfile ? (
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
                style={{
                  width: "160px",
                  height: "160px",
                  borderRadius: "80px",
                }}
                src={pimage}
                alt="summa"
              />
            </div>
            <div>
              <h4>{userProfile.user.name}</h4>
              <h5>{userProfile.user.email}</h5>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "108%",
                }}
              >
                <h6>
                  {userProfile.posts.length} Posts
                </h6>
                <h6>
                  {userProfile.user.followers.length} followers
                </h6>
                <h6>
                  {userProfile.user.following.length} following</h6>
                {showfollow ?
                  <button style={{margin:"10px"}} className="btn waves-effect waves-light #64b5f6 blue darken-1" onClick={() => followUser()}>
                    Follow
                </button>
                  :
                  <button  style={{margin:"10px"}} className="btn waves-effect waves-light #64b5f6 blue darken-1" onClick={() => unfollowUser()}>
                    Unfollow
                </button>
                }
              </div>
            </div>
          </div>
          <div className="gallery">
            {userProfile && userProfile.posts.map((item) => {
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
      ) : (
          <h2>Loading...</h2>
        )}
    </>
  );
};

export default Profile;
