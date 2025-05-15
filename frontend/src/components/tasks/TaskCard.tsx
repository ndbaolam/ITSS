
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export type Task = {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "review" | "completed";
  priority: "low" | "medium" | "high";
  dueDate: string;
  assignee?: {
    id: string;
    name: string;
    avatar?: string;
  };
  projectId: string;
  projectTitle: string;
};

type TaskCardProps = {
  task: Task;
  onClick?: () => void;
  compact?: boolean;
};

export function TaskCard({ task, onClick, compact = false }: TaskCardProps) {
  const priorityColor = {
    low: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    high: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  };

  const statusColor = {
    todo: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
    "in-progress": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    review: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
    completed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  };

  const statusText = {
    todo: "To Do",
    "in-progress": "In Progress",
    review: "In Review",
    completed: "Completed",
  };

  return (
    <Card className="card-hover border-l-4" style={{ borderLeftColor: task.priority === "high" ? "#f87171" : task.priority === "medium" ? "#facc15" : "#4ade80" }}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-md">{task.title}</CardTitle>
          <Badge className={statusColor[task.status]} variant="outline">
            {statusText[task.status]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        {!compact && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {task.description}
          </p>
        )}
        <div className="flex justify-between items-center">
          <Badge className={priorityColor[task.priority]} variant="outline">
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
          </Badge>
          <span className="text-sm text-muted-foreground">
            Due: {new Date(task.dueDate).toLocaleDateString()}
          </span>
        </div>
        
        <div className="flex justify-between items-center mt-3">
          {task.assignee ? (
            <div className="flex items-center space-x-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={task.assignee.avatar} />
                <AvatarFallback>{task.assignee.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-sm">{task.assignee.name}</span>
            </div>
          ) : (
            <span className="text-sm text-muted-foreground italic">Unassigned</span>
          )}
        </div>
        
        {!compact && (
          <div className="mt-3">
            <span className="text-xs text-muted-foreground">Project: </span>
            <span className="text-xs">{task.projectTitle}</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-2">
        <Button onClick={onClick} className="w-full" variant={task.status === "completed" ? "outline" : "default"}>
          {task.status === "todo" ? "Start Task" : 
           task.status === "in-progress" ? "Submit for Review" :
           task.status === "review" ? "View Details" : "View Details"}
        </Button>
      </CardFooter>
    </Card>
  );
}
