
import { useState } from "react";
import { TaskCard, Task } from "./TaskCard";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useAuth } from "@/contexts/AuthContext";

type TaskBoardProps = {
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
  onTaskStatusChange?: (taskId: string, newStatus: Task['status']) => void;
};

export function TaskBoard({ tasks, onTaskClick, onTaskStatusChange }: TaskBoardProps) {
  const { user } = useAuth();
  
  // Create columns
  const columns = {
    todo: {
      id: "todo",
      title: "To Do",
      taskIds: tasks.filter(task => task.status === "todo").map(task => task.id)
    },
    inProgress: {
      id: "in-progress",
      title: "In Progress",
      taskIds: tasks.filter(task => task.status === "in-progress").map(task => task.id)
    },
    review: {
      id: "review",
      title: "In Review",
      taskIds: tasks.filter(task => task.status === "review").map(task => task.id)
    },
    completed: {
      id: "completed",
      title: "Completed",
      taskIds: tasks.filter(task => task.status === "completed").map(task => task.id)
    }
  };

  // Create a map for quick task lookup
  const tasksMap = tasks.reduce((acc, task) => {
    acc[task.id] = task;
    return acc;
  }, {} as Record<string, Task>);

  const handleDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;

    // Dropped outside the list
    if (!destination) return;
    
    // Dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    
    // Only team leaders can change task status
    if (user?.role !== "leader" && source.droppableId !== destination.droppableId) {
      return;
    }

    // Call the callback if provided
    if (onTaskStatusChange && source.droppableId !== destination.droppableId) {
      onTaskStatusChange(draggableId, destination.droppableId as Task['status']);
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.values(columns).map(column => (
          <div key={column.id} className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
            <h3 className="font-medium mb-4 flex justify-between items-center">
              {column.title}
              <span className="bg-gray-200 dark:bg-gray-800 text-sm px-2 py-1 rounded-full">
                {column.taskIds.length}
              </span>
            </h3>
            <Droppable droppableId={column.id}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="space-y-3 min-h-[200px]"
                >
                  {column.taskIds.map((taskId, index) => {
                    const task = tasksMap[taskId];
                    return (
                      <Draggable key={taskId} draggableId={taskId} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <TaskCard
                              task={task}
                              onClick={() => onTaskClick && onTaskClick(task)}
                              compact
                            />
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}
