import { useState } from "react";
import { useAccount } from "wagmi";
import { addQuestion } from "@/services/dataService";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import { MessageSquare } from "lucide-react";

interface QuestionFormProps {
  onQuestionAdded?: () => void;
}

const QuestionForm = ({ onQuestionAdded }: QuestionFormProps) => {
  const [title, setTitle] = useState("");
  const [question, setQuestion] = useState("");
  const [days, setDays] = useState(7);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { address, isConnected } = useAccount();

  const handleDaysChange = (value: number) => {
    if (value >= 1 && value <= 7) {
      setDays(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      toast.error("Please connect your wallet to ask a question");
      return;
    }

    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }
    
    if (!question.trim()) {
      toast.error("Please enter a question");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Calculate end time based on selected days
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + days);
      const timestamp = Math.floor(endDate.getTime() / 1000);
      
      await addQuestion({ 
        questionTitle: title.trim(), 
        question: question.trim(), 
        endTime: timestamp.toString() 
      });
      
      setTitle("");
      setQuestion("");
      setDays(7);
      toast.success("Question posted successfully!");
      
      if (onQuestionAdded) {
        onQuestionAdded();
      }
    } catch (error) {
      console.error("Error posting question:", error);
      toast.error("Failed to post question. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Ask a Question</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Enter Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isSubmitting || !isConnected}
          />
          <Textarea
            placeholder="What's on your mind? Ask anything anonymously..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="min-h-24"
            disabled={isSubmitting || !isConnected}
          />
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2 bg-muted/50 px-3 py-2 rounded-md w-fit">
              <span className="text-sm text-muted-foreground whitespace-nowrap">Expires in</span>
              <div className="flex items-center gap-2">
                <div className="w-12 text-center">
                  {isConnected ? (
                    <span className="text-lg text-muted-foreground">{days}</span>
                    ): (
                      `- `
                    )}
                  <span className="text-sm text-muted-foreground ml-1">
                    {days === 1 ? 'day' : 'days'}
                  </span>
                </div>
                <div className="flex flex-col -space-y-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 p-0 hover:bg-background/80"
                    onClick={() => handleDaysChange(days + 1)}
                    disabled={days >= 7 || isSubmitting || !isConnected}
                  >
                    <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[6px] border-b-foreground" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 p-0 hover:bg-background/80"
                    onClick={() => handleDaysChange(days - 1)}
                    disabled={days <= 1 || isSubmitting || !isConnected}
                  >
                    <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[6px] border-t-foreground" />
                  </Button>
                </div>
              </div>
            </div>
            <div className="hidden sm:block flex-1 px-4">
              <div className="h-[1px] bg-border w-full" />
            </div>
            <div className="pr-8 hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
            {isConnected && <><span>Question will be active until</span>
              <span className="font-medium">
                {new Date(Date.now() + days * 24 * 60 * 60 * 1000).toLocaleString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
              </>}
            </div>
            <Button 
              type="submit" 
              variant="default"
              disabled={isSubmitting || !isConnected}
              className="w-full sm:w-auto"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              {isSubmitting ? "Posting..." : "Post Question"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default QuestionForm;
