import { Image, Modal } from "@mantine/core";
import React, { useEffect, useState } from "react";
import "./Star.css";
import { useReward } from "react-rewards";

interface StarProps {
  description: string;
  date: Date;
  uid: string;
}

// const jsConfetti = new JSConfetti();

// https://stackoverflow.com/questions/3224834/get-difference-between-2-dates-in-javascript
function dateDiffInDays(a: Date, b: Date): number {
  const _MS_PER_DAY = 1000 * 60 * 60 * 24;
  // Discard the time and time-zone information.
  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}

function Star({ description, date, uid }: StarProps) {
  const [opened, setOpened] = useState(false);
  const { reward: starConfetti, isAnimating: isConfettiAnimating } = useReward(
    `${uid}-confetti`,
    "emoji",
    {
      emoji: ["✨", "💫", "⭐️", "🌟"],
      elementCount: 100,
      spread: 360,
      elementSize: 30,
      startVelocity: 50,
      lifetime: 300,
    }
  );

  useEffect(() => {
    if (opened) {
      if (!isConfettiAnimating) starConfetti();
    }
  }, [opened]);

  return (
    <div style={{ display: "inline-block" }}>
      <Image
        style={{ width: "25px", height: "25px" }}
        src={require("./../assets/star.png")}
        alt="star"
        onClick={() => {
          localStorage.setItem(uid, "true");
          setOpened(true);
        }}
        className={
          dateDiffInDays(date, new Date()) < 31 && !localStorage.getItem(uid)
            ? "animate__animated animate__wobble animate__infinite star-image"
            : "star-image"
        }
      />
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
          className="animate__animated animate__rotateIn animate__slower"
        />
        <br />
        <p style={{ marginTop: "6vh" }}>{date.toLocaleDateString()}</p>
        <p>{description}</p>
      </Modal>
      <span
        style={{
          zIndex: 1000,
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: 0,
          height: 0,
          margin: "auto",
        }}
        id={`${uid}-confetti`}
      ></span>
    </div>
  );
}

export default Star;
