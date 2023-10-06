import { Toaster } from 'sonner'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { RunVersion } from './pages/RunVersion'
import { GenerateVersion } from './pages/GenerateVersion'
import { Root } from './components/Root'

const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      {
        path: '/',
        Component: RunVersion
      },
      {
        path: 'generate',
        loader: async () => {
          const data = await window.api.getCompileData()
          return { data }
        },
        Component: GenerateVersion
      }
    ]
  }
])

const App: React.FC = () => {
  return (
    <div>
      <Toaster richColors />
      <RouterProvider router={router} />
    </div>
  )
}

export default App
