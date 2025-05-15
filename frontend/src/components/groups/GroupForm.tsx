
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Group } from "./GroupCard";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  name: z.string().min(3, "Group name must be at least 3 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  leaderName: z.string().min(3, "Team leader name is required."),
});

type GroupFormValues = z.infer<typeof formSchema>;

// Mock data for leader name suggestions
const mockLeaders = [
  "Jane Doe",
  "John Smith",
  "Mike Johnson",
  "Sara Williams",
  "Alex Brown",
  "Taylor Green",
  "Chris Evans",
  "Robin Lee"
];

interface GroupFormProps {
  initialData?: Partial<Group>;
  projectId: string;
  projectTitle: string;
  onSubmit: (data: GroupFormValues) => void;
  onCancel: () => void;
}

export function GroupForm({ initialData, projectId, projectTitle, onSubmit, onCancel }: GroupFormProps) {
  const [loading, setLoading] = useState(false);
  const [leaderSuggestions, setLeaderSuggestions] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const form = useForm<GroupFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      leaderName: initialData?.members?.find(m => m.role === "leader")?.name || "",
    },
  });

  // Filter leader suggestions based on input
  useEffect(() => {
    if (searchTerm) {
      // In a real app, this would be an API call
      const filteredLeaders = mockLeaders.filter(leader => 
        leader.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setLeaderSuggestions(filteredLeaders);
    } else {
      setLeaderSuggestions([]);
    }
  }, [searchTerm]);

  const handleSubmit = async (data: GroupFormValues) => {
    try {
      setLoading(true);
      // In a real app, we'd make an API call here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulates API call
      onSubmit(data);
      toast.success(initialData ? "Group updated" : "Group created");
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleLeaderInputChange = (value: string) => {
    form.setValue("leaderName", value);
    setSearchTerm(value);
    if (value) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const selectLeader = (leader: string) => {
    form.setValue("leaderName", leader);
    setShowSuggestions(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Group Name</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter group name" 
                  {...field} 
                  className="border-academe-300 focus:ring-academe-400"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter group description" 
                  className="resize-none min-h-[100px] border-academe-300 focus:ring-academe-400" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="leaderName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Team Leader's Name</FormLabel>
              <div className="relative">
                <FormControl>
                  <Input 
                    placeholder="Start typing leader name" 
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      handleLeaderInputChange(e.target.value);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    className="border-academe-300 focus:ring-academe-400"
                  />
                </FormControl>
                {showSuggestions && leaderSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-academe-200 rounded-md shadow-lg max-h-60 overflow-auto">
                    {leaderSuggestions.map((leader) => (
                      <div 
                        key={leader} 
                        className="px-4 py-2 hover:bg-academe-100 cursor-pointer"
                        onClick={() => selectLeader(leader)}
                      >
                        {leader}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => {
              setShowSuggestions(false);
              onCancel();
            }}
            disabled={loading}
            className="border-academe-300 hover:bg-academe-50"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={loading}
            className="bg-academe-500 hover:bg-academe-600"
          >
            {loading ? "Saving..." : initialData ? "Update Group" : "Create Group"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
