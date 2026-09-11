import DashboardSidebar from "./_components/DashboardSidebar";
import DashboardHeader from "./_components/DashboardHeader";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <DashboardHeader />
      <div className="flex flex-1">
        <DashboardSidebar />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 lg:ml-56">
          {children}
        </main>
      </div>
    </div>
  );
}
