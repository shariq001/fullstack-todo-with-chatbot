'use client';

import { useState } from 'react';
import { TodoItem as TodoItemType, TodoUpdateData } from '@/lib/types';

interface TodoItemProps {
  todo: TodoItemType;
  onUpdate: (id: string, data: TodoUpdateData) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export default function TodoItem({ todo, onUpdate, onDelete }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.title);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    setIsLoading(true);
    try {
      await onUpdate(todo.id, { is_completed: !todo.is_completed });
    } catch (error) {
      console.error('Failed to update todo:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async () => {
    if (editText.trim() === '') return;

    setIsLoading(true);
    try {
      await onUpdate(todo.id, { title: editText.trim() });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update todo:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setIsLoading(true);
      try {
        await onDelete(todo.id);
      } catch (error) {
        console.error('Failed to delete todo:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <li className={`bg-white rounded-lg shadow-sm border ${todo.is_completed ? 'border-green-200 bg-green-50/50' : 'border-gray-200'} p-4 transition-all duration-200 hover:shadow-md`}>
      <div className="flex items-start">
        <input
          type="checkbox"
          checked={todo.is_completed}
          onChange={handleToggle}
          disabled={isLoading}
          className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500 mt-0.5 flex-shrink-0"
        />

        <div className="ml-3 flex-1 min-w-0">
          {isEditing ? (
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="flex-1 min-w-0 block w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleEdit()}
              />
              <div className="flex space-x-2">
                <button
                  onClick={handleEdit}
                  disabled={isLoading}
                  className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition duration-200"
                >
                  {isLoading ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditText(todo.title);
                  }}
                  className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className={`text-base font-medium ${todo.is_completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                  {todo.title}
                </p>
                {todo.description && (
                  <p className="mt-1 text-sm text-gray-500 break-words">
                    {todo.description}
                  </p>
                )}
                <p className="mt-2 text-xs text-gray-400">
                  Created: {new Date(todo.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="mt-2 sm:mt-0 flex space-x-2">
                <button
                  onClick={() => setIsEditing(true)}
                  disabled={isLoading}
                  className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition duration-200"
                >
                  <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isLoading}
                  className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 transition duration-200"
                >
                  <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </li>
  );
}
