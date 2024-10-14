import Header from "@/components/Header";
import HiveDashboard from "@/components/HiveDashboard";
import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="p-4">
        <HiveDashboard />
      </main>
    </div>
  );
};

export default Home;
