"use client";

import { Users, Building, UserPlus, Shield, LoaderCircle } from "lucide-react";
import { useFetchDataStore } from "@/store/useFetchData";
import { useEffect, useRef, useState } from "react";
import { useFamilyStore } from "@/store/fetch/useFamily";
import { useCarebusinessStore } from "@/store/fetch/useCarebusiness";
import { useStudentStore } from "@/store/fetch/useStudent";
import { animate } from "framer-motion";

interface CounterProps {
  value: number;
  isLoading: boolean;
  error?: string | null;
}

function Counter({ value, isLoading, error }: CounterProps) {
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

interface StatCardProps {
  title: string;
  value: number;
  isLoading: boolean;
  error?: string | null;
  icon: React.ReactNode;
}

function StatCard({ title, value, isLoading, error, icon }: StatCardProps) {
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

export default function AdminDashboard() {
  const {
    totalUsers,
    loading: totalUsersLoading,
    error,
    fetchTotalUsers,
  } = useFetchDataStore();

  const {
    familyUsers,
    loading: familyLoading,
    error: familyError,
    fetchFamilyUsers,
  } = useFamilyStore();

  const {
    carebusinessUsers,
    loading: careBusinessLoading,
    error: carebusinessError,
    fetchCarebusinessUsers,
  } = useCarebusinessStore();

  const {
    studentUsers,
    loading: studentLoading,
    error: studentError,
    fetchStudentUsers,
  } = useStudentStore();

  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchTotalUsers(),
      fetchFamilyUsers(),
      fetchCarebusinessUsers(),
      fetchStudentUsers(),
    ]).finally(() => {
      setIsInitialLoad(false);
    });
  }, [
    fetchCarebusinessUsers,
    fetchFamilyUsers,
    fetchStudentUsers,
    fetchTotalUsers,
  ]);

  const stats = [
    {
      title: "Total Users",
      value: totalUsers?.length || 0,
      isLoading: isInitialLoad || totalUsersLoading,
      error: error,
      icon: <Users className="text-blue-500" size={40} />,
    },
    {
      title: "Family Accounts",
      value: familyUsers?.length || 0,
      isLoading: isInitialLoad || familyLoading,
      error: familyError,
      icon: <UserPlus className="text-green-500" size={40} />,
    },
    {
      title: "Provider Accounts",
      value: carebusinessUsers?.length || 0,
      isLoading: isInitialLoad || careBusinessLoading,
      error: carebusinessError,
      icon: <Building className="text-purple-500" size={40} />,
    },
    {
      title: "Student Accounts",
      value: studentUsers?.length || 0,
      isLoading: isInitialLoad || studentLoading,
      error: studentError,
      icon: <Shield className="text-red-500" size={40} />,
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>
    </div>
  );
}
