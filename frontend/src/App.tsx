import "./App.css"
import Authentication from "./Authentication";
import EventList from "./EventList";

function App(){
    const styleLink = document.createElement("link");
    styleLink.rel = "stylesheet";
    styleLink.href = "https://cdn.jsdelivr.net/npm/semantic-ui/dist/semantic.min.css";
    document.head.appendChild(styleLink);
    return (
        <Authentication>
        <div>
            <EventList/>
        </div>
        </Authentication>
    )
}


export default App;