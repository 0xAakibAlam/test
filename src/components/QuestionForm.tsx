import { useState, useEffect } from "react";
import { useWallet } from "@/context/WalletContext";
import { addQuestion } from "@/services/dataService";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";

interface QuestionFormProps {
  onQuestionAdded?: () => void;
}

const QuestionForm = ({ onQuestionAdded }: QuestionFormProps) => {
  const [title, setTitle] = useState("");
  const [question, setQuestion] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { wallet } = useWallet();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!wallet.isConnected) {
      toast.error("Please connect your wallet to ask a question");
      return;
    }

    if (!title.trim()) {
      toast.error("Please enter a title");
    }
    
    if (!question.trim()) {
      toast.error("Please enter a question");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await addQuestion({ questionTitle: title.trim(), question: question.trim(), endTime: endTime });
      setQuestion("");
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
        <form onSubmit={handleSubmit}>
          <Input
            placeholder="Enter Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mb-4"
            disabled={isSubmitting || !wallet.isConnected}
          />
          <Textarea
            placeholder="What's on your mind? Ask anything anonymously..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="mb-4 min-h-24"
            disabled={isSubmitting || !wallet.isConnected}
          />
          <div className="flex justify-end">
          <Input
            placeholder="End Time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="mb-4 mr-4"
            disabled={isSubmitting || !wallet.isConnected}
          />
            <Button 
              type="submit" 
              disabled={isSubmitting || !wallet.isConnected}
            >
              {isSubmitting ? "Posting..." : "Post Question"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default QuestionForm;
