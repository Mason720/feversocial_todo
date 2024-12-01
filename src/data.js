/** @format */

import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query';

const initialTodos = [
	{ id: 1, text: '一天一蘋果, 醫生遠離我', completed: false },
	{ id: 2, text: '投籃 1000 次', completed: false },
	{ id: 3, text: '完成 pre test 作業', completed: true },
];

async function getTodos() {
	// Simulate async data fetching
	await new Promise((resolve) => {
		setTimeout(resolve, 500);
	});

	// Retrieve from localStorage or return initial data
	const storedTodos = localStorage.getItem('todos');
	return storedTodos ? JSON.parse(storedTodos) : initialTodos;
}

export function useTodoQuery(feversocialId) {
	return useQuery({
		queryKey: ['todos', feversocialId],
		queryFn: getTodos,
	});
}

export function useTodoMutations(feversocialId) {
	const queryClient = useQueryClient();

	const updateLocalStorage = (todos) => {
		localStorage.setItem('todos', JSON.stringify(todos));
	};

	const addTodoMutation = useMutation({
		mutationFn: async (newTodo) => {
			await new Promise((resolve) => setTimeout(resolve, 2000));
			return newTodo;
		},
		onMutate: async (newTodo) => {
			await queryClient.cancelQueries({ queryKey: ['todos', feversocialId] });

			const previousTodos = queryClient.getQueryData(['todos', feversocialId]) || [];

			const newTodoItem = {
				...newTodo,
				id: Date.now(),
				completed: false,
			};

			const updatedTodos = [...previousTodos, newTodoItem];

			queryClient.setQueryData(['todos', feversocialId], updatedTodos);
			updateLocalStorage(updatedTodos);

			return { previousTodos };
		},
		onError: (err, newTodo, context) => {
			queryClient.setQueryData(['todos', feversocialId], context.previousTodos);
			updateLocalStorage(context.previousTodos);
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ['todos', feversocialId] });
		},
	});

	const deleteTodoMutation = useMutation({
		mutationFn: async (todoId) => {
			await new Promise((resolve) => setTimeout(resolve, 2000));
			return todoId;
		},
		onMutate: async (todoId) => {
			await queryClient.cancelQueries({ queryKey: ['todos', feversocialId] });

			const previousTodos = queryClient.getQueryData(['todos', feversocialId]) || [];

			const updatedTodos = previousTodos.filter((todo) => todo.id !== todoId);

			queryClient.setQueryData(['todos', feversocialId], updatedTodos);
			updateLocalStorage(updatedTodos);

			return { previousTodos };
		},
		onError: (err, todoId, context) => {
			queryClient.setQueryData(['todos', feversocialId], context.previousTodos);
			updateLocalStorage(context.previousTodos);
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ['todos', feversocialId] });
		},
	});

	const toggleTodoMutation = useMutation({
		mutationFn: async (todoId) => {
			await new Promise((resolve) => setTimeout(resolve, 500));
			return todoId;
		},
		onMutate: async (todoId) => {
			await queryClient.cancelQueries({ queryKey: ['todos', feversocialId] });

			const previousTodos = queryClient.getQueryData(['todos', feversocialId]) || [];

			const updatedTodos = previousTodos.map((todo) =>
				todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
			);

			queryClient.setQueryData(['todos', feversocialId], updatedTodos);
			updateLocalStorage(updatedTodos);

			return { previousTodos };
		},
		onError: (err, todoId, context) => {
			queryClient.setQueryData(['todos', feversocialId], context.previousTodos);
			updateLocalStorage(context.previousTodos);
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ['todos', feversocialId] });
		},
	});

	return {
		addTodoMutation,
		deleteTodoMutation,
		toggleTodoMutation,
	};
}
