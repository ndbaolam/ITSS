import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ProjectList } from "@/components/projects/ProjectList";
import { Project } from "@/components/projects/ProjectCard";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProjectForm } from "@/components/projects/ProjectForm";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Projects = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
  // Mock data loading
  useEffect(() => {
    // Generate mock project data
    const mockProjects: Project[] = [
      {
        id: "project1",
        title: "Research on Machine Learning Applications",
        description: "A comprehensive study of machine learning applications in healthcare",
        mentorName: "Dr. Smith",
        mentorId: "mentor1",
        teamLeaderId: user?.role === "leader" ? user.id : "leader1",
        teamLeaderName: user?.role === "leader" ? user.name : "Jane Leader",
        members: 4,
        status: "in-progress",
        progress: 35,
        tags: ["Machine Learning", "Healthcare", "Research"]
      },
      {
        id: "project2",
        title: "Sustainable Energy Solutions",
        description: "Exploring renewable energy sources and their implementation in urban settings",
        mentorName: "Dr. Johnson",
        mentorId: "mentor2",
        teamLeaderId: "leader2",
        teamLeaderName: "Mike Stewart",
        members: 5,
        status: "open",
        progress: 0,
        tags: ["Renewable Energy", "Sustainability", "Urban Planning"]
      },
      {
        id: "project3",
        title: "Mobile App Development",
        description: "Creating a mobile application for student mental health support",
        mentorName: user?.role === "mentor" ? user.name : "Dr. Williams",
        mentorId: user?.role === "mentor" ? user.id : "mentor3",
        members: 3,
        status: "open",
        progress: 0,
        tags: ["Mobile Development", "Mental Health", "Student Support"]
      },
      {
        id: "project4",
        title: "Data Analysis of Student Performance",
        description: "Analyzing factors affecting student academic performance",
        mentorName: "Dr. Brown",
        mentorId: "mentor4",
        members: 2,
        status: "completed",
        progress: 100,
        tags: ["Data Analysis", "Education", "Statistics"]
      }
    ];

    setProjects(mockProjects);
  }, [user]);

  const handleProjectClick = (project: Project) => {
    navigate(`/dashboard/projects/${project.id}`);
  };

  // Handle project creation
  const handleCreateProject = (projectData: any) => {
    // Create new project object
    const newProject: Project = {
      id: `project${projects.length + 1}`,
      title: projectData.title,
      description: projectData.description,
      mentorName: user?.role === "mentor" ? user.name : projectData.mentorName,
      mentorId: user?.role === "mentor" ? user.id : `mentor${projects.length + 1}`,
      teamLeaderName: projectData.teamLeaderName,
      teamLeaderId: projectData.teamLeaderId || `leader${projects.length + 1}`,
      members: 0,
      status: "open",
      progress: 0,
      tags: projectData.tags || []
    };
    
    // Add the new project to the list
    setProjects([...projects, newProject]);
    setIsCreateDialogOpen(false);
    toast.success("Project created successfully");
  };

  const handleEditProject = (projectData: any) => {
    if (!selectedProject) return;
    
    // Update the project
    const updatedProjects = projects.map(project =>
      project.id === selectedProject.id
        ? {
            ...project,
            title: projectData.title,
            description: projectData.description,
            teamLeaderName: projectData.teamLeaderName,
            teamLeaderId: projectData.teamLeaderId || project.teamLeaderId,
            tags: projectData.tags || project.tags
          }
        : project
    );
    
    setProjects(updatedProjects);
    setIsEditDialogOpen(false);
    setSelectedProject(null);
    toast.success("Project updated successfully");
  };

  const handleDeleteProject = () => {
    if (!selectedProject) return;
    
    // Remove the project
    const filteredProjects = projects.filter(project => project.id !== selectedProject.id);
    setProjects(filteredProjects);
    setIsDeleteDialogOpen(false);
    setSelectedProject(null);
    toast.success("Project deleted successfully");
  };

  const handleEditClick = (project: Project) => {
    setSelectedProject(project);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (project: Project) => {
    setSelectedProject(project);
    setIsDeleteDialogOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
            <p className="text-muted-foreground">
              {user?.role === "mentor" 
                ? "Create and manage academic projects" 
                : user?.role === "leader"
                  ? "Lead and organize your project teams"
                  : "Browse and join academic projects"}
            </p>
          </div>
          
          {user?.role === "mentor" && (
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Project
            </Button>
          )}
        </div>
        
        <ProjectList 
          projects={projects}
          onProjectClick={handleProjectClick}
          onEditClick={handleEditClick}
          onDeleteClick={handleDeleteClick}
          userRole={user?.role || "student"}
          userId={user?.id || ""}
        />
      </div>
      
      {/* Create Project Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
          </DialogHeader>
          <ProjectForm 
            onSubmit={handleCreateProject}
            onCancel={() => setIsCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      {/* Edit Project Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
          </DialogHeader>
          {selectedProject && (
            <ProjectForm 
              initialData={selectedProject}
              onSubmit={handleEditProject}
              onCancel={() => setIsEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the project
              and all associated tasks and groups.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteProject}
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default Projects;
