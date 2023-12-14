import Breadcrumb from '../components/Breadcrumb';
import BookCard from '../components/BookCard';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GetRealTimeAllBooks } from '../services';
import { useAtomValue } from 'jotai';
import { sessionAtom } from '../Store';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import { filterBooksByStatus } from '../utils';
import config from '../config';
dayjs.extend(isSameOrAfter);

export default function Circulation() {
  const [searchTerm, setSearchTerm] = useState('');

  const [books, setBooks] = useState([]);
  const session = useAtomValue(sessionAtom);

  useEffect(() => {
    const unsubGetRealTimeAllBooks = GetRealTimeAllBooks(setBooks);

    return () => {
      unsubGetRealTimeAllBooks();
    };
  }, []);

  const navigate = useNavigate();

  return (
    <>
      <Breadcrumb pageName="Circulation" />
      <div className="my-5 flex h-full lg:w-full sm:90 w-110 flex-col items-center justify-center space-y-5 align-middle">
        <div className="w-full md:w3/5 lg:w-1/2 flex flex-col rounded-md sm:w-3/4 text-black hover:cursor-pointer gap-5 border-solid border-r-meta-1">
          {books &&
            filterBooksByStatus(books, config.BOOK_STATUSES.BORROWED).map(
              (book, idx) => (
                <>
                  <div
                    className={`{${
                      dayjs().isSameOrAfter(book.availability.dueDate, 'day')
                        ? `border border-dotted border-4 border-meta-1`
                        : ''
                    }`}
                  >
                    <BookCard
                      {...book}
                      key={idx}
                      isCirculation={true}
                      availability={book.availability}
                      className="border-solid"
                    />
                  </div>
                </>
              ),
            )}
        </div>
      </div>
    </>
  );
}
