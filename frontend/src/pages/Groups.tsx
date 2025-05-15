
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { GroupsHeader } from "@/components/groups/GroupsHeader";
import { GroupsContent } from "@/components/groups/GroupsContent";
import { CreateGroupForm } from "@/components/groups/CreateGroupForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getGroups, getProjects } from "@/services/groupService";
import { Group } from "@/types/group";

const Groups = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("all");
  
  const { data: groups = [], isLoading: isLoadingGroups } = useQuery({
    queryKey: ["groups", selectedProjectId],
    queryFn: () => getGroups(selectedProjectId === "all" ? undefined : selectedProjectId)
  });
  
  const { data: projects = [], isLoading: isLoadingProjects } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects
  });
  
  const handleCreateSuccess = () => {
    setIsCreateDialogOpen(false);
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <GroupsHeader 
          onCreateGroup={() => setIsCreateDialogOpen(true)}
        />
        
        <GroupsContent 
          groups={groups}
          projects={projects}
          isLoading={isLoadingGroups || isLoadingProjects}
          selectedProjectId={selectedProjectId}
          onProjectFilterChange={setSelectedProjectId}
        />
      </div>
      
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Create New Group</DialogTitle>
          </DialogHeader>
          <CreateGroupForm 
            projects={projects}
            onSuccess={handleCreateSuccess}
            onCancel={() => setIsCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Groups;
