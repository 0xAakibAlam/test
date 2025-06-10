
import { useState } from "react";
import { useAppKitAccount } from "@reown/appkit/react";
import { addComment } from "@/services/AnonqaService";
import { Button } from "@/components/ui/button";
import { RichTextArea } from "./RichTextArea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import { MessageSquare } from "lucide-react";

interface CommentFormProps {
  postId: string;
  onCommentAdded?: () => void;
}

export const CommentForm = ({ postId, onCommentAdded }: CommentFormProps) => {
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isConnected } = useAppKitAccount();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!comment.trim()) {
      toast.error("Please enter an answer");
      return;
    }
    
    if (!isConnected) {
      toast.error("Please connect your wallet to post an answer");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await addComment({ 
        postId, 
        comment: comment.trim() 
      });
      
      setComment("");
      toast.success("Answer posted successfully!");
      
      if (onCommentAdded) {
        onCommentAdded();
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
        <CardTitle>Write Comments</CardTitle>
      </CardHeader>
      <CardContent className="px-3 sm:px-6">
        <form onSubmit={handleSubmit}>
          <RichTextArea
            placeholder="Add Comments..."
            value={comment}
            onChange={setComment}
            className="min-h-60 resize-none overflow-hidden mb-4"
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