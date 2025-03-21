"use client";

import {
  Users,
  Building,
  UserPlus,
  Shield,
  LoaderCircle,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  Calendar,
} from "lucide-react";
import { useQuery } from "@apollo/client";
import { currencyFormatter } from "@/utils";
import { StatCard } from "@/components/StatCard";
import { DASHBOARD_OVERVIEW } from "@/graphql/queries";

export default function AdminDashboard() {
  const { data, loading, error } = useQuery(DASHBOARD_OVERVIEW, {
    fetchPolicy: "cache-first",
  });
  const overview = data?.databaseOverview;

  const userStats = [
    {
      title: "Total Users",
      value: overview?.totalUsers || 0,
      isLoading: loading,
      error: error?.message,
      icon: <Users className="text-blue-500" size={40} />,
    },
    {
      title: "Family Accounts",
      value: overview?.totalFamilies || 0,
      isLoading: loading,
      error: error?.message,
      icon: <UserPlus className="text-green-500" size={40} />,
    },
    {
      title: "Provider Accounts",
      value: overview?.totalProviders || 0,
      isLoading: loading,
      error: error?.message,
      icon: <Building className="text-purple-500" size={40} />,
    },
    {
      title: "Student Accounts",
      value: overview?.totalStudents || 0,
      isLoading: loading,
      error: error?.message,
      icon: <Shield className="text-red-500" size={40} />,
    },
  ];

  const contractStats = [
    {
      title: "All Contracts",
      value: overview?.allContracts || 0,
      isLoading: loading,
      error: error?.message,
      icon: <FileText className="text-gray-500" size={40} />,
    },
    {
      title: "Active Contracts",
      value: overview?.activeContracts || 0,
      isLoading: loading,
      error: error?.message,
      icon: <CheckCircle className="text-green-500" size={40} />,
    },
    {
      title: "Pending Contracts",
      value: overview?.pendingContracts || 0,
      isLoading: loading,
      error: error?.message,
      icon: <Clock className="text-yellow-500" size={40} />,
    },
    {
      title: "Cancelled Contracts",
      value: overview?.cancelledContracts || 0,
      isLoading: loading,
      error: error?.message,
      icon: <XCircle className="text-red-500" size={40} />,
    },
  ];

  const additionalStats = [
    {
      title: "Total Dependents",
      value: overview?.totalDependents || 0,
      isLoading: loading,
      error: error?.message,
      icon: <Users className="text-indigo-500" size={40} />,
    },
    {
      title: "Care Homes",
      value: overview?.totalCareHomes || 0,
      isLoading: loading,
      error: error?.message,
      icon: <Building className="text-teal-500" size={40} />,
    },
    {
      title: "Guarantors",
      value: overview?.totalGuarantors || 0,
      isLoading: loading,
      error: error?.message,
      icon: <Shield className="text-amber-500" size={40} />,
    },
    {
      title: "Expired Contracts",
      value: overview?.expiredContracts || 0,
      isLoading: loading,
      error: error?.message,
      icon: <Calendar className="text-orange-500" size={40} />,
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Overview</h1>

      <h2 className="text-xl font-semibold mb-4">User Statistics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {userStats.map((stat, index) => (
          <StatCard key={`user-${index}`} {...stat} />
        ))}
      </div>

      <h2 className="text-xl font-semibold mb-4">Contract Statistics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {contractStats.map((stat, index) => (
          <StatCard key={`contract-${index}`} {...stat} />
        ))}
      </div>

      <h2 className="text-xl font-semibold mb-4">Additional Statistics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {additionalStats.map((stat, index) => (
          <StatCard key={`additional-${index}`} {...stat} />
        ))}
      </div>

      {overview?.totalRevenue ? (
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Revenue</h2>
          <p className="text-3xl font-bold">
            {currencyFormatter(overview.totalRevenue, "NGN")}
          </p>
        </div>
      ) : loading ? (
        <div className="bg-white shadow rounded-lg p-6 mb-8 flex items-center">
          <LoaderCircle className="w-6 h-6 text-gray-300 animate-spin mr-2" />
          <span>Loading revenue data...</span>
        </div>
      ) : null}
    </div>
  );
}
