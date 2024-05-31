"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  MessagesSquareIcon,
  XIcon,
  MailIcon,
  NewspaperIcon,
} from "lucide-react";
import { useState } from "react";

const links = [
  {
    title: "Telegram",
    subtitle: "@CryptoUNOFiles",
    link: "https://t.me/CryptoUNOFiles",
    icon: (
      <svg
        width="36"
        height="36"
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M17.8571 0C7.99554 0 0 7.99554 0 17.8571C0 27.7188 7.99554 35.7143 17.8571 35.7143C27.7188 35.7143 35.7143 27.7188 35.7143 17.8571C35.7143 7.99554 27.7188 0 17.8571 0ZM26.1339 12.1443C25.8661 14.9673 24.7024 21.8199 24.1116 24.9821C23.8616 26.3214 23.3676 26.7693 22.8914 26.8125C21.8542 26.9077 21.067 26.1265 20.0625 25.4688C18.4911 24.439 17.6027 23.7976 16.0774 22.7917C14.314 21.6295 15.4568 20.9911 16.4613 19.9479C16.7247 19.6741 21.2932 15.5179 21.3824 15.1414C21.3929 15.0938 21.4048 14.9182 21.2991 14.8259C21.1935 14.7336 21.0402 14.7649 20.9301 14.7902C20.7723 14.8259 18.2619 16.4851 13.3973 19.7679C12.6845 20.2574 12.0387 20.4955 11.4598 20.4836C10.8229 20.4702 9.59673 20.1235 8.68452 19.8259C7.56696 19.4628 6.67708 19.2693 6.75446 18.6533C6.79464 18.3318 7.23661 18.003 8.08185 17.6667C13.2872 15.3988 16.7589 13.9033 18.4955 13.1801C23.4554 11.1176 24.4851 10.7589 25.1577 10.747C26 10.7351 26.2024 11.4301 26.1339 12.1443Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    title: "Contact",
    subtitle: "support@pinky.finance",
    link: "mailto:support@pinky.finance",
    icon: <MailIcon />,
  },
  {
    title: "Documentations",
    link: "https://docs.pinky.finance/",
    icon: <NewspaperIcon />,
  },
];

export function ContactPopover() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Popover onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          className={cn(
            "fixed lg:bottom-8 lg:right-8 bottom-6 right-6 z-20 rounded-full lg:h-16 lg:w-16 h-12 w-12"
          )}
          size={"icon"}
        >
          {isOpen ? (
            <XIcon className="lg:w-8 lg:h-8 h-6 w-6" />
          ) : (
            <MessagesSquareIcon className="lg:w-8 lg:h-8 h-6 w-6" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-80 overflow-hidden">
        <div>
          <div className="bg-primary pb-8 py-4 pt-4">
            <p className="text-white lg:text-xl text-center font-medium">
              Contact Us
            </p>
          </div>
          <div className="space-y-4 p-4 -mt-8 z-10">
            {links.map((link) => (
              <a
                key={link.title}
                href={link.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-2 bg-liteground px-4 py-4 rounded-md hover:opacity-80"
              >
                {link.icon}
                <div className="flex flex-col">
                  <span className="block text-sm text-card-foreground">
                    {link.title}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {link.subtitle || link.link}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
