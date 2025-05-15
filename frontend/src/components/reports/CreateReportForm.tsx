
import { useState } from "react";
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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const taskReportSchema = z.object({
  taskName: z.string().min(3, "Task name must be at least 3 characters."),
  status: z.string().min(1, "Status is required."),
  progress: z.string().min(1, "Progress percentage is required."),
  blockers: z.string().optional(),
  nextSteps: z.string().min(10, "Next steps must be at least 10 characters."),
});

const memberFeedbackSchema = z.object({
  memberName: z.string().min(3, "Member name must be at least 3 characters."),
  contributionRating: z.string().min(1, "Contribution rating is required."),
  communicationRating: z.string().min(1, "Communication rating is required."),
  technicalRating: z.string().min(1, "Technical rating is required."),
  strengths: z.string().min(10, "Strengths must be at least 10 characters."),
  improvements: z.string().min(10, "Improvement areas must be at least 10 characters."),
});

interface CreateReportFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export function CreateReportForm({ onSubmit, onCancel }: CreateReportFormProps) {
  const [activeTab, setActiveTab] = useState<string>("task");
  const [loading, setLoading] = useState(false);

  const taskForm = useForm<z.infer<typeof taskReportSchema>>({
    resolver: zodResolver(taskReportSchema),
    defaultValues: {
      taskName: "",
      status: "in-progress",
      progress: "0",
      blockers: "",
      nextSteps: "",
    },
  });

  const memberForm = useForm<z.infer<typeof memberFeedbackSchema>>({
    resolver: zodResolver(memberFeedbackSchema),
    defaultValues: {
      memberName: "",
      contributionRating: "average",
      communicationRating: "average",
      technicalRating: "average",
      strengths: "",
      improvements: "",
    },
  });

  const handleTaskSubmit = async (data: z.infer<typeof taskReportSchema>) => {
    try {
      setLoading(true);
      // In a real app, we'd make an API call here
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSubmit({ type: "task", ...data });
    } catch (error) {
      console.error("Error submitting task report:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMemberSubmit = async (data: z.infer<typeof memberFeedbackSchema>) => {
    try {
      setLoading(true);
      // In a real app, we'd make an API call here
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSubmit({ type: "member", ...data });
    } catch (error) {
      console.error("Error submitting member feedback:", error);
    } finally {
      setLoading(false);
    }
  };

  // Mock data for dropdown selections
  const members = [
    { id: "member1", name: "Jane Doe" },
    { id: "member2", name: "John Smith" },
    { id: "member3", name: "Alice Johnson" },
  ];

  const tasks = [
    { id: "task1", name: "Database Design" },
    { id: "task2", name: "Frontend Implementation" },
    { id: "task3", name: "API Development" },
  ];

  return (
    <Tabs 
      value={activeTab} 
      onValueChange={setActiveTab} 
      className="w-full"
    >
      <TabsList className="grid w-full grid-cols-2 mb-6 bg-academe-50 dark:bg-academe-900/50">
        <TabsTrigger 
          value="task" 
          className="data-[state=active]:bg-academe-200 data-[state=active]:text-academe-800 dark:data-[state=active]:bg-academe-800 dark:data-[state=active]:text-academe-100"
        >
          Task Progress Report
        </TabsTrigger>
        <TabsTrigger 
          value="member" 
          className="data-[state=active]:bg-academe-200 data-[state=active]:text-academe-800 dark:data-[state=active]:bg-academe-800 dark:data-[state=active]:text-academe-100"
        >
          Member Feedback
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="task" className="mt-0">
        <Form {...taskForm}>
          <form onSubmit={taskForm.handleSubmit(handleTaskSubmit)} className="space-y-4">
            <FormField
              control={taskForm.control}
              name="taskName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task Name</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="border-academe-300 focus:ring-academe-400">
                        <SelectValue placeholder="Select a task" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {tasks.map(task => (
                        <SelectItem key={task.id} value={task.name}>{task.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={taskForm.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="border-academe-300 focus:ring-academe-400">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="not-started">Not Started</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="review">In Review</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="blocked">Blocked</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={taskForm.control}
              name="progress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Progress (%)</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="border-academe-300 focus:ring-academe-400">
                        <SelectValue placeholder="Select progress percentage" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="0">0%</SelectItem>
                      <SelectItem value="25">25%</SelectItem>
                      <SelectItem value="50">50%</SelectItem>
                      <SelectItem value="75">75%</SelectItem>
                      <SelectItem value="100">100%</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={taskForm.control}
              name="blockers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Blockers (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe any blockers or challenges you're facing" 
                      className="resize-none min-h-[80px] border-academe-300 focus:ring-academe-400" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={taskForm.control}
              name="nextSteps"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Next Steps</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe the next steps for this task" 
                      className="resize-none min-h-[80px] border-academe-300 focus:ring-academe-400" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end gap-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel}
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
                {loading ? "Submitting..." : "Submit Task Report"}
              </Button>
            </div>
          </form>
        </Form>
      </TabsContent>
      
      <TabsContent value="member" className="mt-0">
        <Form {...memberForm}>
          <form onSubmit={memberForm.handleSubmit(handleMemberSubmit)} className="space-y-4">
            <FormField
              control={memberForm.control}
              name="memberName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team Member Name</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="border-academe-300 focus:ring-academe-400">
                        <SelectValue placeholder="Select team member" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {members.map(member => (
                        <SelectItem key={member.id} value={member.name}>{member.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={memberForm.control}
              name="contributionRating"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Contribution to Project</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex justify-between space-y-1"
                    >
                      <div className="flex flex-col items-center">
                        <RadioGroupItem 
                          value="poor" 
                          id="contribution-poor"
                          className="border-academe-300 text-academe-500" 
                        />
                        <Label htmlFor="contribution-poor">Poor</Label>
                      </div>
                      <div className="flex flex-col items-center">
                        <RadioGroupItem 
                          value="below-average" 
                          id="contribution-below"
                          className="border-academe-300 text-academe-500" 
                        />
                        <Label htmlFor="contribution-below">Below Avg</Label>
                      </div>
                      <div className="flex flex-col items-center">
                        <RadioGroupItem 
                          value="average" 
                          id="contribution-average"
                          className="border-academe-300 text-academe-500" 
                        />
                        <Label htmlFor="contribution-average">Average</Label>
                      </div>
                      <div className="flex flex-col items-center">
                        <RadioGroupItem 
                          value="good" 
                          id="contribution-good"
                          className="border-academe-300 text-academe-500" 
                        />
                        <Label htmlFor="contribution-good">Good</Label>
                      </div>
                      <div className="flex flex-col items-center">
                        <RadioGroupItem 
                          value="excellent" 
                          id="contribution-excellent"
                          className="border-academe-300 text-academe-500" 
                        />
                        <Label htmlFor="contribution-excellent">Excellent</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={memberForm.control}
              name="communicationRating"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Communication Skills</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex justify-between space-y-1"
                    >
                      <div className="flex flex-col items-center">
                        <RadioGroupItem 
                          value="poor" 
                          id="communication-poor"
                          className="border-academe-300 text-academe-500" 
                        />
                        <Label htmlFor="communication-poor">Poor</Label>
                      </div>
                      <div className="flex flex-col items-center">
                        <RadioGroupItem 
                          value="below-average" 
                          id="communication-below"
                          className="border-academe-300 text-academe-500" 
                        />
                        <Label htmlFor="communication-below">Below Avg</Label>
                      </div>
                      <div className="flex flex-col items-center">
                        <RadioGroupItem 
                          value="average" 
                          id="communication-average"
                          className="border-academe-300 text-academe-500" 
                        />
                        <Label htmlFor="communication-average">Average</Label>
                      </div>
                      <div className="flex flex-col items-center">
                        <RadioGroupItem 
                          value="good" 
                          id="communication-good"
                          className="border-academe-300 text-academe-500" 
                        />
                        <Label htmlFor="communication-good">Good</Label>
                      </div>
                      <div className="flex flex-col items-center">
                        <RadioGroupItem 
                          value="excellent" 
                          id="communication-excellent"
                          className="border-academe-300 text-academe-500" 
                        />
                        <Label htmlFor="communication-excellent">Excellent</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={memberForm.control}
              name="technicalRating"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Technical Skills</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex justify-between space-y-1"
                    >
                      <div className="flex flex-col items-center">
                        <RadioGroupItem 
                          value="poor" 
                          id="technical-poor"
                          className="border-academe-300 text-academe-500" 
                        />
                        <Label htmlFor="technical-poor">Poor</Label>
                      </div>
                      <div className="flex flex-col items-center">
                        <RadioGroupItem 
                          value="below-average" 
                          id="technical-below"
                          className="border-academe-300 text-academe-500" 
                        />
                        <Label htmlFor="technical-below">Below Avg</Label>
                      </div>
                      <div className="flex flex-col items-center">
                        <RadioGroupItem 
                          value="average" 
                          id="technical-average"
                          className="border-academe-300 text-academe-500" 
                        />
                        <Label htmlFor="technical-average">Average</Label>
                      </div>
                      <div className="flex flex-col items-center">
                        <RadioGroupItem 
                          value="good" 
                          id="technical-good"
                          className="border-academe-300 text-academe-500" 
                        />
                        <Label htmlFor="technical-good">Good</Label>
                      </div>
                      <div className="flex flex-col items-center">
                        <RadioGroupItem 
                          value="excellent" 
                          id="technical-excellent"
                          className="border-academe-300 text-academe-500" 
                        />
                        <Label htmlFor="technical-excellent">Excellent</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={memberForm.control}
              name="strengths"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Strengths</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe the team member's key strengths" 
                      className="resize-none min-h-[80px] border-academe-300 focus:ring-academe-400" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={memberForm.control}
              name="improvements"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Areas for Improvement</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Suggest areas where the team member could improve" 
                      className="resize-none min-h-[80px] border-academe-300 focus:ring-academe-400" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end gap-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel}
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
                {loading ? "Submitting..." : "Submit Feedback"}
              </Button>
            </div>
          </form>
        </Form>
      </TabsContent>
    </Tabs>
  );
}
