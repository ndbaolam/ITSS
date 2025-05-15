
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GroupMember } from "@/types/group";
import { Label } from "@/components/ui/label";

interface ChangeLeaderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  members: GroupMember[];
  currentLeaderId: string;
  onChangeLeader: (newLeaderId: string) => void;
  isLoading: boolean;
}

export function ChangeLeaderDialog({
  open,
  onOpenChange,
  members,
  currentLeaderId,
  onChangeLeader,
  isLoading,
}: ChangeLeaderDialogProps) {
  const [selectedLeaderId, setSelectedLeaderId] = useState(currentLeaderId);
  
  const handleSubmit = () => {
    if (selectedLeaderId && selectedLeaderId !== currentLeaderId) {
      onChangeLeader(selectedLeaderId);
    } else {
      onOpenChange(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Change Group Leader</DialogTitle>
        </DialogHeader>
        
        <RadioGroup
          value={selectedLeaderId}
          onValueChange={setSelectedLeaderId}
          className="space-y-3"
        >
          {members.map((member) => (
            <div
              key={member.id}
              className={`flex items-center space-x-2 rounded-md border p-3 ${
                member.id === currentLeaderId ? "bg-muted/50" : ""
              }`}
            >
              <RadioGroupItem value={member.id} id={`leader-${member.id}`} />
              <Label
                htmlFor={`leader-${member.id}`}
                className="flex flex-1 items-center gap-3 cursor-pointer"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={member.avatar} />
                  <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{member.name}</p>
                  <p className="text-xs text-muted-foreground">{member.email}</p>
                </div>
                {member.id === currentLeaderId && (
                  <span className="ml-auto text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    Current Leader
                  </span>
                )}
              </Label>
            </div>
          ))}
        </RadioGroup>
        
        <div className="flex justify-end gap-2 pt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading || selectedLeaderId === currentLeaderId}
          >
            {isLoading ? "Changing..." : "Confirm Change"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
