import express from "express";
import cors from "cors";
import path from "path";

import {db, auth} from './firebase-config';

// require the service account: note the file path
// const serviceAccount = require('../service-account.json');
// initialize the firebase app
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

// const db = admin.firestore();


const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, "../../frontend/build")));
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

app.post('/retrieveEventsByAccountId', async (req, res) => {
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
    const idToken = req.headers.authorization || "";
    try {
      const user = await auth.verifyIdToken(idToken);
      if(user.email !== "rayyu0411@gmail.com") throw new Error();
      const newEvent = req.body as Event;
      const addedEvent = await eventCollection.add(newEvent);
      res.send(addedEvent.id);
    } catch (error) {
      res.send("creation error");
    }
  });

app.post("/updateEvent", async (req, res) => {
    const { id, name, finished } = req.body;
    try{
        await eventCollection.doc(id as string).update({ name });
        await eventCollection.doc(id as string).update({ finished });
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

