
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TaskCard, Task } from "@/components/tasks/TaskCard";
import { ProjectCard, Project } from "@/components/projects/ProjectCard";
import { GroupCard, Group } from "@/components/groups/GroupCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();
  const [recentTasks, setRecentTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);

  // Mock data loading
  useEffect(() => {
    // Mock tasks data
    const mockTasks: Task[] = [
      {
        id: "task1",
        title: "Literature Review",
        description: "Review existing research papers on the topic and create a summary",
        status: "in-progress",
        priority: "high",
        dueDate: "2025-05-20",
        assignee: {
          id: user?.id || "user1",
          name: user?.name || "John Doe",
          avatar: user?.avatar,
        },
        projectId: "project1",
        projectTitle: "Research on Machine Learning Applications",
      },
      {
        id: "task2",
        title: "Data Collection",
        description: "Collect dataset from the provided sources",
        status: "todo",
        priority: "medium",
        dueDate: "2025-05-25",
        assignee: {
          id: user?.id || "user1",
          name: user?.name || "John Doe",
          avatar: user?.avatar,
        },
        projectId: "project1",
        projectTitle: "Research on Machine Learning Applications",
      },
    ];

    // Mock projects data
    const mockProjects: Project[] = [
      {
        id: "project1",
        title: "Research on Machine Learning Applications",
        description: "A comprehensive study of machine learning applications in healthcare",
        mentorName: "Dr. Smith",
        mentorId: "mentor1",
        teamLeaderId: user?.role === "leader" ? user?.id : "leader1",
        teamLeaderName: user?.role === "leader" ? user?.name : "Jane Leader",
        members: 4,
        status: "in-progress",
        progress: 35,
        tags: ["Machine Learning", "Healthcare", "Research"]
      }
    ];

    // Mock groups data
    const mockGroups: Group[] = [
      {
        id: "group1",
        name: "ML Research Team",
        projectId: "project1",
        projectTitle: "Research on Machine Learning Applications",
        members: [
          {
            id: user?.id || "user1",
            name: user?.name || "John Doe",
            role: user?.role === "leader" ? "leader" : "member",
            avatar: user?.avatar,
          },
          {
            id: "user2",
            name: "Alice Smith",
            role: user?.role === "leader" ? "member" : "leader",
            avatar: `https://ui-avatars.com/api/?name=Alice+Smith&background=random`,
          },
          {
            id: "user3",
            name: "Bob Johnson",
            role: "member",
            avatar: `https://ui-avatars.com/api/?name=Bob+Johnson&background=random`,
          },
          {
            id: "user4",
            name: "Carol Williams",
            role: "member",
            avatar: `https://ui-avatars.com/api/?name=Carol+Williams&background=random`,
          },
        ],
        progress: 35,
        hasUnreadMessages: true,
      }
    ];

    setRecentTasks(mockTasks);
    setProjects(mockProjects);
    setGroups(mockGroups);
  }, [user]);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name}</h1>
          <p className="text-muted-foreground">
            Here's an overview of your academic collaboration activities
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Projects</CardTitle>
              <CardDescription className="text-2xl font-bold">{projects.length}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                {user?.role === "mentor" ? "Projects you're mentoring" : "Projects you're working on"}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Groups</CardTitle>
              <CardDescription className="text-2xl font-bold">{groups.length}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                {user?.role === "mentor" ? "Groups you're supervising" : user?.role === "leader" ? "Groups you're leading" : "Groups you're a member of"}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Tasks</CardTitle>
              <CardDescription className="text-2xl font-bold">{recentTasks.length}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Active tasks assigned to you
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Deadlines</CardTitle>
              <CardDescription className="text-2xl font-bold">
                {recentTasks.filter(task => 
                  new Date(task.dueDate).getTime() - new Date().getTime() < 7 * 24 * 60 * 60 * 1000
                ).length}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Tasks due within a week
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Tasks */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Recent Tasks</CardTitle>
                <CardDescription>Your recently assigned or updated tasks</CardDescription>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link to="/dashboard/tasks">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {recentTasks.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">No tasks assigned yet</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recentTasks.map(task => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Projects & Groups */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Projects */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Projects</CardTitle>
                  <CardDescription>
                    {user?.role === "mentor" ? "Projects you're mentoring" : "Projects you're involved in"}
                  </CardDescription>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link to="/dashboard/projects">View All</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {projects.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">No projects found</p>
              ) : (
                <div className="space-y-4">
                  {projects.map(project => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Groups */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Groups</CardTitle>
                  <CardDescription>
                    Your project groups
                  </CardDescription>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link to="/dashboard/groups">View All</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {groups.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">No groups found</p>
              ) : (
                <div className="space-y-4">
                  {groups.map(group => (
                    <GroupCard key={group.id} group={group} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
