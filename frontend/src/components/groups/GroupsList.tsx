
import { Group, GroupCard } from "@/components/groups/GroupCard";

type GroupsListProps = {
  groups: Group[];
  onGroupClick: (group: Group) => void;
};

export function GroupsList({ groups, onGroupClick }: GroupsListProps) {
  if (groups.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No groups found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {groups.map((group) => (
        <GroupCard
          key={group.id}
          group={group}
          onClick={() => onGroupClick(group)}
        />
      ))}
    </div>
  );
}
