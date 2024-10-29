
import { RouterProvider } from 'react-router-dom'
import './App.css'
import { routes } from './routes/Routes'


function App() {


  return (
    <div className="  dark:bg-gray-900 text-gray-900 dark:text-white">
      <RouterProvider router={routes} />

    </div>
  )
}

export default App
