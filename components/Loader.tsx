import { LoaderCircle } from "lucide-react";

export default function Loader() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[200px]">
      <LoaderCircle className="animate-spin h-10 w-10 text-primary" />
    </div>
  );
}
