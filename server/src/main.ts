import express, { urlencoded } from "express";
import cors from "cors";
import { SSE, SSEEvent, SSEStore } from "./SSE";
import { uuid } from "./util";

const app = express();
const port = process.env.PORT || 3001;

const sseStore = new SSEStore();
const facts = [];

app.use(cors());
app.use(express.json());
app.use(urlencoded({ extended: false }));

app.get("/events", (req, res) => {
  const streamId = uuid();
  const sse = new SSE(req, res, () => sseStore.deleteStream(streamId));
  sseStore.addStream(streamId, sse);

  sse.send({ event: "facts", data: facts });
});

app.get("/status", (req, res) => {
  const clientIds = Object.keys(sseStore.getStore());
  res.json({ clients: clientIds });
});

app.post("/fact", (req, res) => {
  const fact = req.body;
  const newFact = { id: uuid(), ...fact };
  const event: SSEEvent = {
    id: uuid(),
    event: "newFact",
    data: newFact,
  };

  facts.push(newFact);
  res.json(newFact);

  sseStore.getAllStreams().forEach((stream) => stream.send(event));
});

app.listen(port, () => {
  console.log(`Facts server running on ${port}`);
});
