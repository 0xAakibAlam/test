import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Question } from "@/types";
import { addAnswer } from "@/services/AnonqaService";
import { formatDistanceToNow } from "date-fns";
import { Eye, ChevronDown, MessageSquare, X, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/sonner";
import { useAppKitAccount } from "@reown/appkit/react";
import { RichTextArea } from "./RichTextArea";
import { RichTextRenderer } from "./RichTextRenderer";

interface QuestionCardProps {
  question: Question;
}

export const PostCard = ({ question }: QuestionCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [answer, setAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAnswerOverlay, setShowAnswerOverlay] = useState(false);
  const { address, isConnected } = useAppKitAccount();

  useEffect(() => {
    if (showAnswerOverlay) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showAnswerOverlay]);

  const handleAnswerSubmit = async () => {
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
      await addAnswer({ 
        questionId: question.questionId, 
        answer: answer.trim() 
      });
      
      setAnswer("");
      setShowAnswerOverlay(false);
      toast.success("Answer posted successfully!");
    } catch (error) {
      console.error("Error posting answer:", error);
      toast.error("Failed to post answer. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenAnswerOverlay = () => {
    setShowAnswerOverlay(true);
  };

  const handleCloseAnswerOverlay = () => {
    setShowAnswerOverlay(false);
    setAnswer("");
  };

  const renderAnswerOverlay = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center z-50 overflow-y-auto py-8">
      <Card className="w-full max-w-4xl mx-4 my-auto">
        <CardHeader className="flex flex-row items-center justify-between px-3 md:px-6">
          <CardTitle>Post Your Answer</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCloseAnswerOverlay}
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <div className="px-3 md:px-6">
          <Card className="mb-6 border-l-4 border-l-primary/20">
            <CardHeader className="pb-2">
              <div className="flex flex-col gap-2">
                <CardTitle className="text-xl md:text-2xl group-hover:text-primary transition-colors break-words">
                  {question.questionTitle}
                </CardTitle>
                <div className="text-sm text-muted-foreground flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  <span>
                  {new Date(Number(question.endTime) * 1000) > new Date() ? 'Archive' : 'Archived'}{' '}
                  {formatDistanceToNow(new Date(Number(question.endTime) * 1000), { addSuffix: true })}
                  </span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-4 pb-6 px-3 md:px-6 break-words">
              <RichTextRenderer content={question.question} />
            </CardContent>
          </Card>
        </div>

        <CardContent className="px-3 md:px-6">
          <RichTextArea
            placeholder="Write your answer here..."
            className="min-h-[200px]"
            value={answer}
            onChange={setAnswer}
            disabled={isSubmitting || !isConnected}
          />
        </CardContent>

        <CardFooter className="flex justify-end gap-2">
          <Link to={`/app/question/${question.questionId}`} className="flex-1">
            <Button 
              variant="outline" 
              className="flex items-center gap-2 w-full justify-center"
            >
              <Eye className="h-4 w-4" />
              See Answers
            </Button>
          </Link>
          <Button 
            variant="default" 
            className="flex items-center gap-2 flex-1 justify-center"
            disabled={isSubmitting || !isConnected}
            onClick={handleAnswerSubmit}
          >
            <MessageSquare className="h-4 w-4" />
            {isSubmitting ? "Posting..." : "Post Answer"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );

  return (
    <>
      <Card className="mb-4 hover:shadow-lg transition-all duration-200 border-l-4 border-l-primary/20">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <div className="cursor-pointer">
              <CardHeader className="pb-2 px-3 md:px-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-xl md:text-2xl group-hover:text-primary transition-colors break-words">
                      {question.questionTitle}
                    </CardTitle>
                    <div className="mt-2 text-sm text-muted-foreground">
                    <span>
                      {new Date(Number(question.endTime) * 1000) > new Date() ? 'Archive' : 'Archived'}{' '}
                      {formatDistanceToNow(new Date(Number(question.endTime) * 1000), { addSuffix: true })}
                    </span>
                    </div>
                  </div>
                  <div className="flex-shrink-0 flex items-center">
                    <ChevronDown className={cn(
                      "h-5 w-5 text-muted-foreground transition-transform duration-200",
                      isOpen && "transform rotate-180"
                    )} />
                  </div>
                </div>
              </CardHeader>
            </div>
          </CollapsibleTrigger>
          
          <CollapsibleContent>
            <CardContent className="pt-4 pb-6 px-3 md:px-6 break-words">
              <RichTextRenderer content={question.question} />
            </CardContent>
            
            <CardFooter className="flex justify-end gap-2 pt-0 pb-6 px-3 md:px-6">
              <Link to={`/app/question/${question.questionId}`} className="flex-1">
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2 w-full justify-center"
                >
                  <Eye className="h-4 w-4" />
                  See Answers
                </Button>
              </Link>
              {!question.sentToHeaven && (
                <Button 
                  variant="default"
                  className="flex items-center gap-2 flex-1 justify-center"
                  disabled={!isConnected}
                  onClick={handleOpenAnswerOverlay}
                >
                  <MessageSquare className="h-4 w-4" />
                  Post Answer
                </Button>
              )}
            </CardFooter>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {showAnswerOverlay && renderAnswerOverlay()}
    </>
  );
};