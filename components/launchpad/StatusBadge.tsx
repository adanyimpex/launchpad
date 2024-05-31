import { cn } from "@/lib/utils";
import { LockIcon, CircleIcon } from "lucide-react";

const types = {
  upcoming: {
    text: "Upcoming",
    class: "text-[#62551B] bg-[#F9DC58]",
    icon: <LockIcon className="w-3.5 h-3.5" />,
  },
  live: {
    text: "Sale Live",
    class: "text-[#065B30] bg-[#ADF8D2]",
    icon: <CircleIcon className="fill-[currentColor] w-2.5 h-2.5" />,
  },
  filled: {
    text: "Filled",
    class: "text-[#065B30] bg-[#ADF8D2]",
    icon: <CircleIcon className="fill-[currentColor] w-2.5 h-2.5" />,
  },
  canceled: {
    text: "Canceled",
    class: "text-[#C53030] bg-[#FED7D7]",
    icon: <CircleIcon className="fill-[currentColor] w-2.5 h-2.5" />,
  },
  ended: {
    text: "Sale Ended",
    class: "text-[#C53030] bg-[#FED7D7]",
    icon: <CircleIcon className="fill-[currentColor] w-2.5 h-2.5" />,
  },
  success: {
    text: "Success",
    class: "text-[#065B30] bg-[#ADF8D2]",
    icon: <CircleIcon className="fill-[currentColor] w-2.5 h-2.5" />,
  },
};

export default function StatusBadge({ type }: { type: keyof typeof types }) {
  return (
    <div
      className={cn(
        "flex font-semibold items-center rounded-md py-1.5 px-2.5 gap-2 text-xs",
        types[type].class
      )}
    >
      {types[type].icon}
      <span>{types[type].text}</span>
    </div>
  );
}
