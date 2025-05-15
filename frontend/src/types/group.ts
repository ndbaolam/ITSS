
export interface GroupMember {
  id: string;
  name: string;
  email: string;
  role: "leader" | "member";
  avatar?: string;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  projectId: string;
  projectTitle: string;
  members: GroupMember[];
  progress?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Project {
  id: string;
  title: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}
