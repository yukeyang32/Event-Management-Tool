import express from "express";
import cors from "cors";
//import path from "path";

import admin from 'firebase-admin';

// require the service account: note the file path
const serviceAccount = require('../service-account.json');
// initialize the firebase app
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();


const app = express();
app.use(cors());
//app.use(express.static(path.join(__dirname, "../../frontend/build")));
app.use(express.json());

const port = process.env.PORT || 8080;

type Event = {
    accountId: string;
    name: string;
    date: Date;
};

type EventWithID = Event & {
    id: string;
};

const eventCollection = db.collection("events");

app.get('/getEvents', async (_, res) => {
    const postsEvents = await eventCollection.orderBy('name', 'asc').get();
    const allPostsEventsDocs = postsEvents.docs;
    const events: EventWithID[] = [];
    for (let doc of allPostsEventsDocs) {
        const event: EventWithID = doc.data() as EventWithID;
        event.id = doc.id;
        events.push(event);
    }
    res.send(events);
});

app.get('/getEventsByAccountId', async (req, res) => {
    const postsEvents = await eventCollection.orderBy('name', 'asc').get();
    const allPostsEventsDocs = postsEvents.docs;
    const events: EventWithID[] = [];
    const {accountId} = req.body;
    for (let doc of allPostsEventsDocs) {
        const event: EventWithID = doc.data() as EventWithID;
        event.id = doc.id;
        if(event.accountId === accountId as string){
            events.push(event);
        }
    }
    res.send(events);
});


app.post("/createEvent", async (req, res) => {
    try {
      const newEvent = req.body as Event;
      const addedEvent = await eventCollection.add(newEvent);
      res.send(addedEvent.id);
    } catch (error) {
      res.send("creation error");
    }
  });

app.post("/updateEvent", async (req, res) => {
    const { id, name } = req.body;
    try{
        await eventCollection.doc(id as string).update({ name });
        res.send("Event updated!");
    } catch (error){
        res.send("update error");
    }

});

app.delete("/deleteEvent", async (req, res) => {
    const { id } = req.body;
    try{
        await eventCollection.doc(id as string).delete();
        res.send("Event deleted!");
    } catch(error){
        res.send("delete error");
    }

});




app.listen(port, () => console.log(`Example app listening on port ${port}!`));

