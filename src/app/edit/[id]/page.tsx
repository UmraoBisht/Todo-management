'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { updateTodo } from '@/lib/store/todosSlice';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation'
import { AppDispatch, RootState } from '@/lib/store/store';

// Ui Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';

export default function EditTask() {
  const params = useParams<{ id: string }>()
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const todo = useSelector((state: RootState) =>
    state.todos.items.find((t) => t.id === parseInt(params.id))
  );

  const [title, setTitle] = useState(todo?.title || '');
  const [description, setDescription] = useState(todo?.description || '');
  const [completed, setCompleted] = useState(todo?.completed || false);

  useEffect(() => {
    if (!todo) {
      router.push('/');
    }
  }, [todo, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (todo) {
      await dispatch(
        updateTodo({
          id: todo.id,
          title,
          description,
          completed,
        })
      );
      router.push('/');
    }
  };

  if (!todo) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="inline-flex items-center mb-6 text-primary">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to List
        </Link>

        <Card className="p-6">
          <h1 className="text-3xl font-bold mb-8">Edit Task</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Enter task title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Description
              </label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter task description"
                rows={4}
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Mark as completed</label>
              <Switch
                checked={completed}
                onCheckedChange={setCompleted}
              />
            </div>

            <Button type="submit" className="w-full">
              Update Task
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}