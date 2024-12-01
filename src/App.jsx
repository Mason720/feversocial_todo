/** @format */
import { Suspense } from 'react';
import Todos from './components/Todos';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			suspense: true,
		},
	},
});

export default function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<>
				<Suspense fallback={<Loading />}>
					<Todos
						feversocial={{
							id: 'fever1',
						}}
					/>
				</Suspense>
			</>
		</QueryClientProvider>
	);
}
function Loading() {
	return <h2>🌀 Loading...</h2>;
}
