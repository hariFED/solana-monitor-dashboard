// src/app/page.tsx
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import OverviewCard from "@/components/dashboard/OverviewCard";
import SuspiciousList from "@/components/dashboard/SuspiciousList";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <Sidebar />
      <div className="flex flex-col flex-grow md:ml-64"> {/* Adjust margin-left to match sidebar width */}
        <Topbar />
        <main className="flex-1 p-4 pt-20 md:p-6 md:pt-20"> {/* Add padding top for fixed Topbar */}
          {/* Grid Layout for Content */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
            {/* Overview Card takes one column */}
            <div className="lg:col-span-1">
              <OverviewCard />
            </div>
            {/* Add more small cards here if needed */}
            {/* Example placeholder cards */}
            {/*
             <Card className="lg:col-span-1">
                <CardHeader><CardTitle className="text-sm font-medium">Active Wallets</CardTitle></CardHeader>
                <CardContent><div className="text-2xl font-bold">589</div></CardContent>
            </Card>
            <Card className="lg:col-span-1">
                <CardHeader><CardTitle className="text-sm font-medium">Network TPS</CardTitle></CardHeader>
                <CardContent><div className="text-2xl font-bold">2,150</div></CardContent>
            </Card>
            */}
          </div>

          {/* Suspicious List taking full width (or spanning multiple columns) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <SuspiciousList />
          </div>

        </main>
      </div>
    </div>
  );
}