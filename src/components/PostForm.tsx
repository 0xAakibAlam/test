import { useState } from "react";
import { useAppKitAccount } from "@reown/appkit/react";
import { addPost } from "@/services/AnonqaService";
import { Button } from "@/components/ui/button";
import { RichTextArea } from "./RichTextArea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import { MessageSquare } from "lucide-react";
import { Textarea } from "./ui/textarea";

interface PostFormProps {
  onPostAdded?: () => void;
}

export const PostForm = ({ onPostAdded }: PostFormProps) => {
  const [title, setTitle] = useState("");
  const [postBody, setPostBody] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isConnected } = useAppKitAccount();
  const [resetKey, setResetKey] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      toast.error("Please connect your wallet to ask a post");
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
    
    if (!postBody.trim()) {
      toast.error("Please enter a post");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      
      await addPost({ 
        postTitle: title.trim(), 
        postBody: postBody.trim(), 
      });
      
      setTitle("");
      setPostBody("");
      setResetKey(prev => prev + 1);
      toast.success("Question posted successfully!");
      
      if (onPostAdded) {
        onPostAdded();
      }
    } catch (error) {
      console.error("Error posting post:", error);
      toast.error("Failed to post post. Please try again.");
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
            value={postBody}
            onChange={setPostBody}
            className="min-h-80 resize-none overflow-hidden mb-4"
            disabled={isSubmitting || !isConnected}
            key={resetKey}
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