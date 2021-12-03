import React,{useState, ChangeEvent, useEffect} from "react";
import EditPopUp from './EditPopUp';
import { Dropdown, DropdownProps } from "semantic-ui-react";
// type Props = {
//     readonly requestDate: Date;
//     readonly handleCheckChange: (e: ChangeEvent<HTMLInputElement>) => void;
// };

export type eventData = { readonly name: string; finished: boolean; readonly date: Date; readonly id:String};
export type optionData = { readonly key: number; readonly text: string; readonly value: number};

function editClick() {

}
// function deleteClick() {
    
// }


const EventList = () => {
    const [eventList, setEventList] = useState<eventData[]>([]);
    const [shownEventList, setShownEventList] = useState<eventData[]>([]);
    const [showToggleEdit, setShowToggleEdit] = useState(false);
    const [dateList, setDateList] = useState<Date[]>([]);
    
    const swapDate = function (chosendate: Date): void {
        console.log(chosendate.toString());
        let newShownEvent = eventList.filter(({ name, finished, date, id }) => {
            return chosendate === date;
        });
        setShownEventList(newShownEvent);
    };

    function convertDatesToOptions (dates: Date[]): optionData[] {
        let res: optionData[] = [];
        dates.forEach((date:Date, index) => {
            res.push({
                key: index,
                text: date.toLocaleString(),
                value: Number(date.toLocaleString())
            });
        });
        return res;
    }

    useEffect(()=>{
        // fetch event data
        const requstOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({accountId: '1'}) // change userId
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
    }, []);
     
    


    const editToggle = () => {
        setShowToggleEdit(!showToggleEdit);
    }

    return (
        <div>
        <Dropdown 
          placeholder="Select a date"
          onChange={(event: React.SyntheticEvent<HTMLElement, Event>, data:DropdownProps) =>
            swapDate(new Date((event.target as Element).id))
          }
          clearable
          options={convertDatesToOptions(dateList)}
          selection
        />
        {eventList.length === 0 ? "No Event" : eventList.map((item: eventData) => (
                
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
                    
                    {/* <button onClick={editClick}>Edit</button>
                    {showToggleEdit ? <EditPopUp toggle = {editToggle} name={item.name}/> : null}
                    <button onClick={deleteClick}>Delete</button> */}
                    </p>
                </div>
                ))}
        
    </div>
    );
};

export default EventList;