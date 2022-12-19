const { ArgumentParser } = require("argparse");
const { version } = require("./package.json");
const { nomsMembers, currQuarter } = require("./constants");

function main() {
  const parser = parserSetup();
  const parserArgs = parser.parse_args();
  const starDate = new Date(parserArgs.date).toLocaleDateString();
  const savedData = require("./src/data.json");

  const currQtrData = savedData[currQuarter] ?? [];

  const newStarData = addNewStars(
    currQtrData,
    starDate,
    parserArgs.people,
    parserArgs.message,
    parserArgs.num
  );

  savedData[currQuarter] = adjustRanking(newStarData);

  const fs = require("fs");
  fs.writeFile("./src/data.json", JSON.stringify(savedData, null, 2), (err) => {
    if (err) console.log(err);
  });

  if (!parserArgs.skip_deploy) {
    deployChangesToGhPages();
  }

  return;
}

function parserSetup() {
  const parser = new ArgumentParser({
    description:
      "Utility to update star count with messages and automatically deploy to gh-pages",
  });

  parser.add_argument("-v", "--version", { action: "version", version });
  parser.add_argument("people", {
    type: "str",
    nargs: "+",
    metavar: "N",
    help: "Who to give stars to",
  });
  parser.add_argument("-n", "--num", {
    type: "int",
    default: 1,
    help: "number of stars to give",
    required: false,
  });
  parser.add_argument("-m", "--message", {
    type: "str",
    help: "Message explaining why a star was given",
    required: true,
  });
  parser.add_argument("-d", "--date", {
    type: "str",
    default: new Date().toLocaleDateString(),
    help: "Date the star was given",
    required: false,
  });
  parser.add_argument("-s", "--skip-deploy", {
    action: "store_true",
    help: "Skip deploying to gh-pages",
    default: false,
    required: false,
  });
  return parser;
}

function addNewStars(starData, date, people, message, numberOfStars) {
  const newStar = {
    date: date,
    description: message,
    uid: Math.random().toString(36).substring(2, 15),
  };

  for (const person of people) {
    const name = person.charAt(0).toUpperCase() + person.slice(1);
    if (!nomsMembers.includes(name)) {
      throw new Error("Person is not a Noms member!");
    }

    let personIndex = starData.find((data) => data.name === name);
    let num = numberOfStars;

    if (!personIndex) {
      newStar.uid = Math.random().toString(36).substring(2, 15);
      starData.push({
        name: name,
        stars: [{ ...newStar }],
        ranking: starData.length + 1,
      });
      personIndex = starData.length - 1;
      num--;
    }

    for (let i = 0; i < num; i++) {
      newStar.uid = Math.random().toString(36).substring(2, 15);
      starData[personIndex].stars.push({ ...newStar });
    }
  }
  return starData;
}

function adjustRanking(starData) {
  const sortedData = starData.sort((a, b) => b.stars.length - a.stars.length);

  let currRank = 1;
  for (let i = 0; i < sortedData.length; i++) {
    if (
      i < sortedData.length - 1 &&
      sortedData[i].stars.length !== sortedData[i + 1].stars.length
    ) {
      currRank++;
    }
    sortedData[i].ranking = currRank;
  }
  return sortedData;
}

function deployChangesToGhPages() {
  const { exec } = require("child_process");

  exec("yarn deploy -- -m 'Updating Star Count'", (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    console.log("Successfully deployed to gh-pages!");
    return;
  });
}

main();
