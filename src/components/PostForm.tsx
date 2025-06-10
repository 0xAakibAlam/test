import { useState } from "react";
import { useAppKitAccount } from "@reown/appkit/react";
import { addQuestion } from "@/services/AnonqaService";
import { Button } from "@/components/ui/button";
import { RichTextArea } from "./RichTextArea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import { MessageSquare } from "lucide-react";
import { Textarea } from "./ui/textarea";

interface QuestionFormProps {
  onQuestionAdded?: () => void;
}

export const PostForm = ({ onQuestionAdded }: QuestionFormProps) => {
  const [title, setTitle] = useState("");
  const [question, setQuestion] = useState("");
  const [days, setDays] = useState(7);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isConnected } = useAppKitAccount();

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
    
    if (title.length > 100) {
      toast.error("Title must not exceed 100 characters");
      return;
    }
    
    if (!question.trim()) {
      toast.error("Please enter a question");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
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
        <CardTitle>Share Your Thoughts</CardTitle>
      </CardHeader>
      <CardContent className="px-3 sm:px-6">
        <form onSubmit={handleSubmit}>
            <Textarea
              placeholder="Enter Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isSubmitting || !isConnected}
              className="mb-1 text-xs md:text-xl h-auto overflow-hidden"
              maxLength={100}
            />
            <div className={`flex justify-end text-sm mb-4 ${title.length >= 100 ? 'text-destructive' : 'text-muted-foreground'}`}>
              {title.length}/100
            </div>
          <RichTextArea
            placeholder="Share anything anonymously..."
            value={question}
            onChange={setQuestion}
            className="min-h-80 resize-none overflow-hidden mb-4"
            disabled={isSubmitting || !isConnected}
          />
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end">
            <Button 
              type="submit" 
              variant="default"
              disabled={isSubmitting || !isConnected}
              className="w-full sm:w-auto"
            >
              <MessageSquare className="h-4 w-4" />
              {isSubmitting ? "Posting..." : "Post Question"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};