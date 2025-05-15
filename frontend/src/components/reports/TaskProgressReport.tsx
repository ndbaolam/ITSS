
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// Mock data
const mockProjects = [
  { id: "project1", name: "Research on Machine Learning Applications" },
  { id: "project2", name: "Sustainable Energy Solutions" },
  { id: "project3", name: "Mobile App Development" },
];

const mockGroups = [
  { id: "group1", name: "ML Analysis Team", projectId: "project1" },
  { id: "group2", name: "Data Collection Team", projectId: "project1" },
  { id: "group3", name: "Energy Research Team", projectId: "project2" },
];

const mockTaskProgress = [
  { name: "Todo", value: 4 },
  { name: "In Progress", value: 8 },
  { name: "In Review", value: 3 },
  { name: "Completed", value: 12 },
];

const mockTimeData = [
  { name: "Week 1", planned: 5, actual: 4 },
  { name: "Week 2", planned: 8, actual: 7 },
  { name: "Week 3", planned: 10, actual: 6 },
  { name: "Week 4", planned: 12, actual: 10 },
];

export function TaskProgressReport() {
  const { user } = useAuth();
  const [selectedProject, setSelectedProject] = useState("project1");
  const [selectedGroup, setSelectedGroup] = useState("");
  
  const isMentor = user?.role === "mentor";
  const filteredGroups = mockGroups.filter(group => group.projectId === selectedProject);

  // When project changes, reset group selection
  const handleProjectChange = (value: string) => {
    setSelectedProject(value);
    setSelectedGroup("");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/2">
          <Select 
            value={selectedProject} 
            onValueChange={handleProjectChange}
          >
            <SelectTrigger className="border-academe-300 focus:ring-academe-400">
              <SelectValue placeholder="Select Project" />
            </SelectTrigger>
            <SelectContent>
              {mockProjects.map(project => (
                <SelectItem key={project.id} value={project.id}>{project.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="w-full md:w-1/2">
          <Select 
            value={selectedGroup} 
            onValueChange={setSelectedGroup}
            disabled={filteredGroups.length === 0}
          >
            <SelectTrigger className="border-academe-300 focus:ring-academe-400">
              <SelectValue placeholder={filteredGroups.length ? "Select Group (Optional)" : "No groups available"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Groups</SelectItem>
              {filteredGroups.map(group => (
                <SelectItem key={group.id} value={group.id}>{group.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-academe-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tasks To Do</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockTaskProgress[0].value}</div>
          </CardContent>
        </Card>
        
        <Card className="border-academe-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tasks In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockTaskProgress[1].value}</div>
          </CardContent>
        </Card>
        
        <Card className="border-academe-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tasks In Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockTaskProgress[2].value}</div>
          </CardContent>
        </Card>
        
        <Card className="border-academe-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tasks Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockTaskProgress[3].value}</div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="border-academe-100">
        <CardHeader>
          <CardTitle>Project Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between">
                <div className="text-sm font-medium">Overall Completion</div>
                <div className="text-sm font-medium text-academe-600">44%</div>
              </div>
              <Progress value={44} className="h-2 mt-2" />
            </div>
            
            <div className="h-[300px] mt-8">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={mockTaskProgress}
                  margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="Number of Tasks" fill="#9b87f5" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="h-[300px] mt-8">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={mockTimeData}
                  margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="planned" name="Planned Tasks" fill="#9b87f5" />
                  <Bar dataKey="actual" name="Completed Tasks" fill="#7E69AB" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
