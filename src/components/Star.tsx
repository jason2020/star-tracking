import { Image, Modal } from "@mantine/core";
import React, { useState } from "react";
import "./Star.css";
import JSConfetti from "js-confetti";

interface StarProps {
  description: string;
}

function Star({ description }: StarProps) {
  const [opened, setOpened] = useState(false);

  const jsConfetti = new JSConfetti();

  return (
    <div style={{ display: "inline-block" }}>
      <Modal
        className="modal"
        opened={opened}
        onClose={() => setOpened(false)}
        title={description}
      ></Modal>
      <Image
        style={{ width: "20px", height: "20px" }}
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Gold_Star.svg/1024px-Gold_Star.svg.png"
        alt="star"
        onClick={() => {
          setOpened(true);
          console.log(jsConfetti);
          jsConfetti.addConfetti({ emojis: ["✨", "💫", "⭐️", "🌟"] });
        }}
      />
    </div>
  );
}

export default Star;
