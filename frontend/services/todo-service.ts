// Todo service for API communication
import { TodoItem, TodoCreateData, TodoUpdateData } from '@/lib/types';
import { apiClient } from '@/lib/api-client';

export class TodoService {
  static async getAllTodos(): Promise<TodoItem[]> {
    return apiClient.get<TodoItem[]>('/tasks/');
  }

  static async createTodo(todoData: TodoCreateData): Promise<TodoItem> {
    return apiClient.post<TodoItem>('/tasks/', todoData);
  }

  static async updateTodo(id: string, todoData: TodoUpdateData): Promise<TodoItem> {
    return apiClient.put<TodoItem>(`/tasks/${id}`, todoData);
  }

  static async deleteTodo(id: string): Promise<void> {
    await apiClient.delete(`/tasks/${id}`);
  }

  static async getTodoById(id: string): Promise<TodoItem> {
    return apiClient.get<TodoItem>(`/tasks/${id}`);
  }
}
