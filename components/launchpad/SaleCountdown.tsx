import Countdown, { zeroPad } from "react-countdown";
import { cn } from "@/lib/utils";
import ClientOnly from "../ClientOnly";

const CountdownItem = ({ value }: { value: string }) => {
  return (
    <div className="flex items-center rounded-lg tracking-wide justify-center text-4xl lg:text-5xl text-white bg-primary lg:w-16 lg:h-16 h-12 w-12">
      {value}
    </div>
  );
};

export default function SaleCountdown({
  date,
  className,
}: {
  date: number;
  className?: string;
}) {
  return (
    <ClientOnly>
      <Countdown
        date={date}
        renderer={({ seconds, minutes, hours, days }) => {
          return (
            <div
              className={cn(
                className,
                "font-digital-number flex justify-center items-center lg:gap-3 gap-1"
              )}
            >
              <CountdownItem value={zeroPad(days)} />
              <span className="text-4xl text-black/30">:</span>
              <CountdownItem value={zeroPad(hours)} />
              <span className="text-4xl text-black/30">:</span>
              <CountdownItem value={zeroPad(minutes)} />
              <span className="text-4xl text-black/30">:</span>
              <CountdownItem value={zeroPad(seconds)} />
            </div>
          );
        }}
      />
    </ClientOnly>
  );
}
