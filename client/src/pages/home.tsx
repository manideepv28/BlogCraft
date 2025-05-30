import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, BookOpen, Users, TrendingUp } from "lucide-react";
import PostCard from "../components/post-card";
import { getAllPosts } from "../lib/posts";
import { useAuth } from "../hooks/use-auth";
import type { Post } from "@shared/schema";

export default function Home() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedAuthor, setSelectedAuthor] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("newest");

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["/api/posts"],
    queryFn: getAllPosts,
  });

  // Get unique categories and authors
  const categories = Array.from(new Set(posts.map(post => post.category)));
  const authors = Array.from(new Set(posts.map(post => post.authorId))); // This would need user lookup in real app

  // Filter and sort posts
  const filteredPosts = posts
    .filter(post => {
      const matchesSearch = !searchTerm || 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = !selectedCategory || selectedCategory === "all" || post.category === selectedCategory;
      const matchesAuthor = !selectedAuthor || selectedAuthor === "all" || post.authorId.toString() === selectedAuthor;
      
      return matchesSearch && matchesCategory && matchesAuthor;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return new Date(a.publishedAt || a.createdAt).getTime() - new Date(b.publishedAt || b.createdAt).getTime();
        case "popular":
          return b.views - a.views;
        case "newest":
        default:
          return new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime();
      }
    });

  const handleGetStarted = () => {
    if (user) {
      setLocation("/write");
    } else {
      // This will trigger auth modal from navigation component
      setLocation("/write");
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-accent/5 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Share Your <span className="text-primary">Stories</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              WriteSpace is a modern blogging platform where ideas come to life. Create, share, and discover amazing content with our AI-powered writing assistant.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={handleGetStarted} className="px-8 py-3">
                Start Writing Today
              </Button>
              <Button variant="outline" size="lg" className="px-8 py-3" onClick={() => {
                document.getElementById('posts-section')?.scrollIntoView({ behavior: 'smooth' });
              }}>
                Explore Stories
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">{posts.length}+</h3>
                <p className="text-muted-foreground">Published Stories</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">{authors.length}+</h3>
                <p className="text-muted-foreground">Active Writers</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-6 w-6 text-green-500" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">{posts.reduce((sum, post) => sum + post.views, 0)}+</h3>
                <p className="text-muted-foreground">Total Views</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Posts Section */}
      <section id="posts-section" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-foreground">Featured Stories</h2>
          </div>

          {/* Search and Filters */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="lg:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search posts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedAuthor} onValueChange={setSelectedAuthor}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Authors" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Authors</SelectItem>
                    {authors.map(authorId => (
                      <SelectItem key={authorId} value={authorId.toString()}>
                        Author {authorId}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Posts Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="h-48 bg-muted animate-pulse" />
                  <CardContent className="p-6">
                    <div className="h-4 bg-muted rounded animate-pulse mb-3" />
                    <div className="h-6 bg-muted rounded animate-pulse mb-2" />
                    <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No posts found</h3>
                <p className="text-muted-foreground">Try adjusting your search filters or check back later for new content.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
}
