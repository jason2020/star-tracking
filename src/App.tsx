import "./App.css";
import { MantineProvider } from "@mantine/styles";
import { StarTable } from "./components/StarTable";
import "animate.css";
import { forwardRef, useEffect, useState } from "react";
import { Avatar, Group, Select, Text } from "@mantine/core";

function App() {
  const [selectedQuarter, setSelectedQuarter] = useState<string | null>(
    "Winter 2023"
  );
  const [starData, setStarData] = useState<any>([]);
  const currDate = new Date();
  currDate.setMonth(currDate.getMonth() - 4);

  useEffect(() => {
    let data = require("./data.json");

    // Invalid quarter, don't show anything
    if (!selectedQuarter || !data[selectedQuarter]) {
      setStarData([]);
      return;
    }

    data = data[selectedQuarter];
    data.forEach((row: any) => {
      row.stars.forEach((star: any) => {
        star.date = new Date(star.date);
      });
    });

    setStarData(data);
  }, [selectedQuarter]);

  const selectData = [
    {
      image: require("./assets/fall2022.png"),
      label: "Fall 2022",
      value: "Fall 2022",
      description: "Noms Q1",
    },

    {
      image: require("./assets/winter2023.jpg"),
      label: "Winter 2023",
      value: "Winter 2023",
      description: "Noms Q2",
    },
  ];

  interface ItemProps extends React.ComponentPropsWithoutRef<"div"> {
    image: string;
    label: string;
    description: string;
  }

  const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
    ({ image, label, description, ...others }: ItemProps, ref) => (
      <div ref={ref} {...others}>
        <Group noWrap>
          <Avatar src={image} />
          <div>
            <Text size="sm">{label}</Text>
            <Text size="xs" opacity={0.65}>
              {description}
            </Text>
          </div>
        </Group>
      </div>
    )
  );

  return (
    <MantineProvider
      theme={{
        fontFamily: "Press Start 2P",
      }}
    >
      <div className="App">
        <div className="content">
          <header
            className="animate__animated animate__bounce App-header animate__slow animate__delay-0.5s"
            style={{
              position: "relative",
              minHeight: "100px",
              paddingBottom: "5vw",
              maxWidth: "100%",
              zIndex: 1,
            }}
          >
            Star Tracking
            <Select
              style={{
                width: "26%",
                minWidth: "170px",
                right: "3vw",
                bottom: "1vh",
                position: "absolute",
              }}
              placeholder="Pick one"
              itemComponent={SelectItem}
              data={selectData}
              allowDeselect={false}
              size="sm"
              maxDropdownHeight={400}
              nothingFound="Nobody here"
              value={selectedQuarter}
              onChange={setSelectedQuarter}
            />
          </header>
          <StarTable data={starData} />
        </div>
        <footer
          style={{
            backgroundColor: "#282c34",
            height: "53px",
            maxWidth: "100%",
            color: "white",
            fontSize: "0.8em",
            padding: "calc(80px / 3)",
          }}
        >
          Bugs? Ideas for more features? Please send message/email if you have
          any feedback!
        </footer>
      </div>
    </MantineProvider>
  );
}

export default App;
