import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Eye, Clock, User } from "lucide-react";
import { formatDate } from "../lib/posts";

export default function PostDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();

  const { data: post, isLoading, error } = useQuery({
    queryKey: [`/api/posts/${id}`],
    enabled: Boolean(id),
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <div className="h-64 bg-muted animate-pulse" />
          <CardContent className="p-8">
            <div className="space-y-4">
              <div className="h-4 bg-muted rounded animate-pulse w-1/4" />
              <div className="h-8 bg-muted rounded animate-pulse w-3/4" />
              <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded animate-pulse" />
                <div className="h-4 bg-muted rounded animate-pulse" />
                <div className="h-4 bg-muted rounded animate-pulse w-5/6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <h3 className="text-lg font-semibold text-foreground mb-2">Post not found</h3>
            <p className="text-muted-foreground mb-4">
              The post you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => setLocation("/")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const readTime = Math.ceil(post.content.split(' ').length / 200);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card className="overflow-hidden">
        {/* Header */}
        <div className="relative">
          <div className="h-64 bg-gradient-to-r from-primary/20 to-accent/20 flex items-center justify-center">
            <div className="text-center">
              <Badge variant="secondary" className="mb-4">
                {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
              </Badge>
              <h1 className="text-4xl font-bold text-foreground max-w-3xl mx-auto">
                {post.title}
              </h1>
            </div>
          </div>
          
          <Button
            variant="ghost"
            onClick={() => setLocation("/")}
            className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        <CardContent className="p-8">
          {/* Post Meta */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 pb-8 border-b border-border">
            <div className="flex items-center space-x-4 mb-4 sm:mb-0">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                <User className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Author {post.authorId}</p>
                <p className="text-sm text-muted-foreground">
                  Published {formatDate(post.publishedAt || post.createdAt)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span className="flex items-center">
                <Eye className="h-4 w-4 mr-1" />
                {post.views} views
              </span>
              <span className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {readTime} min read
              </span>
            </div>
          </div>

          {/* Excerpt */}
          {post.excerpt && (
            <div className="mb-8">
              <p className="text-xl text-muted-foreground leading-relaxed italic">
                {post.excerpt}
              </p>
            </div>
          )}

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <div 
              className="whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-8 pt-8 border-t border-border">
              <h4 className="font-semibold text-foreground mb-4">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {post.tags.map(tag => (
                  <Badge key={tag} variant="secondary">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
