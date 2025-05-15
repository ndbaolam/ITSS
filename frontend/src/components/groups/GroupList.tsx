
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Users, Eye, Edit, Trash } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
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
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { GroupForm } from "./GroupForm";
import { Group, GroupMember } from "./GroupCard";

interface GroupListProps {
  groups: Group[];
  projectId: string;
  projectTitle?: string;
}

export function GroupList({ groups, projectId, projectTitle = "Project" }: GroupListProps) {
  const { user } = useAuth();
  const [deleteGroupId, setDeleteGroupId] = useState<string | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  
  const isMentor = user?.role === "mentor";

  const handleCreateGroup = (formData: any) => {
    // In a real app, this would be an API call
    const newGroup = {
      id: `group-${Date.now()}`,
      name: formData.name,
      description: formData.description,
      projectId,
      projectTitle,
      progress: 0,
      members: [
        { id: `leader-${Date.now()}`, name: formData.leaderName, role: "leader" as const }
      ],
    };
    
    // This would update your state with the new group in a real app
    toast.success("Group created successfully");
    setIsCreateOpen(false);
  };

  const handleEditGroup = (formData: any) => {
    if (!selectedGroup) return;
    
    // In a real app, this would update the group via an API
    toast.success("Group updated successfully");
    setIsEditOpen(false);
    setSelectedGroup(null);
  };

  const handleDeleteGroup = (groupId: string) => {
    // In a real app, this would be an API call
    toast.success("Group deleted successfully");
    setDeleteGroupId(null);
  };

  const getMemberCount = (group: Group) => {
    return group.members.length;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Project Groups</h3>
        {isMentor && (
          <Button 
            size="sm"
            onClick={() => setIsCreateOpen(true)}
            className="bg-academe-500 hover:bg-academe-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Group
          </Button>
        )}
      </div>
      
      {groups.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No groups found for this project.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {groups.map((group) => (
            <Card key={group.id} className="border-academe-100">
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <CardTitle className="text-lg">{group.name}</CardTitle>
                  <div className="flex items-center text-muted-foreground">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{getMemberCount(group)}</span>
                  </div>
                </div>
                <CardDescription className="line-clamp-2">
                  {group.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-2">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Team Leader: </span>
                    <span>{group.members.find(m => m.role === "leader")?.name || "Not assigned"}</span>
                  </div>
                  
                  <div className="flex justify-end mt-4 gap-2">
                    <Button variant="outline" size="sm" className="border-academe-200 hover:bg-academe-50">
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    {isMentor && (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => {
                            setSelectedGroup(group);
                            setIsEditOpen(true);
                          }}
                          className="border-academe-200 hover:bg-academe-50"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setDeleteGroupId(group.id)}
                          className="border-academe-200 hover:bg-academe-50"
                        >
                          <Trash className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {/* Create Group Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[500px] border-academe-200">
          <DialogHeader>
            <DialogTitle className="text-academe-700">Create New Group</DialogTitle>
          </DialogHeader>
          <GroupForm
            projectId={projectId}
            projectTitle={projectTitle}
            onSubmit={handleCreateGroup}
            onCancel={() => setIsCreateOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Group Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[500px] border-academe-200">
          <DialogHeader>
            <DialogTitle className="text-academe-700">Edit Group</DialogTitle>
          </DialogHeader>
          {selectedGroup && (
            <GroupForm
              initialData={selectedGroup}
              projectId={selectedGroup.projectId}
              projectTitle={selectedGroup.projectTitle}
              onSubmit={handleEditGroup}
              onCancel={() => setIsEditOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
      
      {/* Delete Group Confirmation Dialog */}
      <AlertDialog open={!!deleteGroupId} onOpenChange={() => setDeleteGroupId(null)}>
        <AlertDialogContent className="border-academe-200">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the group and remove all members from it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-academe-200 hover:bg-academe-50">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deleteGroupId && handleDeleteGroup(deleteGroupId)}
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
