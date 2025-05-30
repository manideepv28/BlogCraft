import { apiRequest } from "./queryClient";

export interface AISuggestion {
  type: string;
  message: string;
  category: string;
}

export interface AISuggestionsResponse {
  suggestions: AISuggestion[];
  overallScore: number;
  summary: string;
}

export const getAISuggestions = async (content: string, title?: string): Promise<AISuggestionsResponse> => {
  const response = await apiRequest("POST", "/api/ai-suggestions", {
    content,
    title,
  });
  
  return response.json();
};
