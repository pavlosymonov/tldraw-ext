import { useEffect } from 'react'
import { Tldraw } from '@tldraw/tldraw'
import { useEditor } from '@tldraw/editor'
import { getAssetUrlsByMetaUrl } from '@tldraw/assets/urls'
import '@tldraw/tldraw/tldraw.css'
import './App.css'

const assetUrls = getAssetUrlsByMetaUrl((asset: string) => asset)

const InsideOfEditorContext = () => {
	const editor = useEditor()

	useEffect(() => {	
		const handleStorage = () => {
			const isDarkMode = localStorage.getItem('darkMode')

			editor.user.updateUserPreferences({
				isDarkMode: isDarkMode === 'false' ? false : true
			})
		}
		handleStorage()
		
		window.addEventListener('storage', handleStorage)
		return () => {
			window.removeEventListener('storage', handleStorage)
		}
}, [])

	return null
}

function App() {
	return (
		<div className="tldraw__editor">
			<Tldraw persistenceKey='tldraw-board' autoFocus assetUrls={assetUrls}>
				<InsideOfEditorContext/>
			</Tldraw>
		</div>
	)
}

export default App
