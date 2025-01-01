'use client';

// node modules
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AppDispatch, RootState } from '@/lib/store/store';
import { useDispatch, useSelector } from 'react-redux';
import { CheckCircle, PlusCircle, Trash, XCircle } from 'lucide-react';
import { deleteTodo, fetchTodos } from '@/lib/store/todosSlice';


//Ui Components
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';


// homepage component (default)
export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const { items: todos, status, error } = useSelector(
    (state: RootState) => state.todos
  );

  const handleDeleteTodo = (id: number) => {
    dispatch(deleteTodo(Number(id)));
  }


  // initial fetch todos
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchTodos());
    }
  }, [status, dispatch]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }


  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Todo List</h1>
        <Link href="/add">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {todos.map((todo: any) => (
          <Card key={todo.id} className="p-6">
            <AlertDialog>
              <AlertDialogTrigger>
                <Trash className="mr-2 h-4 w-4 text-red-500" />
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure want to delete this todo?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your Todo.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleDeleteTodo(todo.id)}>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">{todo.title}</h3>
                <p className="text-muted-foreground">{todo.description}</p>
              </div>
              {todo.completed ? (
                <CheckCircle className="h-6 w-6 text-green-500" />
              ) : (
                <XCircle className="h-6 w-6 text-red-500" />
              )}
            </div>
            <div className="mt-4">
              <Link href={`/edit/${todo.id}`}>
                <Button variant="outline" className="w-full">
                  Edit Task
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}





