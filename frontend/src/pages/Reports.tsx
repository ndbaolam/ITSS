
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TaskProgressReport } from "@/components/reports/TaskProgressReport";
import { MemberFeedback } from "@/components/reports/MemberFeedback";
import { useAuth } from "@/contexts/AuthContext";
import { CreateReportButton } from "@/components/reports/CreateReportButton";

const Reports = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("progress");

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
            <p className="text-muted-foreground">
              {user?.role === "mentor" 
                ? "Generate detailed reports and provide feedback" 
                : "View progress reports and feedback"}
            </p>
          </div>
          <CreateReportButton />
        </div>
        
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-academe-50 dark:bg-academe-900/50">
            <TabsTrigger 
              value="progress" 
              className="data-[state=active]:bg-academe-200 data-[state=active]:text-academe-800 dark:data-[state=active]:bg-academe-800 dark:data-[state=active]:text-academe-100"
            >
              Task Progress
            </TabsTrigger>
            <TabsTrigger 
              value="feedback" 
              className="data-[state=active]:bg-academe-200 data-[state=active]:text-academe-800 dark:data-[state=active]:bg-academe-800 dark:data-[state=active]:text-academe-100"
            >
              Member Feedback
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="progress" className="mt-0">
            <TaskProgressReport />
          </TabsContent>
          
          <TabsContent value="feedback" className="mt-0">
            <MemberFeedback />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Reports;
