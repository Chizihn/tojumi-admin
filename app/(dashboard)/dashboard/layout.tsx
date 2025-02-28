"use client";

import Loader from "@/components/Loader";
import AdminSidebar from "@/components/Sidebar";
import { useEffect, useState } from "react";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [initialized, setInitialized] = useState<boolean>(false);
  // const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false);

  // const { fetchTotalUsers } = useFetchDataStore();

  // const { fetchFamilyUsers } = useFamilyStore();

  // const { fetchCarebusinessUsers } = useCarebusinessStore();

  // const { fetchStudentUsers } = useStudentStore();

  // Initialize component
  useEffect(() => {
    setInitialized(true);
  }, []);

  // Fetch all data for the admin dashboard
  // useEffect(() => {
  //   if (initialized) {
  //     const loadAllData = async () => {
  //       try {
  //         await Promise.all([
  //           fetchTotalUsers(),
  //           fetchFamilyUsers(),
  //           fetchCarebusinessUsers(),
  //           fetchStudentUsers(),
  //         ]);
  //       } catch (error) {
  //         console.error("Error loading dashboard data:", error);
  //       } finally {
  //         setIsDataLoaded(true);
  //       }
  //     };

  //     loadAllData();
  //   }
  // }, [
  //   initialized,
  //   fetchTotalUsers,
  //   fetchFamilyUsers,
  //   fetchCarebusinessUsers,
  //   fetchStudentUsers,
  // ]);

  if (!initialized) return <Loader />;

  return (
    <section className="max-h-screen w-full flex">
      {/* Sidebar */}
      <aside className="w-[20rem] h-screen hidden lg:block border-r-[5px] border-gray-100 sticky top-0">
        <AdminSidebar />
      </aside>

      {/* Main Content */}
      <div className="flex-1 min-h-screen h-screen overflow-y-auto">
        {children}
      </div>
    </section>
  );
}
