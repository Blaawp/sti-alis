import Breadcrumb from '../components/Breadcrumb';
import { Link } from 'react-router-dom';
import { BiBookAdd } from 'react-icons/bi';
import { GetRealTimeAllBooks, GetRealTimeBookHistories } from '../services';

import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

import config from '../config';

dayjs.extend(isSameOrAfter);

export default function Dashboard() {
  const [books, setBooks] = useState([]);
  const [bookHistories, setBookHistories] = useState([]);

  useEffect(() => {
    const unsubBooks = GetRealTimeAllBooks(setBooks);
    const unsubBookHistories = GetRealTimeBookHistories(setBookHistories);

    return () => {
      unsubBooks();
      unsubBookHistories();
    };
  }, []);

  const getTopBorrower = (books) => {
    // Steps:
    // get all books that is borrowed - DONE
    // identify and count all the borrower per course - DONE
    // return the top borrower based on course - DONE
    const borrowedBooks = books.filter(
      (book) => book.availability?.status === 'Borrowed',
    );

    if (!borrowedBooks) {
      return;
    }

    const unorderBorrowerStats = {};
    borrowedBooks.forEach((book) => {
      if (book.availability?.user?.course) {
        if (
          unorderBorrowerStats[book.availability?.user?.course] in borrowedBooks
        ) {
          unorderBorrowerStats[book.availability?.user?.course] += 1;
        } else {
          // Initial value for new added course
          unorderBorrowerStats[book.availability?.user?.course] = 1;
        }
      }
    });

    const orderedBorrowerStats = Object.keys(unorderBorrowerStats)
      .sort()
      .reduce((obj, key) => {
        obj[key] = unorderBorrowerStats[key];
        return obj;
      }, {});

    let currentMaxVal = 0;
    let topBorrower;
    for (const key in orderedBorrowerStats) {
      if (orderedBorrowerStats[key] > currentMaxVal) {
        currentMaxVal = orderedBorrowerStats[key];
        topBorrower = key;
      }
    }

    if (!topBorrower) {
      return 'Not available';
    }

    return topBorrower;
  };

  return (
    <>
      <Breadcrumb pageName="Dashboard" />
      <div className="my-5 flex h-full w-full flex-col items-center justify-center space-y-5 align-middle">
        <div className="flex lg:w-full sm:w-full flex-col text-black">
          <div className="flex flex-row justify-end">
            <Link to="/borrowing" className="flex flex-row">
              <BiBookAdd size="40px" />
              <p className="ml-2 text-xl font-bold">Borrow Book</p>
            </Link>
          </div>
        </div>
        {/* BORROW BOOK, OVER DUE and RETURNED BOOK CONTAINERS */}
        <div className="grid grid-col-1 w-full gap-9 sm:grid-cols-4">
          <div className="flex flex-col gap-2">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark pb-6">
              <div className="flex justify-center  border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                <h3 className="font-bold text-black dark:text-white">
                  Borrowed Book
                </h3>
              </div>
              <div className="h-content m-auto flex w-4/5 flex-col rounded-lg bg-[#fdfdfd] p-2 shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="flex justify-center items-center lg:h-55 h-20">
                  <h4 className="font-bold text-warning text-6xl">
                    {
                      books.filter(
                        (book) => book.availability?.status === 'Borrowed',
                      ).length
                    }
                  </h4>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark pb-6">
              <div className="flex justify-center  border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                <h3 className="font-bold text-black dark:text-white">
                  Top Borrower
                </h3>
              </div>
              <div className="h-content m-auto flex w-4/5 flex-col rounded-lg bg-[#fdfdfd] p-2 shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="flex justify-center items-center lg:h-55 h-20">
                  <h4 className="font-bold text-meta-1 text-2xl text-center">
                    {bookHistories && getTopBorrower(bookHistories)}
                  </h4>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark pb-6">
              <div className="flex justify-center  border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                <h3 className="font-bold text-black dark:text-white">
                  Over Due Book
                </h3>
              </div>
              <div className="h-content m-auto flex w-4/5 flex-col rounded-lg bg-[#fdfdfd] p-2 shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="flex justify-center items-center lg:h-55 h-20">
                  <h4 className="font-bold text-meta-1 text-6xl">
                    {
                      books.filter(
                        (book) =>
                          book.availability?.status === 'Borrowed' &&
                          dayjs().isSameOrAfter(
                            dayjs(book.availability.dueDate),
                          ),
                      ).length
                    }
                  </h4>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark pb-6">
              <div className="flex justify-center  border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                <h3 className="font-bold text-black dark:text-white">
                  Returned Book
                </h3>
              </div>
              <div className="h-content m-auto flex w-4/5 flex-col rounded-lg bg-[#fdfdfd] p-2 shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="flex justify-center items-center lg:h-55 h-20">
                  <h4 className="font-bold text-success text-6xl">
                    {
                      bookHistories.filter(
                        (history) => history.availability?.status === 'Return',
                      ).length
                    }
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
