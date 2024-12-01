/** @format */

import { useState } from 'react';
import { useTodoQuery, useTodoMutations } from '../data';
import PropTypes from 'prop-types';
import Trash from '../assets/icons8-trash.svg';
import Plus from '../assets/icons8-plus.svg';
import TodoHeader from './TodoHeader';
import './Todo.css';

const TodoList = ({ feversocial }) => {
	const { data: initialTodos } = useTodoQuery(feversocial.id);
	const { addTodoMutation, deleteTodoMutation, toggleTodoMutation } = useTodoMutations(feversocial.id);

	const [newTodo, setNewTodo] = useState('');

	const progress = `${initialTodos.filter((todo) => todo.completed).length}/${initialTodos.length}`;

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!newTodo.trim()) return;

		await addTodoMutation.mutateAsync({
			text: newTodo,
			completed: false,
		});

		setNewTodo('');
	};

	const handleDelete = async (id) => {
		await deleteTodoMutation.mutateAsync(id);
	};

	const toggleTodo = async (id) => {
		await toggleTodoMutation.mutateAsync(id);
	};

	return (
		<div className='todo-container'>
			<TodoHeader />

			<main className='todo-main'>
				<div className='progress-indicator'>進度：{progress}</div>

				<div className='todo-list'>
					{initialTodos.map((todo) => (
						<div
							key={todo.id}
							className='todo-item'
						>
							<input
								type='checkbox'
								checked={todo.completed}
								onChange={() => toggleTodo(todo.id)}
								className='todo-checkbox'
								disabled={toggleTodoMutation.isPending}
							/>
							<span className={`todo-text ${todo.completed ? 'completed' : ''}`}>{todo.text}</span>
							<button
								onClick={() => handleDelete(todo.id)}
								className='delete-button'
								disabled={deleteTodoMutation.isPending}
							>
								{deleteTodoMutation.isPending ? (
									'...'
								) : (
									<img
										src={Trash}
										alt='Trash icon for delete'
									/>
								)}
							</button>
						</div>
					))}
				</div>

				<form
					onSubmit={handleSubmit}
					className='todo-form'
				>
					<div className='input-container'>
						<input
							type='text'
							value={newTodo}
							onChange={(e) => setNewTodo(e.target.value)}
							placeholder='請輸入要完成的事項...'
							className='todo-input'
							disabled={addTodoMutation.isPending}
						/>
						<button
							type='submit'
							className='add-button'
							disabled={addTodoMutation.isPending}
						>
							{addTodoMutation.isPending ? (
								'...'
							) : (
								<img
									src={Plus}
									alt='Plus icon to add new todo'
								/>
							)}
						</button>
					</div>
				</form>
			</main>
		</div>
	);
};

export default TodoList;

TodoList.propTypes = {
	feversocial: PropTypes.object.isRequired,
};
