import { useState } from "react";
import { Link } from "react-router-dom";
import { Question } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { Eye, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

interface QuestionCardProps {
  question: Question;
}

const QuestionCard = ({ question }: QuestionCardProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="mb-4 hover:shadow-lg transition-all duration-200 border-l-4 border-l-primary/20">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <div className="cursor-pointer">
            <CardHeader className="pb-2">
              <div className="grid grid-cols-10 gap-4 items-center">
                <div className="col-span-9">
                  <CardTitle className="text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                    {question.questionTitle}
                  </CardTitle>
                  <div className="mt-2 text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(parseInt(question.endTime) * 1000), { addSuffix: true })}
                  </div>
                </div>
                <div className="col-span-1 flex justify-end">
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
            <div className="bg-muted/30 rounded-lg p-4">
              <p className="text-foreground leading-relaxed whitespace-pre-wrap">{question.question}</p>
            </div>
          </CardContent>
          
          <CardFooter className="pt-0 pb-6 px-6">
            <Link to={`/app/question/${question.questionId}`} className="w-full">
              <Button 
                variant="outline" 
                className="w-full flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                See Answers
              </Button>
            </Link>
          </CardFooter>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default QuestionCard;