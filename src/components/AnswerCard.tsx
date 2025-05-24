
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

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <p className="mb-4 leading-relaxed whitespace-pre-wrap text-foreground">{answer.answer}</p>
      </CardContent>
    </Card>
  );
};

export default AnswerCard;