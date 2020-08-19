import React,{useState, useContext} from "react";
import { Link,useHistory } from "react-router-dom";
import M from "materialize-css"
import { Store } from "../reducers/Store";

export const SignIn = () => {
  const history = useHistory()
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const { dispatch } = useContext(Store);

  const postdata = () =>{
    if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
      M.toast({html:"Invalid email",classes:"#e53935 red darken-1"})
      return;
    }
    fetch(`/signin`,{
      method:"post",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        email,
        password
      })
    }).then(res =>res.json()).then(data=>{
      if(data.error){
        M.toast({html:data.error,classes:"#e53935 red darken-1"})
      }else{
        localStorage.setItem("jwt",data.token)
        localStorage.setItem("orgInstaUser",JSON.stringify(data.user))
        dispatch({type:"USER",payload:data.user})
        M.toast({html:data.message,classes:"#43a047 green darken-1"})
        history.push("/")
      }
     
    }).catch(error=>{
      console.log(error)
    })
  }
  return (
    <div className="my-card">
      <div className="card auth-card input-field">
        <h2>OrgInsta</h2>
        <input type="text" placeholder="Email" value={email} onChange={(e)=>{setEmail(e.target.value)}}/>
        <input type="password" placeholder="Password" value={password} onChange={(e)=>{setPassword(e.target.value)}}/>
        <button className="btn waves-effect waves-light #64b5f6 blue darken-1" onClick={postdata}>
          Sign in
        </button>
        <h5>
            <Link to="/signup">Don't have an account ?</Link>
        </h5>
      </div>
    </div>
  );
};
