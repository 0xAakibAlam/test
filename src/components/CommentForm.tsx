
import { useState, useEffect } from "react";
import { useAppKitAccount } from "@reown/appkit/react";
import { useAddComment } from "@/services/dXService";
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
  const { addComment, isPending, isSuccess, isError } = useAddComment();

  // Handle success state
  useEffect(() => {
    if (isSuccess) {
      setComment("");
      toast.success("Comment added successfully!");
      
      if (onCommentAdded) {
        onCommentAdded();
      }
    }
  }, [isSuccess, onCommentAdded]);

  // Handle error state
  useEffect(() => {
    if (isError) {
      toast.error("Failed to comment. Please try again.");
    }
  }, [isError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      toast.error("Please connect your wallet to post a comment");
      return;
    }

    if (!comment.trim()) {
      toast.error("Please enter an comment");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await addComment({ 
        postId, 
        comment: comment.trim() 
      });
    } catch (error) {
      console.error("Error posting comment:", error);
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
              {isSubmitting ? "Posting..." : "Comment"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};