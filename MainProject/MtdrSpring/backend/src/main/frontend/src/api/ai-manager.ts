import { apiClient } from "./client";

export interface AISuggestion {
  type: "info" | "warning" | "success";
  title: string;
  description: string;
  action_items: string[];
  context?: string;
}

export interface AISuggestionsResponse {
  suggestions: AISuggestion[];
  count: number;
  type: "comprehensive" | "project" | "sprint";
  projectId?: number;
  sprintId?: number;
}

export const aiManagerService = {
  /**
   * Get comprehensive management suggestions
   */
  getComprehensiveSuggestions: async (): Promise<AISuggestionsResponse> => {
    try {
      console.log("Calling API: /ai-manager/suggestions");
      const response = await apiClient.get("/ai-manager/suggestions");
      console.log("API response received:", response);
      return response;
    } catch (error) {
      console.error("Error in getComprehensiveSuggestions:", error);
      // Return a fallback response to prevent the UI from crashing
      return {
        suggestions: [{
          type: "info",
          title: "Connection Issue",
          description: "There was an issue connecting to the AI Manager service. This might be a temporary problem or the service may not be fully set up yet.",
          action_items: ["Try refreshing the page", "Contact the administrator if the issue persists"]
        }],
        count: 1,
        type: "comprehensive"
      };
    }
  },

  /**
   * Get project-specific management suggestions
   */
  getProjectSuggestions: async (projectId: number): Promise<AISuggestionsResponse> => {
    try {
      console.log(`Calling API: /ai-manager/suggestions/project/${projectId}`);
      const response = await apiClient.get(`/ai-manager/suggestions/project/${projectId}`);
      console.log("API response received:", response);
      return response;
    } catch (error) {
      console.error("Error in getProjectSuggestions:", error);
      return {
        suggestions: [{
          type: "info",
          title: "Connection Issue",
          description: "There was an issue connecting to the AI Manager service for project suggestions.",
          action_items: ["Try refreshing the page", "Contact the administrator if the issue persists"]
        }],
        count: 1,
        type: "project",
        projectId
      };
    }
  },

  /**
   * Get sprint-specific management suggestions
   */
  getSprintSuggestions: async (sprintId: number): Promise<AISuggestionsResponse> => {
    try {
      console.log(`Calling API: /ai-manager/suggestions/sprint/${sprintId}`);
      const response = await apiClient.get(`/ai-manager/suggestions/sprint/${sprintId}`);
      console.log("API response received:", response);
      return response;
    } catch (error) {
      console.error("Error in getSprintSuggestions:", error);
      return {
        suggestions: [{
          type: "info",
          title: "Connection Issue",
          description: "There was an issue connecting to the AI Manager service for sprint suggestions.",
          action_items: ["Try refreshing the page", "Contact the administrator if the issue persists"]
        }],
        count: 1,
        type: "sprint",
        sprintId
      };
    }
  }
}; 