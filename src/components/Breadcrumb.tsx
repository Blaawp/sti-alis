import { Link } from 'react-router-dom';
import { useAtomValue } from 'jotai';
import { sessionAtom } from '../Store';

interface BreadcrumbProps {
  pageName: string;
}
const Breadcrumb = ({ pageName }: BreadcrumbProps) => {
  const session = useAtomValue(sessionAtom);

  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-title-md2 font-semibold text-black dark:text-white">
        {pageName}
      </h2>

      <nav>
        <ol className="flex items-center gap-2">
          {pageName !== 'Dashboard' && session.role === 'admin' ? (
            <li>
              <Link to="/">Dashboard /</Link>
            </li>
          ) : (
            ''
          )}

          {pageName !== 'Home' && session.role === 'student' ? (
            <li>
              <Link to="/home">Home /</Link>
            </li>
          ) : (
            ''
          )}
          <li className="text-primary">{pageName}</li>
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;
