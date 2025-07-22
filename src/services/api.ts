const API_URL = 'http://localhost:8000/api/v1';

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export interface ContactResponse {
  status: string;
  message: string;
}

export const api = {
  contact: {
    send: async (data: ContactFormData): Promise<ContactResponse> => {
      const response = await fetch(`${API_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to send message');
      }

      return response.json();
    },
  },
}; 