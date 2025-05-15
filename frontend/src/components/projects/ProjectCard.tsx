
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Eye, Edit, Trash, Users, MoreVertical } from "lucide-react";

export type Project = {
  id: string;
  title: string;
  description: string;
  mentorName: string;
  mentorId: string;
  teamLeaderId?: string;
  teamLeaderName?: string;
  members: number;
  status: "open" | "in-progress" | "completed";
  progress: number;
  tags: string[];
};

type ProjectCardProps = {
  project: Project;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  userRole?: string;
  userId?: string;
};

export function ProjectCard({ 
  project, 
  onClick, 
  onEdit, 
  onDelete,
  userRole = "student",
  userId = "",
}: ProjectCardProps) {
  const statusColor = {
    open: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    "in-progress": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    completed: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
  };
  
  const isUserMentor = userRole === "mentor";
  const isUserOwner = isUserMentor && userId === project.mentorId;
  const isUserLeader = userRole === "leader" && userId === project.teamLeaderId;
  
  return (
    <Card className="card-hover overflow-hidden border-t-4 border-t-academe-400 flex flex-col">
      <CardHeader className="pb-2 flex flex-row justify-between items-start">
        <div>
          <CardTitle className="text-lg">{project.title}</CardTitle>
          <CardDescription className="text-sm line-clamp-2">
            {project.description}
          </CardDescription>
        </div>
        
        {isUserOwner && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onClick}>
                <Eye className="h-4 w-4 mr-2" /> View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onEdit}>
                <Edit className="h-4 w-4 mr-2" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={onDelete}
                className="text-destructive focus:text-destructive"
              >
                <Trash className="h-4 w-4 mr-2" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        
        <Badge className={statusColor[project.status]} variant="outline">
          {project.status === "in-progress" ? "In Progress" : project.status.charAt(0).toUpperCase() + project.status.slice(1)}
        </Badge>
      </CardHeader>
      <CardContent className="pb-2 flex-1">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{project.progress}%</span>
            </div>
            <Progress value={project.progress} className="h-2" />
          </div>
          
          <div className="flex flex-wrap gap-1">
            {project.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          
          <div className="flex justify-between text-sm">
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1 text-muted-foreground" />
              <span>{project.members} members</span>
            </div>
            <div>
              <span className="text-muted-foreground">Mentor: </span>
              <span>{project.mentorName}</span>
            </div>
          </div>
          
          {project.teamLeaderName && (
            <div className="text-sm">
              <span className="text-muted-foreground">Team Leader: </span>
              <span>{project.teamLeaderName}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button onClick={onClick} className="w-full">
          {isUserOwner 
            ? "Manage Project" 
            : isUserLeader
              ? "Manage Team"
              : project.status === "open"
                ? "Join Project"
                : "View Details"
          }
        </Button>
      </CardFooter>
    </Card>
  );
}
