import BookCard from '../components/BookCard';
import Breadcrumb from '../components/Breadcrumb';
import SearchBar from '../components/SearchBar';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GetRealTimeAllBooks } from '../services';
import { sessionAtom } from '../Store';
import { useAtomValue } from 'jotai';
import config from '../config';
import { filterBooksByStatus } from '../utils';

export default function Cataloging() {
  const [searchTerm, setSearchTerm] = useState('');

  const [books, setBooks] = useState([]);
  const [ungroupedBooks, setUngroupedBooks] = useState([]);
  const session = useAtomValue(sessionAtom);

  useEffect(() => {
    const IS_GROUP_BY_QTY = true;
    const unsubGetRealTimeAllBooks = GetRealTimeAllBooks(
      setBooks,
      IS_GROUP_BY_QTY,
    );
    // we can't get the actual borrowed books because if IS_GROUP_BY_QTY
    // it will try to group the book into 1 record only hence we need
    // to call the func again without qty to have a distinct records of book
    const unsubGetAllBooks = GetRealTimeAllBooks(setUngroupedBooks);

    return () => {
      unsubGetRealTimeAllBooks();
      unsubGetAllBooks();
    };
  }, []);

  const navigate = useNavigate();

  return (
    <>
      <Breadcrumb pageName="Cataloging" />
      <div className="my-5 flex h-full w-full flex-col items-center justify-center space-y-5 align-middle">
        <SearchBar
          setSearchTerm={setSearchTerm}
          placeholder="Search by book title..."
        />

        <div className="my-5 flex h-full lg:w-full sm:90 w-110 flex-col items-center justify-center space-y-5 align-middle">
          <div className="w-full md:w3/5 lg:w-1/2 flex flex-col rounded-md sm:w-3/4 text-black gap-5">
            <p>
              Total Borrowed Books:{' '}
              {books &&
                filterBooksByStatus(
                  ungroupedBooks,
                  config.BOOK_STATUSES.BORROWED,
                ).length}
            </p>
            <p>
              Total Reserved Books:{' '}
              {books &&
                filterBooksByStatus(
                  ungroupedBooks,
                  config.BOOK_STATUSES.RESERVED,
                ).length}
            </p>
            {books &&
              books
                .filter((val) => {
                  if (searchTerm == '') {
                    return val;
                  } else if (
                    val.title
                      .toLowerCase()
                      .includes(searchTerm.toLocaleLowerCase())
                  ) {
                    return val;
                  }
                })
                .map((book, idx) => (
                  <div>
                    <BookCard
                      {...book}
                      key={idx}
                      withStatus={true}
                      isReservation={true}
                      isCatalog={true}
                      user={session}
                      // Total requested book will be
                      // reseved  + borrowed books
                      totalRequestedBook={
                        filterBooksByStatus(
                          ungroupedBooks,
                          config.BOOK_STATUSES.RESERVED,
                        ).length +
                        filterBooksByStatus(
                          ungroupedBooks,
                          config.BOOK_STATUSES.BORROWED,
                        ).length
                      }
                    />
                  </div>
                ))}
          </div>
        </div>
      </div>
    </>
  );
}
