import type { Post, InsertPost } from "@shared/schema";

export const formatDate = (date: Date | string) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const calculateReadTime = (content: string) => {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
};

export const getAllPosts = async (): Promise<Post[]> => {
  const posts = JSON.parse(localStorage.getItem("writeSpace_posts") || "[]");
  return posts.map((post: any) => ({
    ...post,
    createdAt: new Date(post.createdAt),
    updatedAt: new Date(post.updatedAt),
    publishedAt: post.publishedAt ? new Date(post.publishedAt) : null,
  }));
};

export const getPostById = async (id: number): Promise<Post | null> => {
  const posts = await getAllPosts();
  return posts.find(post => post.id === id) || null;
};

export const savePost = (post: Post) => {
  const posts = JSON.parse(localStorage.getItem("writeSpace_posts") || "[]");
  const existingIndex = posts.findIndex((p: Post) => p.id === post.id);
  
  if (existingIndex >= 0) {
    posts[existingIndex] = post;
  } else {
    posts.push(post);
  }
  
  localStorage.setItem("writeSpace_posts", JSON.stringify(posts));
};

export const deletePostById = (id: number) => {
  const posts = JSON.parse(localStorage.getItem("writeSpace_posts") || "[]");
  const filteredPosts = posts.filter((post: Post) => post.id !== id);
  localStorage.setItem("writeSpace_posts", JSON.stringify(filteredPosts));
};

export const createPost = (postData: Omit<InsertPost, "authorId"> & { authorId: number }): Post => {
  const now = new Date();
  const post: Post = {
    id: Date.now(),
    ...postData,
    views: 0,
    createdAt: now,
    updatedAt: now,
    publishedAt: postData.status === "published" ? now : null,
  };
  
  savePost(post);
  return post;
};

export const updatePost = (id: number, updates: Partial<InsertPost>): Post | null => {
  const posts = JSON.parse(localStorage.getItem("writeSpace_posts") || "[]");
  const postIndex = posts.findIndex((p: Post) => p.id === id);
  
  if (postIndex === -1) return null;
  
  const existingPost = {
    ...posts[postIndex],
    createdAt: new Date(posts[postIndex].createdAt),
    updatedAt: new Date(posts[postIndex].updatedAt),
    publishedAt: posts[postIndex].publishedAt ? new Date(posts[postIndex].publishedAt) : null,
  };

  const updatedPost: Post = {
    ...existingPost,
    ...updates,
    updatedAt: new Date(),
    publishedAt: updates.status === "published" && !existingPost.publishedAt 
      ? new Date() 
      : existingPost.publishedAt,
  };
  
  savePost(updatedPost);
  return updatedPost;
};
