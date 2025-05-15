
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GroupsList } from "@/components/groups/GroupsList";
import { GroupsSearchFilter } from "@/components/groups/GroupsSearchFilter";
import { Group, Project } from "@/types/group";
import { Skeleton } from "@/components/ui/skeleton";

interface GroupsContentProps {
  groups: Group[];
  projects: Project[];
  isLoading: boolean;
  selectedProjectId: string;
  onProjectFilterChange: (projectId: string) => void;
}

export function GroupsContent({ 
  groups,
  projects,
  isLoading,
  selectedProjectId,
  onProjectFilterChange
}: GroupsContentProps) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredGroups = groups.filter((group) => {
    const matchesSearch = 
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      group.projectTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.members.some(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesSearch;
  });

  const handleGroupClick = (group: Group) => {
    navigate(`/dashboard/groups/${group.id}`);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-48" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[300px] rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <GroupsSearchFilter 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        projectFilter={selectedProjectId}
        setProjectFilter={onProjectFilterChange}
        projects={projects}
      />
      
      <GroupsList 
        groups={filteredGroups} 
        onGroupClick={handleGroupClick} 
      />
    </div>
  );
}
