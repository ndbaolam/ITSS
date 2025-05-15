
import { Button } from "@/components/ui/button";
import { Group } from "@/types/group";
import { ArrowLeft, Trash } from "lucide-react";

interface GroupDetailHeaderProps {
  group: Group;
  onBack: () => void;
  onDelete: () => void;
  canManage: boolean;
}

export function GroupDetailHeader({ group, onBack, onDelete, canManage }: GroupDetailHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="h-8 w-8 p-0"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
          <h2 className="text-2xl font-bold">{group.name}</h2>
        </div>
        <p className="text-muted-foreground">
          Project: {group.projectTitle}
        </p>
      </div>
      
      {canManage && (
        <Button 
          variant="destructive"
          size="sm"
          onClick={onDelete}
        >
          <Trash className="mr-2 h-4 w-4" />
          Delete Group
        </Button>
      )}
    </div>
  );
}
