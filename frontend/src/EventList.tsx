import React,{useState, ChangeEvent, useEffect} from "react";
import EditPopUp from './EditPopUp';
import { Dropdown, DropdownProps } from "semantic-ui-react";
import FirebaseAuth from 'react-firebaseui/FirebaseAuth';
import AddPopUp from "./AddPopUp";


type Props = {
    readonly userID: string;
};

export type eventData = { readonly name: string; finished: boolean; readonly date: Date; readonly id:String};
export type optionData = { readonly key: number; readonly text: string; readonly value: number};

function editClick() {

}



const EventList = ({userID} : Props) => {
    const [eventList, setEventList] = useState<eventData[]>([]);
    const [shownEventList, setShownEventList] = useState<eventData[]>([]);
    const [showToggleEdit, setShowToggleEdit] = useState(false);
    const [showToggleAdd, setShowToggleAdd] = useState(false);
    const [dateList, setDateList] = useState<Date[]>([]);
    
    const swapDate = function (chosendate: any): void {
        let newShownEvent = eventList.filter(({ name, finished, date, id }) => {
            return chosendate.innerText === date.toLocaleString();
        });
        setShownEventList(newShownEvent);
    };

    function convertDatesToOptions (dates: Date[]): optionData[] {
        let res: optionData[] = [];
        dates.forEach((date:Date, index) => {
            res.push({
                key: index,
                text: date.toLocaleString(),
                value: index
            });
        });
        return res;
    }

    useEffect(()=>{
        // fetch event data
        const requstOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({'accountId': userID}) // change userId
        };
        fetch("/retrieveEventsByAccountId", requstOptions)
            .then((res) => res.json())
            .then((data) => {
                setEventList(data);
                let dateSet = new Set();
                let newDateList: Date[] = [];
                data.forEach((x:eventData)=>{
                    
                    if (!dateSet.has(x.date)) {
                        newDateList.push(x.date)
                        dateSet.add(x.date);
                    }
                    
                });
                setDateList(newDateList);
            });
    }, [userID]);
     
    


    const editToggle = () => {
        setShowToggleEdit(!showToggleEdit);
    }

    const addToggle = () => {
        setShowToggleAdd(!showToggleAdd);
    }

    const addNewEvent = (newEvent:eventData) =>{
        setEventList([...eventList, newEvent])
    }

    return (
        <div>
        <Dropdown 
          placeholder="Select a date"
          onChange={(event: React.SyntheticEvent<HTMLElement, Event>, data:DropdownProps) =>
            swapDate(event.target)
          }
          clearable
          options={convertDatesToOptions(dateList)}
          selection
        />



        {shownEventList.length === 0 ? "No Event" : shownEventList.map((item: eventData) => (
                
                <div key = {String(item.id)}>
                   <p> 
                    <label>
                        <input
                        type="checkbox"
                        value={String(item.id)}
                        checked={item.finished} />
                        {item.name}
                    </label>

                    <button onClick={editToggle}> Edit </button>
                    {showToggleEdit ? <EditPopUp toggle = {editToggle} name={item.name} idx = {item.id} finished = {item.finished}/> : null}
                    
                    </p>
                </div>
        ))}


        <button onClick={addToggle}> Add Event</button>
        {showToggleAdd ? <AddPopUp updateEventList = {addNewEvent} userID = {userID}></AddPopUp> : null}
        
    </div>
    );
};

export default EventList;