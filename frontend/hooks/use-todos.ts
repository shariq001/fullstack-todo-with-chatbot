// Todo hook for managing todo state
import { useState, useEffect, useCallback } from 'react';
import { TodoItem, TodoCreateData, TodoUpdateData } from '@/lib/types';
import { TodoService } from '@/services/todo-service';

export interface UseTodosReturn {
  todos: TodoItem[];
  loading: boolean;
  error: string | null;
  createTodo: (todoData: TodoCreateData) => Promise<void>;
  updateTodo: (id: string, todoData: TodoUpdateData) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  refetch: () => Promise<void>;
}

export const useTodos = (): UseTodosReturn => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTodos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedTodos = await TodoService.getAllTodos();
      setTodos(fetchedTodos);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch todos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const createTodo = async (todoData: TodoCreateData) => {
    try {
      setError(null);
      const newTodo = await TodoService.createTodo(todoData);
      setTodos(prev => [...prev, newTodo]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create todo');
      throw err;
    }
  };

  const updateTodo = async (id: string, todoData: TodoUpdateData) => {
    try {
      setError(null);
      const updatedTodo = await TodoService.updateTodo(id, todoData);
      setTodos(prev => prev.map(todo => todo.id === id ? updatedTodo : todo));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update todo');
      throw err;
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      setError(null);
      await TodoService.deleteTodo(id);
      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete todo');
      throw err;
    }
  };

  return {
    todos,
    loading,
    error,
    createTodo,
    updateTodo,
    deleteTodo,
    refetch: fetchTodos,
  };
};
