import { useEffect, useRef, useState } from "react";
import { animate } from "framer-motion";
import { LoaderCircle } from "lucide-react";

interface CounterProps {
  value: number;
  isLoading: boolean;
  error?: string | null;
}

export function Counter({ value, isLoading, error }: CounterProps) {
  const nodeRef = useRef<HTMLParagraphElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const node = nodeRef.current;
    if (node && !isLoading && value > 0 && !hasAnimated) {
      const controls = animate(0, value, {
        duration: 1,
        onUpdate(value) {
          node.textContent = Math.round(value).toString();
        },
        onComplete() {
          setHasAnimated(true);
        },
      });
      return () => controls.stop();
    }
  }, [value, isLoading, hasAnimated]);

  if (isLoading) {
    return <LoaderCircle className="w-6 h-6 text-gray-300 animate-spin" />;
  }

  if (error) {
    return <p className="text-red-500 text-sm">Error loading data</p>;
  }

  return (
    <p ref={nodeRef} className="text-2xl font-bold">
      {hasAnimated ? value : ""}
    </p>
  );
}
