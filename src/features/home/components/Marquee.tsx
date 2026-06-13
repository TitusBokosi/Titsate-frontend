import React from "react";

type Props = {
  items: string[]; // image URLs
  speed?: number;
  size?: number;
};

export default function Marquee({ items, speed = 18, size = 40 }: Props) {
  const loop = [...items, ...items];

  return (
    <div className="relative overflow-hidden w-full">
      
      <div
        className="flex w-max items-center gap-12 hover:[animation-play-state:paused]"
        style={{
          animation: `marquee ${speed}s linear infinite`,
        }}
      >
        {loop.map((item, i) => (
          <img
            key={i}
            src={item}
            alt="marquee item"
            className="object-contain opacity-80 hover:opacity-100 transition"
            style={{ width: size, height: size }}
          />
        ))}
      </div>
    </div>
  );
}       