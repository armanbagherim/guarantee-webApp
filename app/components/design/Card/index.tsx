import Link from "next/link";
import React from "react";
import { LeftAngle } from "../icons";

interface ICard {
  title?: string;
  link?: string;
  linkText?: string;
  children: Readonly<React.ReactNode>;
}

export default function Card({ title, link, children, linkText }: ICard) {
  return (
    <div className="bg-white pb-4 rounded-[20px]">
      
        {title && (
          <div className="mb-10">
          <div className="bg-primary/10 flex justify-between items-center rounded-[20px] p-5">
            <span className="text-xs font-bold text-primary">{title}</span>
            {link && (
              <Link className="text-xs font-bold flex gap-2" href={link}>
                {linkText} <LeftAngle />
              </Link>
            )}
          </div>
          </div>
        )}
      {children}
    </div>
  );
}
