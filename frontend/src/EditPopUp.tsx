import { useState } from "react";
import {getAuth} from "firebase/auth";

type Props = {
    readonly toggle: () => void;
    readonly name : String;
    readonly finished: boolean;
    readonly idx: String;

}

function EditPopUp({toggle, name,idx, finished}:Props) {
    const [updateName, setUpdateName] = useState("");
    const handleClick = () => {
        toggle();
    }

    const updateEvent = async () => {
      const newEvent = {"name":updateName,"id":idx };
      // getAuth()
      //   .currentUser?.getIdToken().
      //     then((idToken)=>
            fetch("/updateEvent",{
              method:"POST",
              headers: {
                "content-type": "application/json",
                // "authorization": idToken,
              },
              body: JSON.stringify(newEvent),
            }).then((res) => {
              res.text();
            })            
        // )
    };


    return (
        <div className="modal">
          <div className="modal_content">
            <span className="close" onClick={handleClick}>
              &times;
            </span>
            <form>
              <h3>Please enter a new event name:</h3>
              <label>
                Name:
                <input type="text" name="name" onChange = {(e) => setUpdateName(e.target.value)}/>
              </label>
              <br />
              <input type="submit" onClick ={updateEvent}/>
            </form>
          </div>
        </div>
    );
};

export default EditPopUp;