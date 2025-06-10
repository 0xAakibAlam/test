import { Comment } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { Eye, Link as LucideLink, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { RichTextRenderer } from "./RichTextRenderer";
import { Link } from "react-router-dom";

interface CommentCardProps {
  comment: Comment;
  postTitle: string;
}

export const CommentCard = ({ comment, postTitle }: CommentCardProps) => {
  return (
    <Card className="mb-4 hover:shadow-lg transition-all duration-200 border-l-4 border-l-primary/20">
      {postTitle && (
        <CardHeader className="pb-2 px-3 md:px-6">
          <Link to={`/questions/${comment.postId}`}>
            <CardTitle className="text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors">
              {postTitle}
            </CardTitle>
          </Link>
        </CardHeader>
      )}
      <CardContent className="pt-4 pb-6 px-3 md:px-6">
        <RichTextRenderer content={comment.comment} />
      </CardContent>
    </Card>
  );
};