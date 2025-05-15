
import { Group, Student } from "@/types/group";
import { GroupMember } from "@/types/group";

// Base API URL - replace with your actual API URL
const API_URL = "/api";

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Something went wrong");
  }
  return response.json();
};

// Fetch all groups with optional filtering
export const getGroups = async (projectId?: string) => {
  let url = `${API_URL}/groups`;
  if (projectId) {
    url += `?projectId=${projectId}`;
  }
  
  // For now, return mock data
  // In production, use: return fetch(url).then(handleResponse);
  return mockGroups;
};

// Fetch a single group by ID
export const getGroupById = async (id: string) => {
  // In production, use: return fetch(`${API_URL}/groups/${id}`).then(handleResponse);
  return mockGroups.find(group => group.id === id) || null;
};

// Create a new group
export const createGroup = async (groupData: Partial<Group>) => {
  // In production, use:
  // return fetch(`${API_URL}/groups`, {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify(groupData),
  // }).then(handleResponse);
  
  const newGroup: Group = {
    id: `group-${Date.now()}`,
    name: groupData.name || "",
    projectId: groupData.projectId || "",
    projectTitle: groupData.projectTitle || "Unknown Project",
    members: groupData.members || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  mockGroups.push(newGroup);
  return newGroup;
};

// Update a group
export const updateGroup = async (id: string, groupData: Partial<Group>) => {
  // In production, use:
  // return fetch(`${API_URL}/groups/${id}`, {
  //   method: 'PUT',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify(groupData),
  // }).then(handleResponse);
  
  const groupIndex = mockGroups.findIndex(group => group.id === id);
  if (groupIndex !== -1) {
    mockGroups[groupIndex] = {
      ...mockGroups[groupIndex],
      ...groupData,
      updatedAt: new Date().toISOString(),
    };
    return mockGroups[groupIndex];
  }
  throw new Error("Group not found");
};

// Delete a group
export const deleteGroup = async (id: string) => {
  // In production, use:
  // return fetch(`${API_URL}/groups/${id}`, {
  //   method: 'DELETE',
  // }).then(handleResponse);
  
  const groupIndex = mockGroups.findIndex(group => group.id === id);
  if (groupIndex !== -1) {
    const deletedGroup = mockGroups.splice(groupIndex, 1)[0];
    return deletedGroup;
  }
  throw new Error("Group not found");
};

// Add a member to a group
export const addGroupMember = async (groupId: string, member: Omit<GroupMember, "role">, role: "leader" | "member" = "member") => {
  // In production, use:
  // return fetch(`${API_URL}/groups/${groupId}/members`, {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({ ...member, role }),
  // }).then(handleResponse);
  
  const groupIndex = mockGroups.findIndex(group => group.id === groupId);
  if (groupIndex !== -1) {
    const newMember: GroupMember = { ...member, role };
    mockGroups[groupIndex].members.push(newMember);
    mockGroups[groupIndex].updatedAt = new Date().toISOString();
    return mockGroups[groupIndex];
  }
  throw new Error("Group not found");
};

// Remove a member from a group
export const removeGroupMember = async (groupId: string, memberId: string) => {
  // In production, use:
  // return fetch(`${API_URL}/groups/${groupId}/members/${memberId}`, {
  //   method: 'DELETE',
  // }).then(handleResponse);
  
  const groupIndex = mockGroups.findIndex(group => group.id === groupId);
  if (groupIndex !== -1) {
    const memberIndex = mockGroups[groupIndex].members.findIndex(
      member => member.id === memberId
    );
    if (memberIndex !== -1) {
      mockGroups[groupIndex].members.splice(memberIndex, 1);
      mockGroups[groupIndex].updatedAt = new Date().toISOString();
      return mockGroups[groupIndex];
    }
  }
  throw new Error("Group or member not found");
};

// Change group leader
export const changeGroupLeader = async (groupId: string, newLeaderId: string) => {
  // In production, use:
  // return fetch(`${API_URL}/groups/${groupId}/leader`, {
  //   method: 'PUT',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({ leaderId: newLeaderId }),
  // }).then(handleResponse);
  
  const groupIndex = mockGroups.findIndex(group => group.id === groupId);
  if (groupIndex !== -1) {
    // Remove current leader role
    mockGroups[groupIndex].members = mockGroups[groupIndex].members.map(member => ({
      ...member,
      role: member.role === "leader" ? "member" : member.role,
    }));
    
    // Assign new leader
    const newLeaderIndex = mockGroups[groupIndex].members.findIndex(
      member => member.id === newLeaderId
    );
    if (newLeaderIndex !== -1) {
      mockGroups[groupIndex].members[newLeaderIndex].role = "leader";
      mockGroups[groupIndex].updatedAt = new Date().toISOString();
      return mockGroups[groupIndex];
    }
    throw new Error("New leader not found in group");
  }
  throw new Error("Group not found");
};

// Get available students (not in any group)
export const getAvailableStudents = async () => {
  // In production, use: return fetch(`${API_URL}/students/available`).then(handleResponse);
  return mockStudents;
};

// Get all projects
export const getProjects = async () => {
  // In production, use: return fetch(`${API_URL}/projects`).then(handleResponse);
  return mockProjects;
};

// Mock data for development
const mockStudents: Student[] = [
  {
    id: "student1",
    name: "Alice Smith",
    email: "alice.smith@example.com",
    avatar: `https://ui-avatars.com/api/?name=Alice+Smith&background=random`,
  },
  {
    id: "student2",
    name: "Bob Johnson",
    email: "bob.johnson@example.com",
    avatar: `https://ui-avatars.com/api/?name=Bob+Johnson&background=random`,
  },
  {
    id: "student3",
    name: "Carol Williams",
    email: "carol.williams@example.com",
    avatar: `https://ui-avatars.com/api/?name=Carol+Williams&background=random`,
  },
  {
    id: "student4",
    name: "Dave Brown",
    email: "dave.brown@example.com",
    avatar: `https://ui-avatars.com/api/?name=Dave+Brown&background=random`,
  },
  {
    id: "student5",
    name: "Eve Taylor",
    email: "eve.taylor@example.com",
    avatar: `https://ui-avatars.com/api/?name=Eve+Taylor&background=random`,
  },
];

const mockProjects = [
  { id: "project1", title: "Research on Machine Learning Applications" },
  { id: "project2", title: "Sustainable Energy Solutions" },
  { id: "project3", title: "Web Development Framework" },
];

const mockGroups: Group[] = [
  {
    id: "group1",
    name: "ML Research Team",
    projectId: "project1",
    projectTitle: "Research on Machine Learning Applications",
    members: [
      {
        id: "student1",
        name: "Alice Smith",
        email: "alice.smith@example.com",
        role: "leader",
        avatar: `https://ui-avatars.com/api/?name=Alice+Smith&background=random`,
      },
      {
        id: "student2",
        name: "Bob Johnson",
        email: "bob.johnson@example.com",
        role: "member",
        avatar: `https://ui-avatars.com/api/?name=Bob+Johnson&background=random`,
      },
      {
        id: "student3",
        name: "Carol Williams",
        email: "carol.williams@example.com",
        role: "member",
        avatar: `https://ui-avatars.com/api/?name=Carol+Williams&background=random`,
      },
    ],
    progress: 35,
  },
  {
    id: "group2",
    name: "Sustainable Energy Team",
    projectId: "project2",
    projectTitle: "Sustainable Energy Solutions",
    members: [
      {
        id: "student4",
        name: "Dave Brown",
        email: "dave.brown@example.com",
        role: "leader",
        avatar: `https://ui-avatars.com/api/?name=Dave+Brown&background=random`,
      },
      {
        id: "student5",
        name: "Eve Taylor",
        email: "eve.taylor@example.com",
        role: "member",
        avatar: `https://ui-avatars.com/api/?name=Eve+Taylor&background=random`,
      },
    ],
    progress: 15,
  },
];
