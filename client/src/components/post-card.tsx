import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Clock, User } from "lucide-react";
import { formatDate } from "../lib/posts";
import type { Post } from "@shared/schema";

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const [, setLocation] = useLocation();

  const handleClick = () => {
    setLocation(`/post/${post.id}`);
  };

  const readTime = Math.ceil(post.content.split(' ').length / 200);

  return (
    <Card 
      className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer card-hover"
      onClick={handleClick}
    >
      {/* Featured Image Placeholder */}
      <div className="h-48 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
        <div className="text-center p-4">
          <h3 className="font-semibold text-foreground line-clamp-2">{post.title}</h3>
        </div>
      </div>
      
      <CardContent className="p-6">
        {/* Category and Date */}
        <div className="flex items-center space-x-2 mb-3">
          <Badge variant="secondary" className="capitalize">
            {post.category}
          </Badge>
          <span className="text-muted-foreground text-sm">
            {formatDate(post.publishedAt || post.createdAt)}
          </span>
        </div>
        
        {/* Title */}
        <h3 className="text-xl font-semibold text-foreground mb-3 line-clamp-2 hover:text-primary transition-colors">
          {post.title}
        </h3>
        
        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-muted-foreground mb-4 line-clamp-3">
            {post.excerpt}
          </p>
        )}
        
        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-semibold">
              <User className="h-4 w-4" />
            </div>
            <span className="text-sm text-muted-foreground">
              Author {post.authorId}
            </span>
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <span className="flex items-center">
              <Eye className="h-3 w-3 mr-1" />
              {post.views}
            </span>
            <span className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {readTime}m
            </span>
          </div>
        </div>
        
        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex flex-wrap gap-2">
              {post.tags.slice(0, 3).map(tag => (
                <Badge key={tag} variant="outline" className="text-xs">
                  #{tag}
                </Badge>
              ))}
              {post.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{post.tags.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
