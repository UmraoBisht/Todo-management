import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export interface Todo {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
}

interface TodosState {
  items: Todo[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: TodosState = {
  items: [],
  status: 'idle',
  error: null,
};


// Fetch todos method
export const fetchTodos = createAsyncThunk('todos/fetchTodos', async () => {
  const response = await fetch('https://jsonplaceholder.typicode.com/todos');
  const data = await response.json();
  return data.map((todo: any) => ({
    ...todo,
    description: `Task ${todo.id} description`,
  }));
});

// Add todo method
export const addTodo = createAsyncThunk(
  'todos/addTodo',
  async (todo: Omit<Todo, 'id'>) => {
    const response = await fetch('https://jsonplaceholder.typicode.com/todos', {
      method: 'POST',
      body: JSON.stringify(todo),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });
    return await response.json();
  }
);

// Update todo method
export const updateTodo = createAsyncThunk(
  'todos/updateTodo',
  async (todo: Todo) => {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/todos/${todo.id}`,
      {
        method: 'PATCH',
        body: JSON.stringify(todo),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }
    );
    return await response.json();
  }
);

// Delete todo method
export const deleteTodo = createAsyncThunk(
  'todos/deleteTodo',
  async (id: number) => {
    await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
      method: 'DELETE',

    });
    return { id };
  });

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetch todos action
      .addCase(fetchTodos.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })

      // add todo action
      .addCase(addTodo.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items.push(action.payload);
      })
      .addCase(addTodo.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addTodo.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })

      // update todo action
      .addCase(updateTodo.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateTodo.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.items.findIndex(
          (todo) => todo.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateTodo.rejected, (state, action) => {
       state.status = 'failed';
       state.error = action.error.message || null;
      })

      // delete todo action
      .addCase(deleteTodo.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = state.items.filter(
          (todo) => todo.id !== action.payload.id
        );

      })
      .addCase(deleteTodo.rejected, (state,action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      });
  },
});

export default todosSlice.reducer;