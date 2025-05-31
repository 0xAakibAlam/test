
import { useState } from "react";
import { useAccount } from "wagmi";
import { addAnswer } from "@/services/AnonqaService";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import { MessageSquare } from "lucide-react";

interface AnswerFormProps {
  questionId: string;
  onAnswerAdded?: () => void;
}

const AnswerForm = ({ questionId, onAnswerAdded }: AnswerFormProps) => {
  const [answer, setAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { address, isConnected } = useAccount();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!answer.trim()) {
      toast.error("Please enter an answer");
      return;
    }
    
    if (!isConnected) {
      toast.error("Please connect your wallet to post an answer");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log("questId: ", questionId);
      await addAnswer({ 
        questionId, 
        answer: answer.trim() 
      });
      
      setAnswer("");
      toast.success("Answer posted successfully!");
      
      if (onAnswerAdded) {
        onAnswerAdded();
      }
    } catch (error) {
      console.error("Error posting answer:", error);
      toast.error("Failed to post answer. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Post My Answer</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Textarea
            placeholder="Share your knowledge anonymously..."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="mb-4 min-h-24"
            disabled={isSubmitting || !isConnected}
          />
          <div className="flex justify-end">
            <Button 
              type="submit" 
              variant="default"
              disabled={isSubmitting || !isConnected}
            >
              <MessageSquare className="h-4 w-4" />
              {isSubmitting ? "Posting..." : "Post Answer"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AnswerForm;
