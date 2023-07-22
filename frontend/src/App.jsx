import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import RootLayout from './pages/Root';
import AuthPage, { action as userAuth } from './pages/Auth';
import BookingPage, { loader as getBookings } from './pages/Bookings';
import Events, { action as createEvents, loader as getEvents } from './pages/Events';
import { action as cancelBooking } from './components/Bookings/BookingList'
import AuthProvider from './context/AuthProvider.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <h1>Error</h1>,
    children: [
      { path: 'auth', element: <AuthPage />, action: userAuth },
      { path: 'events', element: <Events />, action: createEvents, loader: getEvents },
      { path: 'bookings', element: <BookingPage />, loader: getBookings, action: cancelBooking }
    ]
  }
]);


function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
