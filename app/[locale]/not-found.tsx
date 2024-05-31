import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center">
      <h1 className="text-6xl font-bold">
        4<span className="text-primary">0</span>4
      </h1>
      <h2 className="text-4xl font-bold mt-4">Page not found :(</h2>
      <Button className="mt-8" asChild>
        <Link href="/">Return Home</Link>
      </Button>
    </div>
  );
}
