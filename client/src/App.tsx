import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const [facts, setFacts] = useState<any[]>([]);
  const { current: es } = useRef(
    new EventSource("http://localhost:3001/events")
  );

  const onMessage = (e: MessageEvent) => {
    setFacts(JSON.parse(e.data));
  };

  const onNewFact = (e: MessageEvent) => {
    const newFact = JSON.parse(e.data);
    console.log(newFact);
    setFacts((prev) => prev.concat(newFact));
  };

  useEffect(() => {
    es.addEventListener("facts", onMessage);
    es.addEventListener("newFact", onNewFact);
  }, []);

  return (
    <table className="stats-table">
      <thead>
        <tr>
          <th>Fact</th>
          <th>Source</th>
        </tr>
      </thead>
      <tbody>
        {facts.map((fact, i) => (
          <tr key={i}>
            <td>{fact.info}</td>
            <td>{fact.source}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default App;
