
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { ArrowLeft, Trash, UserPlus, Users } from "lucide-react";
import { GroupDetailHeader } from "@/components/groups/GroupDetailHeader";
import { GroupMemberList } from "@/components/groups/GroupMemberList";
import { AddMemberDialog } from "@/components/groups/AddMemberDialog";
import { ChangeLeaderDialog } from "@/components/groups/ChangeLeaderDialog";
import { 
  getGroupById, 
  deleteGroup, 
  addGroupMember, 
  removeGroupMember, 
  changeGroupLeader 
} from "@/services/groupService";
import { GroupMember } from "@/types/group";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";

const GroupDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const isMentor = user?.role === "mentor";
  
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);
  const [isChangeLeaderDialogOpen, setIsChangeLeaderDialogOpen] = useState(false);
  
  const { data: group, isLoading } = useQuery({
    queryKey: ["group", id],
    queryFn: () => getGroupById(id!),
    enabled: !!id
  });
  
  const deleteGroupMutation = useMutation({
    mutationFn: () => deleteGroup(id!),
    onSuccess: () => {
      toast.success("Group deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      navigate("/dashboard/groups");
    },
    onError: () => {
      toast.error("Failed to delete group");
    }
  });
  
  const addMemberMutation = useMutation({
    mutationFn: (member: Omit<GroupMember, "role">) => 
      addGroupMember(id!, member),
    onSuccess: () => {
      toast.success("Member added successfully");
      queryClient.invalidateQueries({ queryKey: ["group", id] });
      setIsAddMemberDialogOpen(false);
    },
    onError: () => {
      toast.error("Failed to add member");
    }
  });
  
  const removeMemberMutation = useMutation({
    mutationFn: (memberId: string) => removeGroupMember(id!, memberId),
    onSuccess: () => {
      toast.success("Member removed successfully");
      queryClient.invalidateQueries({ queryKey: ["group", id] });
    },
    onError: () => {
      toast.error("Failed to remove member");
    }
  });
  
  const changeLeaderMutation = useMutation({
    mutationFn: (newLeaderId: string) => changeGroupLeader(id!, newLeaderId),
    onSuccess: () => {
      toast.success("Group leader changed successfully");
      queryClient.invalidateQueries({ queryKey: ["group", id] });
      setIsChangeLeaderDialogOpen(false);
    },
    onError: () => {
      toast.error("Failed to change group leader");
    }
  });
  
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Skeleton className="h-8 w-[250px]" />
              <Skeleton className="h-4 w-[350px]" />
            </div>
            <Skeleton className="h-10 w-[100px]" />
          </div>
          
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-[150px]" />
              <Skeleton className="h-4 w-[250px]" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }
  
  if (!group) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-[70vh]">
          <h1 className="text-2xl font-bold mb-4">Group Not Found</h1>
          <p className="text-muted-foreground mb-6">The group you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate("/dashboard/groups")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Groups
          </Button>
        </div>
      </DashboardLayout>
    );
  }
  
  const handleRemoveMember = (memberId: string) => {
    // Prevent removing the leader
    const isLeader = group.members.find(m => m.id === memberId)?.role === "leader";
    if (isLeader) {
      toast.error("Cannot remove the group leader. Change the leader first.");
      return;
    }
    
    removeMemberMutation.mutate(memberId);
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <GroupDetailHeader 
          group={group} 
          onBack={() => navigate("/dashboard/groups")}
          onDelete={() => setIsDeleteDialogOpen(true)}
          canManage={isMentor}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Members
              </CardTitle>
              <CardDescription>
                {group.members.length} member{group.members.length !== 1 ? 's' : ''} in this group
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isMentor && (
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsAddMemberDialogOpen(true)}
                    >
                      <UserPlus className="mr-2 h-4 w-4" />
                      Add Member
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsChangeLeaderDialogOpen(true)}
                    >
                      Change Leader
                    </Button>
                  </div>
                )}
                
                <GroupMemberList 
                  members={group.members}
                  onRemoveMember={isMentor ? handleRemoveMember : undefined}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
              <CardDescription>Information about the associated project</CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Project Title</dt>
                  <dd className="mt-1 text-sm">{group.projectTitle}</dd>
                </div>
                {group.description && (
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Description</dt>
                    <dd className="mt-1 text-sm">{group.description}</dd>
                  </div>
                )}
                {group.progress !== undefined && (
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Progress</dt>
                    <dd className="mt-1 text-sm">{group.progress}% complete</dd>
                  </div>
                )}
              </dl>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Delete Group Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the group
              "{group.name}" and remove all members from it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteGroupMutation.mutate()}
              className="bg-destructive text-destructive-foreground"
            >
              {deleteGroupMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Add Member Dialog */}
      <AddMemberDialog
        open={isAddMemberDialogOpen}
        onOpenChange={setIsAddMemberDialogOpen}
        onAddMember={(member) => addMemberMutation.mutate(member)}
        existingMemberIds={group.members.map(m => m.id)}
        isLoading={addMemberMutation.isPending}
      />
      
      {/* Change Leader Dialog */}
      <ChangeLeaderDialog
        open={isChangeLeaderDialogOpen}
        onOpenChange={setIsChangeLeaderDialogOpen}
        members={group.members}
        currentLeaderId={group.members.find(m => m.role === "leader")?.id || ""}
        onChangeLeader={(newLeaderId) => changeLeaderMutation.mutate(newLeaderId)}
        isLoading={changeLeaderMutation.isPending}
      />
    </DashboardLayout>
  );
};

export default GroupDetail;
