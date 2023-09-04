import { useEffect } from 'react';
import { Tldraw } from '@tldraw/tldraw';
import { useEditor } from '@tldraw/editor'
import '@tldraw/tldraw/tldraw.css';
import './App.css';

const InsideOfEditorContext = () => {
	const editor = useEditor()

	useEffect(() => {
		const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
		editor.user.updateUserPreferences({ isDarkMode })

		const onDarkModeChange = (event: MediaQueryListEvent) => {
			const isDarkMode: boolean = event.matches;
			console.log(isDarkMode)
	
			editor.user.updateUserPreferences({ isDarkMode: isDarkMode })
		}

		window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', onDarkModeChange);
		return () => {
			window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', onDarkModeChange);
		}
	}, [])

	return null
}

function App() {
	return (
		<div className="tldraw__editor">
			<Tldraw persistenceKey='tldraw-board' autoFocus>
				<InsideOfEditorContext/>
			</Tldraw>
		</div>
	)
}

export default App;
