import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";

interface QuestionCardProps {
  question: Question;
}

const QuestionCard = ({ question }: QuestionCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [answer, setAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAnswerOverlay, setShowAnswerOverlay] = useState(false);
  const { address, isConnected } = useAppKitAccount();

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

  const renderQuestionContent = () => {
    // URL regex pattern
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    
    // Split the text by URLs and map through the parts
    const parts = question.question.split(urlRegex);
    
    return (
      <div className="bg-muted/30 rounded-lg p-4">
        <p className="text-foreground leading-relaxed whitespace-pre-wrap">
          {parts.map((part, index) => {
            // Check if this part matches a URL
            if (part.match(urlRegex)) {
              return (
                <a
                  key={index}
                  href={part}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline break-all"
                >
                  {part}
                </a>
              );
            }
            return part;
          })}
        </p>
      </div>
    );
  };

  const renderAnswerOverlay = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl mx-4">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Post Your Answer</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCloseAnswerOverlay}
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <div className="px-6">
          <Card className="mb-6 border-l-4 border-l-primary/20">
            <CardHeader className="pb-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <CardTitle className="text-lg font-semibold line-clamp-2">{question.questionTitle}</CardTitle>
                <div className="text-sm text-muted-foreground flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  <span>Expires {formatDistanceToNow(new Date(parseInt(question.endTime) * 1000), { addSuffix: true })}</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-4 pb-6">
              {renderQuestionContent()}
            </CardContent>
          </Card>
        </div>

        <CardContent>
          <Textarea
            placeholder="Write your answer here..."
            className="min-h-[200px]"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
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
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                      {question.questionTitle}
                    </CardTitle>
                    <div className="mt-2 text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(parseInt(question.endTime) * 1000), { addSuffix: true })}
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
            <CardContent className="pt-4 pb-6">
              {renderQuestionContent()}
            </CardContent>
            
            <CardFooter className="flex flex-col sm:flex-row gap-4 pt-0 pb-6 px-6">
              <Link to={`/app/question/${question.questionId}`} className="w-full">
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
                  className="flex items-center gap-2 w-full justify-center"
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

export default QuestionCard;