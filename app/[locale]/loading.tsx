import { Loader2Icon } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col flex-1 justify-center items-center">
      <Loader2Icon className="animate-spin h-12 w-12 text-primary mb-4" />
      <p className="text-xl font-medium">loading...</p>
    </div>
  );
}
