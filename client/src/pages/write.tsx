import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, Eye, Wand2 } from "lucide-react";
import { useAuth } from "../hooks/use-auth";
import { usePosts } from "../hooks/use-posts";
import RichTextEditor from "../components/rich-text-editor";
import { useToast } from "@/hooks/use-toast";
import { getAISuggestions } from "../lib/ai-suggestions";

const CATEGORIES = [
  { value: "technology", label: "Technology" },
  { value: "lifestyle", label: "Lifestyle" },
  { value: "business", label: "Business" },
  { value: "health", label: "Health" },
  { value: "travel", label: "Travel" },
];

export default function Write() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { createPost, updatePost, getPost } = usePosts();
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<any>(null);
  const [showAiSuggestions, setShowAiSuggestions] = useState(false);

  const isEditing = Boolean(id);

  useEffect(() => {
    if (!user) {
      setLocation("/");
      return;
    }

    if (isEditing) {
      const post = getPost(parseInt(id!));
      if (post) {
        setTitle(post.title);
        setExcerpt(post.excerpt || "");
        setContent(post.content);
        setCategory(post.category);
        setTags(post.tags.join(", "));
      }
    }
  }, [user, isEditing, id, getPost, setLocation]);

  const handleSaveDraft = async () => {
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide at least a title and content.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const postData = {
        title: title.trim(),
        excerpt: excerpt.trim() || undefined,
        content: content.trim(),
        category: category || "technology",
        tags: tags.split(",").map(tag => tag.trim()).filter(Boolean),
        status: "draft" as const,
        authorId: user!.id,
      };

      if (isEditing) {
        updatePost(parseInt(id!), postData);
      } else {
        createPost(postData);
      }

      toast({
        title: "Draft Saved",
        description: "Your post has been saved as a draft.",
      });

      setLocation("/dashboard");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save draft. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!title.trim() || !content.trim() || !category) {
      toast({
        title: "Missing Information",
        description: "Please provide title, content, and category before publishing.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const postData = {
        title: title.trim(),
        excerpt: excerpt.trim() || undefined,
        content: content.trim(),
        category,
        tags: tags.split(",").map(tag => tag.trim()).filter(Boolean),
        status: "published" as const,
        authorId: user!.id,
      };

      if (isEditing) {
        updatePost(parseInt(id!), postData);
      } else {
        createPost(postData);
      }

      toast({
        title: "Post Published",
        description: "Your post has been published successfully!",
      });

      setLocation("/dashboard");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to publish post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetAISuggestions = async () => {
    if (!content.trim()) {
      toast({
        title: "No Content",
        description: "Please write some content first to get AI suggestions.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const suggestions = await getAISuggestions(content, title);
      setAiSuggestions(suggestions);
      setShowAiSuggestions(true);
      
      toast({
        title: "AI Suggestions Generated",
        description: "Check out the suggestions below to improve your post!",
      });
    } catch (error) {
      toast({
        title: "AI Error",
        description: "Failed to generate suggestions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => setLocation("/dashboard")}
            className="p-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold text-foreground">
            {isEditing ? "Edit Post" : "Write New Post"}
          </h1>
        </div>
        
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={handleSaveDraft}
            disabled={isLoading}
          >
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
          <Button
            onClick={handlePublish}
            disabled={isLoading}
          >
            <Eye className="h-4 w-4 mr-2" />
            Publish
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Editor */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6 space-y-6">
              {/* Title */}
              <div>
                <Input
                  placeholder="Your amazing title goes here..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-3xl font-bold border-none p-0 h-auto focus-visible:ring-0 placeholder:text-muted-foreground"
                />
              </div>

              {/* Excerpt */}
              <div>
                <Label htmlFor="excerpt" className="text-sm font-medium text-muted-foreground">
                  Excerpt (Optional)
                </Label>
                <Textarea
                  id="excerpt"
                  placeholder="Write a brief description of your post..."
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  rows={3}
                  className="mt-2"
                />
              </div>

              {/* Content Editor */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Content
                  </Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleGetAISuggestions}
                    disabled={isLoading}
                  >
                    <Wand2 className="h-4 w-4 mr-2" />
                    Get AI Help
                  </Button>
                </div>
                <RichTextEditor
                  value={content}
                  onChange={setContent}
                  placeholder="Start writing your post..."
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Post Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Post Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(cat => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  placeholder="tag1, tag2, tag3"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Separate tags with commas
                </p>
              </div>
            </CardContent>
          </Card>

          {/* AI Suggestions */}
          {showAiSuggestions && aiSuggestions && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center">
                    <Wand2 className="h-4 w-4 mr-2" />
                    AI Suggestions
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAiSuggestions(false)}
                  >
                    ×
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {aiSuggestions.overallScore}/10
                  </div>
                  <p className="text-sm text-muted-foreground">Overall Score</p>
                </div>

                {aiSuggestions.summary && (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm">{aiSuggestions.summary}</p>
                  </div>
                )}

                {aiSuggestions.suggestions && aiSuggestions.suggestions.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-medium">Suggestions:</h4>
                    {aiSuggestions.suggestions.map((suggestion: any, index: number) => (
                      <div key={index} className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <div className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                          <div>
                            <p className="text-sm">{suggestion.message}</p>
                            {suggestion.category && (
                              <span className="inline-block mt-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-xs rounded">
                                {suggestion.category}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
