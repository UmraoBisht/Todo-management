'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { AppDispatch } from '@/lib/store/store';
import { addTodo } from '@/lib/store/todosSlice';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';


// Ui Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';


// add task method
export default function AddTask() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(
      addTodo({
        title,
        description,
        completed: false,
      })
    );
    router.push('/');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="inline-flex items-center mb-6 text-primary">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to List
        </Link>

        <Card className="p-6">
          <h1 className="text-3xl font-bold mb-8">Add New Task</h1>

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

            <Button type="submit" className="w-full">
              Add Task
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}