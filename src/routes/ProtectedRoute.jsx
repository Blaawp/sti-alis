import { useAtomValue } from 'jotai';
import { sessionAtom } from '../Store';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({
  children,
  cannotAccess = ({ session }) => !session,
  to = '/',
}) {
  const session = useAtomValue(sessionAtom);

  if (cannotAccess({ session })) {
    return <Navigate to={to} />;
  }

  return children;
}
