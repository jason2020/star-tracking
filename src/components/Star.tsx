import { Image, Modal } from "@mantine/core";
import React, { useState } from "react";
import "./Star.css";
import JSConfetti from "js-confetti";

interface StarProps {
  description: string;
  date: Date;
}

function Star({ description, date }: StarProps) {
  const [opened, setOpened] = useState(false);

  const jsConfetti = new JSConfetti();

  return (
    <div style={{ display: "inline-block" }}>
      <Modal className="modal" opened={opened} onClose={() => setOpened(false)}>
        <Image
          style={{ width: "80px", height: "80px", margin: "-4vh auto" }}
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Gold_Star.svg/1024px-Gold_Star.svg.png"
          alt="star"
          className="animate__animated animate__rotateIn"
        />
        <p style={{ marginTop: "6vh" }}>{date.toLocaleDateString()}</p>
        <p>{description}</p>
      </Modal>
      <Image
        style={{ width: "25px", height: "25px" }}
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Gold_Star.svg/1024px-Gold_Star.svg.png"
        alt="star"
        onClick={() => {
          setOpened(true);
          jsConfetti.addConfetti({ emojis: ["✨", "💫", "⭐️", "🌟"] });
        }}
        className={
          Math.abs(date.getMonth() - new Date().getMonth()) < 1
            ? "animate__animated animate__wobble animate__infinite star-image"
            : "star-image"
        }
      />
    </div>
  );
}

export default Star;
