import { Image, Modal } from "@mantine/core";
import React, { useEffect, useState } from "react";
import "./Star.css";
import JSConfetti from "js-confetti";

interface StarProps {
  description: string;
  date: Date;
  uid: string;
}

function Star({ description, date, uid }: StarProps) {
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    if (opened) {
      localStorage.setItem(uid, "true");
    }
  }, [opened, uid]);

  const jsConfetti = new JSConfetti();

  return (
    <div style={{ display: "inline-block" }}>
      <Modal
        centered
        size={"md"}
        opened={opened}
        onClose={() => setOpened(false)}
      >
        <Image
          style={{ width: "80px", height: "80px", margin: "-4vh auto" }}
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Gold_Star.svg/1024px-Gold_Star.svg.png"
          alt="star"
          className="animate__animated animate__rotateIn"
        />
        <br />
        <p style={{ marginTop: "6vh" }}>{date.toLocaleDateString()}</p>
        <p>{description}</p>
      </Modal>
      <Image
        style={{ width: "25px", height: "25px" }}
        src={require("./../assets/star.png")}
        alt="star"
        onClick={() => {
          setOpened(true);
          jsConfetti.addConfetti({ emojis: ["✨", "💫", "⭐️", "🌟"] });
        }}
        className={
          Math.abs(date.getMonth() - new Date().getMonth()) < 1 &&
          !localStorage.getItem(uid)
            ? "animate__animated animate__wobble animate__infinite star-image"
            : "star-image"
        }
      />
    </div>
  );
}

export default Star;
