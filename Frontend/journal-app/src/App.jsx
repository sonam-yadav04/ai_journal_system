import React, { useState } from "react";
import JournalForm from "./components/JournalForm";
import JournalList from "./components/JournalList";
import Insights from "./components/Insights";

function App() {
  const [refresh, setRefresh] = useState(false);

  const reload = () => setRefresh(!refresh);

  return (
    <div style={{ padding: "20px" }}>
      <h1>AI Journal System</h1>

      <JournalForm onSuccess={reload} />
      <JournalList refresh={refresh} />
      <Insights refresh={refresh} />
    </div>
  );
}

export default App;