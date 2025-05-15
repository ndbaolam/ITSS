
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Student } from "@/types/group";
import { getAvailableStudents } from "@/services/groupService";
import { CheckIcon, SearchIcon } from "lucide-react";

interface AddMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddMember: (member: Omit<Student, "role">) => void;
  existingMemberIds: string[];
  isLoading: boolean;
}

export function AddMemberDialog({
  open,
  onOpenChange,
  onAddMember,
  existingMemberIds,
  isLoading,
}: AddMemberDialogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: students = [], isLoading: isLoadingStudents } = useQuery({
    queryKey: ["availableStudents"],
    queryFn: getAvailableStudents,
    enabled: open,
  });
  
  // Filter students based on search and exclude existing members
  const filteredStudents = students
    .filter(student => !existingMemberIds.includes(student.id))
    .filter(student => 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Group Member</DialogTitle>
        </DialogHeader>
        
        <div className="relative">
          <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search for students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="max-h-[300px] overflow-y-auto">
          {isLoadingStudents ? (
            <div className="flex justify-center py-4">
              <p>Loading students...</p>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="flex justify-center py-4">
              <p className="text-muted-foreground">No students found</p>
            </div>
          ) : (
            <div className="divide-y">
              {filteredStudents.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between py-3 px-1"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={student.avatar} />
                      <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{student.name}</p>
                      <p className="text-xs text-muted-foreground">{student.email}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => onAddMember(student)}
                    disabled={isLoading}
                  >
                    <CheckIcon className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
