import { lazy } from 'react';

const Home = lazy(() => import('../pages/Home'));
const Circulation = lazy(() => import('../pages/Circulation'));
const Cataloging = lazy(() => import('../pages/Cataloging'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Inventory = lazy(() => import('../pages/Inventory'));
const Archives = lazy(() => import('../pages/Archives'));
const Transactions = lazy(() => import('../pages/Transactions'));
const TransactionHistories = lazy(
  () => import('../pages/TransactionHistories'),
);
const Users = lazy(() => import('../pages/Users'));
const Borrowing = lazy(() => import('../pages/Borrowing'));
const AddBook = lazy(() => import('../pages/AddBook'));
const EditBook = lazy(() => import('../pages/EditBook'));
const AddUser = lazy(() => import('../pages/AddUser'));
const EditUser = lazy(() => import('../pages/EditUser'));
const DetailedBookCard = lazy(() => import('../pages/DetailedBookCard'));
const Profile = lazy(() => import('../pages/Profile'));
const ErrorPage = lazy(() => import('../pages/ErrorPage'));

const coreRoutes = [
  {
    path: '/home',
    title: 'Home',
    component: Home,
  },
  {
    path: '/circulation',
    title: 'Circulation',
    component: Circulation,
  },
  {
    path: '/cataloging',
    title: 'Cataloging',
    component: Cataloging,
  },

  // ADMIN ROUTES STARTS HERE
  {
    path: '/dashboard',
    title: 'Dashboard',
    component: Dashboard,
  },
  {
    path: '/inventory',
    title: 'Inventory',
    component: Inventory,
  },
  {
    path: '/archives',
    title: 'Archives',
    component: Archives,
  },
  {
    path: '/transactions',
    title: 'Transactions',
    component: Transactions,
  },
  {
    path: '/transactionhistories',
    title: 'TransactionHistories',
    component: TransactionHistories,
  },
  {
    path: '/users',
    title: 'Users',
    component: Users,
  },
  {
    path: '/profile/:userId',
    title: 'Profile',
    component: Profile,
  },

  // BORROW, ADD, EDIT PATHS STARTS HERE
  {
    path: '/borrowing',
    title: 'Borrowing',
    component: Borrowing,
  },
  {
    path: '/addbook',
    title: 'AddBook',
    component: AddBook,
  },
  {
    path: '/editbook/:bookID',
    title: 'EditBook/:barcode',
    component: EditBook,
  },
  {
    path: '/adduser',
    title: 'AddUser',
    component: AddUser,
  },
  {
    path: '/edituser/:id',
    title: 'EditUser',
    component: EditUser,
  },

  // Cataloging book-card-details
  {
    path: '/cataloging/book/:id',
    title: 'Books Details',
    component: DetailedBookCard,
  },
  {
    path: '*',
    title: '404 Error Page',
    component: ErrorPage,
  },
];

const routes = [...coreRoutes];
export default routes;
