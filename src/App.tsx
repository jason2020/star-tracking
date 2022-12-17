import { MantineProvider } from "@mantine/styles";
import { StarTable } from "./components/StarTable";
import "./App.css";
import "animate.css";

function App() {
  const dummyData = [
    {
      name: "Cami",
      stars: [
        { description: "something something1", date: new Date() },
        { description: "something something2", date: new Date() },
        { description: "something something3", date: new Date() },
      ],
    },
    {
      name: "Person 2",
      stars: [
        { description: "something something4", date: new Date() },
        { description: "something something5", date: new Date() },
        { description: "something something6", date: new Date() },
        { description: "something something7", date: new Date() },
      ],
    },
  ];
  return (
    <MantineProvider
      theme={{
        fontFamily: "Press Start 2P",
      }}
    >
      <div className="App">
        <header className="animate__animated animate__bounce App-header">
          Star Tracking
        </header>
        <StarTable data={dummyData} />
      </div>
    </MantineProvider>
  );
}

export default App;
