import { makeGetRequest, makePostRequest, makePutRequest } from '../../services';

// Configuration
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://jsonplaceholder.typicode.com';

// Types for API responses
export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

export interface Comment {
  id: number;
  postId: number;
  name: string;
  email: string;
  body: string;
}

export interface Album {
  id: number;
  title: string;
  userId: number;
}

// Feature2 API services using real endpoints
export const feature2Api = {
  // Fetch posts from JSONPlaceholder API
  fetchPosts: async (): Promise<Post[]> => {
    return makeGetRequest<Post[]>(`${API_BASE_URL}/posts`, {
      timeout: 5000,
    });
  },

  // Fetch a specific post
  fetchPost: async (id: number): Promise<Post> => {
    return makeGetRequest<Post>(`${API_BASE_URL}/posts/${id}`);
  },

  // Create a new post
  createPost: async (post: Omit<Post, 'id'>): Promise<Post> => {
    return makePostRequest<Post>(`${API_BASE_URL}/posts`, post);
  },

  // Update a post
  updatePost: async (id: number, post: Partial<Post>): Promise<Post> => {
    return makePutRequest<Post>(`${API_BASE_URL}/posts/${id}`, post);
  },

  // Fetch comments for a post
  fetchComments: async (postId: number): Promise<Comment[]> => {
    return makeGetRequest<Comment[]>(
      `${API_BASE_URL}/posts/${postId}/comments`
    );
  },

  // Fetch albums (alternative endpoint)
  fetchAlbums: async (): Promise<Album[]> => {
    return makeGetRequest<Album[]>(`${API_BASE_URL}/albums`, {
      timeout: 5000,
    });
  },

  // Fetch random cat facts (alternative API)
  fetchCatFacts: async (): Promise<{ fact: string }[]> => {
    try {
      const response = await makeGetRequest<{ fact: string }>('https://catfact.ninja/fact', {
        timeout: 3000,
      });
      return [response];
    } catch (error) {
      // Fallback to local data if API fails
      return [
        { fact: 'Cats have over 20 muscles that control their ears.' },
        { fact: 'Cats sleep 70% of their lives.' },
        { fact: "A group of cats is called a 'clowder'." },
      ];
    }
  },
};
