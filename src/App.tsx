
import { RouterProvider } from 'react-router-dom'
import './App.css'
import { routes } from './routes/Routes'


function App() {


  return (
    <div className="min-h-0 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <RouterProvider router={routes} />

    </div>
  )
}

export default App
