/** @format */

import Setting from '../assets/icons8-setting.svg';

const TodoHeader = () => {
	return (
		<header className='todo-header'>
			<div className='header-content'>
				<button className='menu-button'>☰</button>
				<h1 className='header-title'>Todo List</h1>
			</div>
			<div className='header-right'>
				<button className='settings-button'>
					<img
						src={Setting}
						alt='Setting button for open tabs'
					/>
				</button>
			</div>
		</header>
	);
};

export default TodoHeader;
