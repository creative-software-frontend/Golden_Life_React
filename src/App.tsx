import { RouterProvider } from 'react-router-dom';
import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { routes } from './routes/Routes';

function App() {
  return (
    <div className="dark:bg-gray-900 text-gray-900 dark:text-white scrool ">
      <RouterProvider router={routes} />
    </div>
  );
}

export default App;
