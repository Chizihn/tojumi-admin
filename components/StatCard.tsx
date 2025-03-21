import { Counter } from "./Counter";

interface StatCardProps {
  title: string;
  value: number;
  isLoading: boolean;
  error?: string | null;
  icon: React.ReactNode;
}

export function StatCard({
  title,
  value,
  isLoading,
  error,
  icon,
}: StatCardProps) {
  return (
    <div className="bg-white shadow rounded-lg p-6 flex items-center justify-between">
      <div>
        <h3 className="text-gray-500 text-sm">{title}</h3>
        <Counter value={value} isLoading={isLoading} error={error} />
      </div>
      {icon}
    </div>
  );
}
