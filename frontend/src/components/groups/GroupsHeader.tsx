
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Plus } from "lucide-react";

interface GroupsHeaderProps {
  onCreateGroup: () => void;
}

export function GroupsHeader({ onCreateGroup }: GroupsHeaderProps) {
  const { user } = useAuth();
  const isMentor = user?.role === "mentor";

  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Groups</h1>
        <p className="text-muted-foreground">
          {isMentor 
            ? "Manage student groups for projects" 
            : user?.role === "leader"
              ? "Lead and manage your teams"
              : "View your project groups"}
        </p>
      </div>
      
      {isMentor && (
        <Button 
          onClick={onCreateGroup}
          className="bg-academe-500 hover:bg-academe-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Group
        </Button>
      )}
    </div>
  );
}
