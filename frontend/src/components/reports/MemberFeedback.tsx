
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Mock data
const mockProjects = [
  { id: "project1", name: "Research on Machine Learning Applications" },
  { id: "project2", name: "Sustainable Energy Solutions" },
  { id: "project3", name: "Mobile App Development" },
];

const mockGroups = [
  { id: "group1", name: "ML Analysis Team", projectId: "project1" },
  { id: "group2", name: "Data Collection Team", projectId: "project1" },
  { id: "group3", name: "Energy Research Team", projectId: "project2" },
];

const mockMembers = [
  { 
    id: "member1", 
    name: "Jane Doe", 
    role: "Team Member",
    avatar: `https://ui-avatars.com/api/?name=Jane+Doe&background=random`,
    groupId: "group1",
    performance: "excellent",
    feedbacks: [
      { id: "fb1", text: "Excellent contribution to data collection task", date: "2025-05-12", from: "Dr. Smith" },
      { id: "fb2", text: "Very thorough analysis work", date: "2025-05-08", from: "Team Leader" },
    ]
  },
  { 
    id: "member2", 
    name: "John Smith", 
    role: "Team Leader",
    avatar: `https://ui-avatars.com/api/?name=John+Smith&background=random`,
    groupId: "group1",
    performance: "good",
    feedbacks: [
      { id: "fb3", text: "Good leadership skills", date: "2025-05-10", from: "Dr. Smith" },
    ]
  },
  { 
    id: "member3", 
    name: "Alice Johnson", 
    role: "Team Member",
    avatar: `https://ui-avatars.com/api/?name=Alice+Johnson&background=random`,
    groupId: "group2",
    performance: "satisfactory",
    feedbacks: []
  },
];

// Form schema for feedback
const feedbackSchema = z.object({
  text: z.string().min(10, "Feedback must be at least 10 characters"),
  performance: z.string(),
});

export function MemberFeedback() {
  const { user } = useAuth();
  const [selectedProject, setSelectedProject] = useState("project1");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedMember, setSelectedMember] = useState<typeof mockMembers[0] | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const isMentor = user?.role === "mentor";
  
  const filteredGroups = mockGroups.filter(group => group.projectId === selectedProject);
  const filteredMembers = mockMembers.filter(member => 
    (!selectedGroup || member.groupId === selectedGroup)
  );

  // Form setup
  const form = useForm<z.infer<typeof feedbackSchema>>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      text: "",
      performance: "good",
    },
  });

  // When project changes, reset group selection
  const handleProjectChange = (value: string) => {
    setSelectedProject(value);
    setSelectedGroup("");
  };

  const handleMemberSelect = (member: typeof mockMembers[0]) => {
    setSelectedMember(member);
  };

  const handleSubmitFeedback = (data: z.infer<typeof feedbackSchema>) => {
    if (!selectedMember) return;
    
    // In a real app, this would be an API call
    toast.success("Feedback submitted successfully");
    setIsDialogOpen(false);
    form.reset();
  };

  const getPerformanceBadge = (performance: string) => {
    const badgeClasses = {
      excellent: "bg-academe-100 text-academe-800 dark:bg-academe-900/30 dark:text-academe-300",
      good: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      satisfactory: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
      needsImprovement: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    };
    
    return badgeClasses[performance as keyof typeof badgeClasses] || badgeClasses.satisfactory;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/2">
          <Select 
            value={selectedProject} 
            onValueChange={handleProjectChange}
          >
            <SelectTrigger className="border-academe-300 focus:ring-academe-400">
              <SelectValue placeholder="Select Project" />
            </SelectTrigger>
            <SelectContent>
              {mockProjects.map(project => (
                <SelectItem key={project.id} value={project.id}>{project.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="w-full md:w-1/2">
          <Select 
            value={selectedGroup} 
            onValueChange={setSelectedGroup}
            disabled={filteredGroups.length === 0}
          >
            <SelectTrigger className="border-academe-300 focus:ring-academe-400">
              <SelectValue placeholder={filteredGroups.length ? "Select Group (Optional)" : "No groups available"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Groups</SelectItem>
              {filteredGroups.map(group => (
                <SelectItem key={group.id} value={group.id}>{group.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {filteredMembers.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No members found for the selected project/group.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMembers.map(member => (
            <Card key={member.id} className="border-academe-100 hover:border-academe-300 transition-colors cursor-pointer" onClick={() => handleMemberSelect(member)}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{member.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                    </div>
                  </div>
                  <Badge className={getPerformanceBadge(member.performance)}>
                    {member.performance.charAt(0).toUpperCase() + member.performance.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Recent Feedback:</h4>
                    {member.feedbacks.length > 0 ? (
                      <div className="space-y-2">
                        {member.feedbacks.slice(0, 1).map(feedback => (
                          <div key={feedback.id} className="bg-muted p-3 rounded-md text-sm">
                            <p>"{feedback.text}"</p>
                            <div className="mt-1 text-xs text-muted-foreground">
                              {feedback.from} - {new Date(feedback.date).toLocaleDateString()}
                            </div>
                          </div>
                        ))}
                        {member.feedbacks.length > 1 && (
                          <p className="text-xs text-muted-foreground">+{member.feedbacks.length - 1} more feedback entries</p>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No feedback yet</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {selectedMember && (
        <Dialog open={!!selectedMember} onOpenChange={(open) => !open && setSelectedMember(null)}>
          <DialogContent className="sm:max-w-[600px] border-academe-200">
            <DialogHeader>
              <DialogTitle className="text-academe-700">Member Details: {selectedMember.name}</DialogTitle>
            </DialogHeader>
            
            <div className="mt-4 space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedMember.avatar} />
                  <AvatarFallback>{selectedMember.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">{selectedMember.name}</h3>
                  <p className="text-muted-foreground">{selectedMember.role}</p>
                  <Badge className={getPerformanceBadge(selectedMember.performance)}>
                    {selectedMember.performance.charAt(0).toUpperCase() + selectedMember.performance.slice(1)}
                  </Badge>
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-medium mb-3">Feedback History</h4>
                {selectedMember.feedbacks.length > 0 ? (
                  <div className="space-y-3">
                    {selectedMember.feedbacks.map(feedback => (
                      <div key={feedback.id} className="bg-muted p-4 rounded-md">
                        <p>"{feedback.text}"</p>
                        <div className="mt-2 text-sm text-muted-foreground">
                          {feedback.from} - {new Date(feedback.date).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No feedback recorded yet</p>
                )}
              </div>
              
              {isMentor && (
                <div className="pt-4">
                  <Button 
                    onClick={() => {
                      setIsDialogOpen(true);
                    }}
                    className="w-full bg-academe-500 hover:bg-academe-600"
                  >
                    Add Feedback
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Feedback Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px] border-academe-200">
          <DialogHeader>
            <DialogTitle className="text-academe-700">
              Provide Feedback for {selectedMember?.name}
            </DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmitFeedback)} className="space-y-6">
              <FormField
                control={form.control}
                name="text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Feedback</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter your feedback..." 
                        className="min-h-[120px] border-academe-300 focus:ring-academe-400" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="performance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Performance Rating</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-academe-300 focus:ring-academe-400">
                          <SelectValue placeholder="Select rating" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="excellent">Excellent</SelectItem>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="satisfactory">Satisfactory</SelectItem>
                        <SelectItem value="needsImprovement">Needs Improvement</SelectItem>
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
                  onClick={() => setIsDialogOpen(false)}
                  className="border-academe-300 hover:bg-academe-50"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className="bg-academe-500 hover:bg-academe-600"
                >
                  Submit Feedback
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
