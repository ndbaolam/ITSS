
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Project, Student } from "@/types/group";
import { createGroup, getAvailableStudents } from "@/services/groupService";

const formSchema = z.object({
  name: z.string().min(3, "Group name must be at least 3 characters"),
  projectId: z.string().min(1, "Project selection is required"),
  leaderId: z.string().min(1, "Group leader selection is required"),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateGroupFormProps {
  projects: Project[];
  onSuccess: () => void;
  onCancel: () => void;
}

export function CreateGroupForm({ projects, onSuccess, onCancel }: CreateGroupFormProps) {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      projectId: "",
      leaderId: "",
    },
  });
  
  const { data: students = [], isLoading: isLoadingStudents } = useQuery({
    queryKey: ["availableStudents"],
    queryFn: () => getAvailableStudents(),
  });
  
  const selectedProjectId = form.watch("projectId");
  
  const selectedProject = projects.find(p => p.id === selectedProjectId);
  
  const createGroupMutation = useMutation({
    mutationFn: (data: FormValues) => {
      const selectedLeader = students.find(s => s.id === data.leaderId);
      if (!selectedLeader) {
        throw new Error("Selected leader not found");
      }
      
      const groupData = {
        name: data.name,
        projectId: data.projectId,
        projectTitle: selectedProject?.title || "",
        members: [{
          id: selectedLeader.id,
          name: selectedLeader.name,
          email: selectedLeader.email,
          role: "leader" as const,
          avatar: selectedLeader.avatar,
        }],
      };
      
      return createGroup(groupData);
    },
    onSuccess: () => {
      toast.success("Group created successfully");
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      onSuccess();
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to create group");
    },
  });
  
  function onSubmit(values: FormValues) {
    createGroupMutation.mutate(values);
  }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Group Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter group name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="projectId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={loading || projects.length === 0}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a project" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="leaderId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Group Leader</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={loading || isLoadingStudents || students.length === 0}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select group leader" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {students.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.name} ({student.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end gap-2 pt-4">
          <Button 
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading || createGroupMutation.isPending}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            disabled={loading || createGroupMutation.isPending}
            className="bg-academe-500 hover:bg-academe-600"
          >
            {createGroupMutation.isPending ? "Creating..." : "Create Group"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
