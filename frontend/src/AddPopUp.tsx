import { useState } from "react";
import {getAuth} from "firebase/auth";
import { eventData } from "./EventList";

type Props = {
    readonly updateEventList: (newEventWithID: eventData) => void;
    readonly userID: string;
}

function AddPopUp({updateEventList,userID}:Props) {
    const updateEvents = (newEventWithID:eventData) =>{
        updateEventList(newEventWithID);
    }
    const [name, setName] = useState("");
    // const [accountId, setAccountId] = useState("");
    const [date, setDate] = useState(Date());
    const createEvent = async () => {
        const newEvent = {"name":name, "accountId": userID, "date": date};
        getAuth()
            .currentUser?.getIdToken()
            .then((idToken) =>
                fetch("/createEvent", {
                    method: "POST",
                    headers:{
                        "content-type": "application/json",
                        "authorization": idToken,
                    },
                    body: JSON.stringify(newEvent,)
                })
            )
            .then((res) => res.text())
            .then((data) => {
                // newEvent.date = new Date(newEvent.date);
                const newEventWithID = {...newEvent, id: data, finished : false, date: new Date(newEvent.date)};
                updateEvents(newEventWithID);
            })
    };

    return (
        <div>
        <div className="modal">
          <div className="modal_content">
            <span className="close">
              &times;
            </span>
            <form>
              <h3>Please enter a new event name:</h3>
              <label>
                Name:
                <input type="text" name="name" onChange = {(e) => setName(e.target.value)}/>
              </label>
              <br />
              <h3>Please enter the event date: (Instruction: yyyy/mm/dd)</h3>
              <label>
                Date:
                <input type="text" name="date" onChange = {(e) => setDate(e.target.value)}/>
              </label>
              <br />

              <input type="submit" onClick = {createEvent}/>
            </form>
          </div>
        </div>

        </div>
    )
};

export default AddPopUp;