
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CreateReportForm } from "./CreateReportForm";

type CreateReportButtonProps = {
  className?: string;
};

export function CreateReportButton({ className }: CreateReportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (data: any) => {
    console.log("Report submitted:", data);
    // In a real app, this would make an API call to save the report
    setIsOpen(false);
  };

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)}
        className={`bg-academe-500 hover:bg-academe-600 ${className}`}
      >
        <Plus className="h-4 w-4 mr-2" />
        Create Report
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[600px] border-academe-200">
          <DialogHeader>
            <DialogTitle className="text-academe-700">Create New Report</DialogTitle>
          </DialogHeader>
          <CreateReportForm onSubmit={handleSubmit} onCancel={() => setIsOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}
