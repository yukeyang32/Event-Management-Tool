import React,{useState, ChangeEvent, useEffect} from "react";
import EditPopUp from './EditPopUp';
type Props = {
    readonly requestDate: Date;
    readonly handleCheckChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

export type eventData = { readonly name: string; finished: boolean; readonly date: Date; readonly idx:number};

function editClick() {

}
function deleteClick() {
    
}
const EventList = ({
    requestDate,
    handleCheckChange
}: Props) => {
    const [eventList, setEventList] = useState<eventData[]>([]);
    const [showToggleEdit, setShowToggleEdit] = useState(false);
    
    useEffect(()=>{
        // fetch event data
        fetch("/")
    }, [eventList]);
     
    const filteredItems = eventList.filter(({ name, finished, date, idx }) => {
        return date===requestDate; 
      });


    const editToggle = () => {
        setShowToggleEdit(!showToggleEdit);
    }
    return (
        <div>
        
        {filteredItems.length === 0 ? "No Event" : filteredItems.map((item: eventData) => (
                
                <div>
                   <p> 
                    <label>
                        <input
                        type="checkbox"
                        value={String(item.idx)}
                        checked={item.finished}
                        onChange={handleCheckChange} />
                        {item.name}
                    </label>
                    <button onClick={editClick}>Edit</button>
                    {showToggleEdit ? <EditPopUp toggle = {editToggle} name={item.name}/> : null}
                    <button onClick={deleteClick}>Delete</button>
                    </p>
                </div>
                ))}
        
    </div>
    );
};

export default EventList;