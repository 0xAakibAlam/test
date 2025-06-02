
import { Answer } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useState } from "react";

interface AnswerCardProps {
  answer: Answer;
}

const AnswerCard = ({ answer }: AnswerCardProps) => {

  const renderAnswerContent = () => {
    // URL regex pattern
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    
    // Split the text by URLs and map through the parts
    const parts = answer.answer.split(urlRegex);
    
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

  return (
    // <Card className="mb-4">
    //   <CardContent>
        <p className="mb-4 leading-relaxed whitespace-pre-wrap text-foreground">{renderAnswerContent()}</p>
      // </CardContent>
    // </Card>
  );
};

export default AnswerCard;