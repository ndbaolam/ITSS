
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { GroupMember } from "@/types/group";
import { UserMinus } from "lucide-react";

interface GroupMemberListProps {
  members: GroupMember[];
  onRemoveMember?: (memberId: string) => void;
}

export function GroupMemberList({ members, onRemoveMember }: GroupMemberListProps) {
  const sortedMembers = [...members].sort((a, b) => {
    // Leaders first
    if (a.role === "leader" && b.role !== "leader") return -1;
    if (a.role !== "leader" && b.role === "leader") return 1;
    
    // Then alphabetically by name
    return a.name.localeCompare(b.name);
  });

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Member</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          {onRemoveMember && <TableHead className="w-[80px]">Actions</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedMembers.map((member) => (
          <TableRow key={member.id}>
            <TableCell className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={member.avatar} />
                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span>{member.name}</span>
            </TableCell>
            <TableCell>{member.email}</TableCell>
            <TableCell>
              {member.role === "leader" ? (
                <span className="font-medium text-primary">Leader</span>
              ) : (
                "Member"
              )}
            </TableCell>
            {onRemoveMember && (
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveMember(member.id)}
                  disabled={member.role === "leader"}
                  title={member.role === "leader" ? "Cannot remove leader" : "Remove member"}
                >
                  <UserMinus className="h-4 w-4" />
                </Button>
              </TableCell>
            )}
          </TableRow>
        ))}
        
        {members.length === 0 && (
          <TableRow>
            <TableCell colSpan={onRemoveMember ? 4 : 3} className="text-center py-4 text-muted-foreground">
              No members found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
