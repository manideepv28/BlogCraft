import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  FileText, 
  Eye, 
  Edit, 
  Trash2, 
  Plus,
  CheckCircle,
  Clock,
  TrendingUp
} from "lucide-react";
import { useAuth } from "../hooks/use-auth";
import { usePosts } from "../hooks/use-posts";
import { formatDate } from "../lib/posts";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { userPosts, deletePost } = usePosts();
  const [statusFilter, setStatusFilter] = useState<string>("all");

  if (!user) {
    setLocation("/");
    return null;
  }

  const filteredPosts = statusFilter === "all" 
    ? userPosts 
    : userPosts.filter(post => post.status === statusFilter);

  const stats = {
    total: userPosts.length,
    published: userPosts.filter(p => p.status === "published").length,
    drafts: userPosts.filter(p => p.status === "draft").length,
    totalViews: userPosts.reduce((sum, post) => sum + post.views, 0),
  };

  const handleEdit = (postId: number) => {
    setLocation(`/write/${postId}`);
  };

  const handleDelete = async (postId: number) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      deletePost(postId);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Dashboard</h1>
          <p className="text-muted-foreground">Manage your posts and track your writing progress</p>
        </div>
        <Button onClick={() => setLocation("/write")} className="mt-4 sm:mt-0">
          <Plus className="h-4 w-4 mr-2" />
          New Post
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Posts</p>
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              </div>
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <FileText className="h-4 w-4 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Published</p>
                <p className="text-2xl font-bold text-green-600">{stats.published}</p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Drafts</p>
                <p className="text-2xl font-bold text-orange-600">{stats.drafts}</p>
              </div>
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="h-4 w-4 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Views</p>
                <p className="text-2xl font-bold text-blue-600">{stats.totalViews}</p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Posts Management */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <CardTitle>Your Posts</CardTitle>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Posts</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Drafts</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {statusFilter === "all" ? "No posts yet" : `No ${statusFilter} posts`}
              </h3>
              <p className="text-muted-foreground mb-4">Start writing to see your posts here</p>
              <Button onClick={() => setLocation("/write")}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Post
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPosts.map(post => (
                <div key={post.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-foreground truncate">{post.title}</h3>
                      <Badge variant={post.status === "published" ? "default" : "secondary"}>
                        {post.status}
                      </Badge>
                    </div>
                    
                    {post.excerpt && (
                      <p className="text-muted-foreground text-sm mb-2 line-clamp-2">
                        {post.excerpt}
                      </p>
                    )}
                    
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <span className="capitalize">{post.category}</span>
                      <span>{formatDate(post.createdAt)}</span>
                      <span className="flex items-center">
                        <Eye className="h-3 w-3 mr-1" />
                        {post.views} views
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(post.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(post.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
