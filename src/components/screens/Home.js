import React, { useState, useEffect, useContext } from "react";
import { Store } from "../reducers/Store";
import {Link} from "react-router-dom"
export const Home = () => {
  const [data, setData] = useState([]);
  const { state } = useContext(Store);
  useEffect(() => {
    fetch(`/allposts`, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setData(result.posts);
      });
  }, []);

  const like = (id) => {
    fetch(`/likepost`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        //console.log(result);
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const unLike = (id) => {
    fetch(`/unlikepost`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const makeComment = (text, postId) => {
    fetch(`/comment`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId,
        text,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  
  const deletePost = (postid)=>{
    fetch(`/deletepost/${postid}`,{
        method:"delete",
        headers:{
            Authorization:"Bearer "+localStorage.getItem("jwt")
        }
    }).then(res=>res.json())
    .then(result=>{
        console.log(result)
        const newData = data.filter(item=>{
            return item._id !== result._id
        })
        setData(newData)
    })
}

const deleteComment = (postId,commentId)=>{
  fetch(`/deletecomment/${postId}/${commentId}`,{
      method:"delete",
      headers:{
          Authorization:"Bearer "+localStorage.getItem("jwt")
      }
  }).then(res=>res.json())
  .then(result=>{
    const newData = data.map((item) => {
      if (item._id === result._id) {
        return result;
      } else {
        return item;
      }
    });
    setData(newData);
  })
}

  return (
    <div className="home">
      {data.map((item) => {
        return (
          <div className="card home-card" key={item._id}>
            <h5><Link to={ state.user._id !== item.postedBy._id  ? "/profile/"+item.postedBy._id : "/profile"}>{item.postedBy.name}</Link>
            {state.user._id === item.postedBy._id &&
               <i
               className="material-icons"
               style={{ float:"right" }}
               onClick={() => deletePost(item._id)}
             >
               delete
             </i>

            }
           
                </h5>
            <div className="card-image">
              <img src={item.photo} alt={item.title} />
            </div>
            <div className="card-content">
              {item.likes.includes(state.user._id) ? (
                <i
                  className="material-icons"
                  style={{ color: "red" }}
                  onClick={() => unLike(item._id)}
                >
                  favorite
                </i>
              ) : (
                <i
                  className="material-icons"
                  style={{ color: "grey" }}
                  onClick={() => like(item._id)}
                >
                  favorite_border
                </i>
              )}
              <h6>{item.likes.length} likes</h6>
              <h5>{item.title}</h5>
              <p>{item.body}</p>
              {item.comments.map((record) => {
                return (
                  <h6 key={record._id}>
                    <span style={{ fontWeight: "500" }}>
                      {record.postedBy.name}
                    </span>
                    {" " + record.text}
                    {state.user._id === record.postedBy._id &&
                      <i
                      className="material-icons"
                      style={{ float:"right" }}
                      onClick={() => deleteComment(item._id,record._id)}
                    >
                      delete
                    </i>
                    }
                  </h6>
                );
              })}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  makeComment(e.target[0].value, item._id);
                }}
              >
                <input type="text" placeholder="add a comment" />
              </form>
            </div>
          </div>
        );
      })}
    </div>
  );
};
