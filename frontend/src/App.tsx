import { User } from "firebase/auth";
import React,{useState} from "react";
import "./App.css";
import Authentication from "./Authentication";
import EventList from "./EventList";

function App(){
    const styleLink = document.createElement("link");
    const [userId, setUserId] = useState("");
    styleLink.rel = "stylesheet";
    styleLink.href = "https://cdn.jsdelivr.net/npm/semantic-ui/dist/semantic.min.css";
    document.head.appendChild(styleLink);

    const changeUser = (user: User|null) =>{
        if (user) {
            setUserId(user.uid);
        } else {
            setUserId("");
        }
        
    }

    return (
        <Authentication handleUserID={changeUser}>
        <div>
            <EventList userID = {userId}/>
        </div>
        </Authentication>
    )
}


export default App;