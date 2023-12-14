import { Suspense, lazy, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './routes/ProtectedRoute';

import Login from './pages/Login';
import Loader from './common/Loader';
import routes from './routes';
import ErrorPage from './pages/ErrorPage';
import PrintReciept from './pages/PrintReciept';

const DefaultLayout = lazy(() => import('./layout/DefaultLayout'));

function App() {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
        containerClassName="overflow-auto"
      />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="*" element={<ErrorPage />} />
        <Route
          path="/transactions/:id/printReciept"
          element={<PrintReciept />}
        />
        <Route
          element={
            <ProtectedRoute>
              <DefaultLayout />
            </ProtectedRoute>
          }
        >
          {/* THE DEFAULT IS ECommerce */}
          {/* <Route index element={<Login />} /> */}
          {routes.map((routes, index) => {
            const { path, component: Component } = routes;
            return (
              <Route
                key={index}
                path={path}
                element={
                  <Suspense fallback={<Loader />}>
                    <ProtectedRoute>
                      <Component />
                    </ProtectedRoute>
                  </Suspense>
                }
              />
            );
          })}
        </Route>
      </Routes>
    </>
  );
}

export default App;
