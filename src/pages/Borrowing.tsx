import Breadcrumb from '../components/Breadcrumb';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjsBusinessDays from 'dayjs-business-days';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import BookCard from '../components/BookCard';
import { useAtomValue } from 'jotai';
import { sessionAtom } from '../Store';
import dayjs from 'dayjs';

import {
  GetAllBooks,
  BorrowBook,
  IsUserExistByStudentNumber,
} from '../services';

import config from '../config';

export default function Borrowing() {
  dayjs.extend(dayjsBusinessDays);

  const navigate = useNavigate();
  const [displayedBook, setDisplayedBook] = useState(null);
  const [dueDate, setDueDate] = useState(dayjs().businessDaysAdd(7, 'day'));
  const [borrowDate, setBorrowDate] = useState(dayjs());
  const [userId, setUserId] = useState('');
  const [userCourse, setUserCourse] = useState('');
  const [borrowRes, setBorrowRes] = useState(null);
  const [isBtnDisabled, setIsBtnDisabled] = useState(true);
  const [isBorrowedBookAvailable, setisBorrowedBookAvailable] = useState(true);
  const [studentNum, setStudentNum] = useState('');
  const [isStudentNumberDoesExist, setIsStudentNumberDoesExist] =
    useState(false);
  const [borrower, setBorrower] = useState('');

  const session = useAtomValue(sessionAtom);
  const [books, setBooks] = useState([]);

  // Date picker

  const isWeekend = (date) => {
    const day = date.day();

    return day === 0 || day === 6;
  };

  useEffect(() => {
    const fetchBooks = async () => {
      const books = await GetAllBooks();

      setBooks(books);
    };

    fetchBooks();
  }, []);

  // const handleScanBarcode = (e) => {
  //   const barcode = e.target.value;
  //   const hasBook = books.filter((b) => b.barcode === barcode);

  //   if (hasBook.length > 0) {


  //     setDisplayedBook({ ...hasBook[0] });
  //     if (!hasBook[0].availability) {
  //       // set the borrow btn to disabled if status was borrowed
  //       setIsBtnDisabled(false);
  //       alert("Book has already reached maximum number of borrowed quantity.")

  //     }
  //   } else {
  //     console.log("mamamomomomo")
  //     setDisplayedBook(null);
  //     setIsBtnDisabled(true);
  //   }
  // };

  const handleScanBarcode = (e) => {
    const barcode = e.target.value;
    console.log(barcode)
    const hasBook = books.filter((b) => b.barcode === barcode);

    console.log(hasBook)

    if (hasBook.length > 0) {
      setDisplayedBook({ ...hasBook[0] });
      console.log("available")

      if (hasBook[0].availability) {
        console.log("not available")
        setisBorrowedBookAvailable(false);
        alert("Book has already reached maximum number of borrowed quantity.");
      } else {
        setisBorrowedBookAvailable(true);
      }
    } else {
      setDisplayedBook(null);
      // setisBorrowedBookAvailable(true);
    }
  };

  // const handleScanBarcode = (e) => {
  //   const barcode = e.target.value;
  //   const hasBook = books.filter((b) => b.barcode === barcode);

  //   if (hasBook.length > 0) {


  //     setDisplayedBook({ ...hasBook[0] });
  //     if (!hasBook[0].availability) {
  //       // set the borrow btn to disabled if status was borrowed
  //       setIsBtnDisabled(false);
  //       alert("Book has already reached maximum number of borrowed quantity.")

  //     }
  //   } else {
  //     console.log("mamamomomomo")
  //     setDisplayedBook(null);
  //     setIsBtnDisabled(true);
  //   }
  // };

  // const handleStudentNumber = async (e) => {
  //   const studentNum = e.target.value;

  //   setStudentNum(studentNum);

  //   const isStudentNumExist = await IsUserExistByStudentNumber(studentNum);

  //   if (isStudentNumExist) {
  //     setIsStudentNumberDoesExist(true);
  //     setBorrower(isStudentNumExist);

  //     // Will enable button only if book is available
  //     if (displayedBook && !displayedBook.availability) {

  //       setIsBtnDisabled(false);
  //     }

  //     // will enable button if book status was reserved and
  //     // student information matches with the name who reserved
  //     // the book
  //     if (
  //       displayedBook.availability.status === config.BOOK_STATUSES.RESERVED &&
  //       displayedBook.availability.user.user_id === studentNum
  //     ) {
  //       setIsBtnDisabled(false);
  //     }
  //   } else {
  //     setIsStudentNumberDoesExist(false);
  //     setBorrower(false);
  //     console.log("user does not exist")
  //     return
  //     // alert("Book has already reached maximum number of borrowed quantity.")
  //     // setIsBtnDisabled(true);
  //   }
  //   console.log("user exists")
  // };

  // FOR DEBUGGING ONLY
  // useEffect(() => {
  //   console.log('isStudentNumberDoesExist changed:', isStudentNumberDoesExist);
  // }, [isStudentNumberDoesExist]);

  const handleStudentNumber = async (e) => {
    const studentNum = e.target.value;

    setStudentNum(studentNum);

    const isStudentNumExist = await IsUserExistByStudentNumber(studentNum);

    setIsStudentNumberDoesExist(isStudentNumExist);

    if (isStudentNumExist) {
      setBorrower(isStudentNumExist);

      // Additional conditions for enabling the button can be added here if needed
      // if (displayedBook && !displayedBook.availability) {
      //   setIsBtnDisabled(false);
      // }
    } else {
      setBorrower(false);
      setIsStudentNumberDoesExist(false)
      console.log("user does not exist");
      return;
    }

    console.log("user exists");
    setIsStudentNumberDoesExist(true)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!displayedBook || !studentNum || !borrowDate || !dueDate) {
      alert("Make sure that the details you provided are correct.");
      return;
    }

    if (!isStudentNumberDoesExist){
      alert("Student number does not exist.")
      return
    }

    if (!isBorrowedBookAvailable) {
      alert("Book has already reached maximum number of borrowed quantity.")
      return
    }

    const availability = {
      availability: {
        borrowDate: borrowDate.format(),
        dueDate: dueDate.format(),
        status: 'Borrowed',
        user: borrower,
      },
    };

    await BorrowBook(displayedBook.id, displayedBook, availability);

    navigate('/dashboard'); // redirect to librarian's dashboard
  };

  return (
    <>
      <Breadcrumb pageName="Borrowing" />
      <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
        <div className="flex flex-col gap-9">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="flex justify-between  border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Borrowing Book
              </h3>
              <Link
                to="/Dashboard"
                className="inline-flex items-center justify-center rounded-full bg-primary py-2 px-6 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-5"
              >
                Back
              </Link>
            </div>
            <form>
              <div className="p-6.5">
                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Barcode
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your barcode here"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    onChange={(e) => handleScanBarcode(e)}
                    required
                  />
                  {!isBorrowedBookAvailable && (
                    <p className="text-red-500 text-sm mt-1">
                      The book has reached the maximum number of borrowed quantity.
                    </p>
                  )}
                </div>




                {/* <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Student Number
                  </label>
                  <input
                    type="text"
                    placeholder="Enter student number"
                    className="w-full rounded border-[1.5px] bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    style={{
                      borderColor: isStudentNumberDoesExist ? 'var(--color-stroke)' : 'var(--color-red-500)',
                    }}
                    required
                    value={studentNum}
                    onChange={handleStudentNumber}
                  />
                </div> */}

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Student Number
                  </label>
                  <input
                    type="text"
                    placeholder="Enter student number"
                    className={`w-full rounded border-[1.5px] bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${isStudentNumberDoesExist ? 'border-stroke' : 'border-red-500'
                      }`}
                    required
                    value={studentNum}
                    onChange={handleStudentNumber}
                  />
                  {!isStudentNumberDoesExist && (
                    <p className="text-red-500 text-sm mt-1">Student number does not exist</p>
                  )}
                </div>

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <div className="mb-4.5">
                    <label className="mb-3 block text-black dark:text-white">
                      Borrow Date:
                    </label>
                    <div className="relative">
                      <DatePicker
                        className="custom-input-date custom-input-date-1 w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        value={borrowDate}
                        onChange={(e) => setBorrowDate(e)}
                        disablePast
                        disableFuture
                        shouldDisableDate={isWeekend}
                      />
                    </div>
                  </div>

                  <div className="mb-4.5">
                    <label className="mb-3 block text-black dark:text-white">
                      Due Date
                    </label>
                    <div className="relative">
                      <DatePicker
                        className="custom-input-date custom-input-date-1 w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        value={dueDate}
                        onChange={(e) => setDueDate(e)}
                        disablePast
                        maxDate={dayjs().businessDaysAdd(7, 'day')}
                        shouldDisableDate={isWeekend}
                      />
                    </div>
                  </div>
                </LocalizationProvider>

                <button
                  type="submit"
                  className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray"
                  onClick={handleSubmit}
                // disabled={isBtnDisabled}
                >
                  Borrow
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="flex justify-between  border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Book information
              </h3>
            </div>

            {displayedBook && <BookCard {...displayedBook} withStatus={true} />}
          </div>

          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="flex justify-between  border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Student Information
              </h3>
            </div>
            {borrower && (
              <div className="h-content m-auto flex w-4/5 flex-col rounded-lg bg-[#fdfdfd] p-2 shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="mb-2.5 text-black dark:text-meta-3">
                  Student No: {borrower.user_id}
                </div>
                <div className="mb-2.5 text-black dark:text-meta-3">
                  Name: {`${borrower.first_name} ${borrower.last_name}`}
                </div>
                <div className="mb-2.5 text-black dark:text-meta-3">
                  Course: {borrower.course}
                </div>
                <div className="mb-2.5 text-black dark:text-meta-3">
                  Contact Number: {borrower.contact_num}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
