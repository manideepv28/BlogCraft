import { useState, useEffect } from "react";
import { useAuth } from "./use-auth";
import type { Post, InsertPost } from "@shared/schema";
import { 
  getAllPosts as fetchAllPosts,
  getPostById,
  savePost,
  deletePostById,
  createPost as createNewPost,
  updatePost as updateExistingPost
} from "../lib/posts";

export const usePosts = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [userPosts, setUserPosts] = useState<Post[]>([]);

  // Load all posts
  useEffect(() => {
    const loadPosts = async () => {
      const allPosts = await fetchAllPosts();
      setPosts(allPosts.filter(post => post.status === "published"));
      
      if (user) {
        setUserPosts(allPosts.filter(post => post.authorId === user.id));
      } else {
        setUserPosts([]);
      }
    };

    loadPosts();
  }, [user]);

  const getPost = (id: number): Post | undefined => {
    return [...posts, ...userPosts].find(post => post.id === id);
  };

  const createPost = (postData: Omit<InsertPost, "authorId"> & { authorId: number }) => {
    const newPost = createNewPost(postData);
    
    if (newPost.status === "published") {
      setPosts(prev => [newPost, ...prev]);
    }
    
    if (user && newPost.authorId === user.id) {
      setUserPosts(prev => [newPost, ...prev]);
    }
  };

  const updatePost = (id: number, updates: Partial<InsertPost>) => {
    const updatedPost = updateExistingPost(id, updates);
    if (!updatedPost) return;

    // Update posts array
    setPosts(prev => {
      const filtered = prev.filter(p => p.id !== id);
      return updatedPost.status === "published" 
        ? [updatedPost, ...filtered]
        : filtered;
    });

    // Update user posts array
    if (user && updatedPost.authorId === user.id) {
      setUserPosts(prev => 
        prev.map(p => p.id === id ? updatedPost : p)
      );
    }
  };

  const deletePost = (id: number) => {
    deletePostById(id);
    setPosts(prev => prev.filter(p => p.id !== id));
    setUserPosts(prev => prev.filter(p => p.id !== id));
  };

  return {
    posts,
    userPosts,
    getPost,
    createPost,
    updatePost,
    deletePost,
  };
};
