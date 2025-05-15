
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export type GroupMember = {
  id: string;
  name: string;
  role: "leader" | "member";
  avatar?: string;
};

export type Group = {
  id: string;
  name: string;
  description?: string; // Added description field
  projectId: string;
  projectTitle: string;
  members: GroupMember[];
  progress: number;
  hasUnreadMessages?: boolean;
};

type GroupCardProps = {
  group: Group;
  onClick?: () => void;
};

export function GroupCard({ group, onClick }: GroupCardProps) {
  const leader = group.members.find(member => member.role === "leader");

  return (
    <Card className="card-hover overflow-hidden border-t-4 border-t-academe-500">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg flex items-center">
            {group.name}
            {group.hasUnreadMessages && (
              <Badge className="ml-2 bg-red-500 text-white h-2 w-2 p-0 rounded-full" />
            )}
          </CardTitle>
          <Badge variant="outline" className="bg-academe-100 text-academe-800 dark:bg-academe-900/30 dark:text-academe-300">
            {group.members.length} Members
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Project Progress</span>
              <span className="font-medium">{group.progress}%</span>
            </div>
            <Progress value={group.progress} className="h-2" />
          </div>
          
          <div>
            <p className="text-sm mb-2">
              <span className="text-muted-foreground">Project: </span>
              {group.projectTitle}
            </p>
            
            <p className="text-sm mb-3">
              <span className="text-muted-foreground">Team Leader: </span>
              {leader ? leader.name : "Not assigned"}
            </p>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground mb-2">Team Members:</p>
            <div className="flex -space-x-2">
              {group.members.slice(0, 5).map((member) => (
                <Avatar key={member.id} className="h-8 w-8 border-2 border-white dark:border-gray-900">
                  <AvatarImage src={member.avatar} />
                  <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                </Avatar>
              ))}
              {group.members.length > 5 && (
                <div className="h-8 w-8 flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-xs rounded-full border-2 border-white dark:border-gray-900">
                  +{group.members.length - 5}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button onClick={onClick} className="w-full">
          View Group
        </Button>
      </CardFooter>
    </Card>
  );
}
