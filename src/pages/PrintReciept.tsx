import React, { useRef, useEffect } from 'react';
import { useReactToPrint } from 'react-to-print';
import dayjs from 'dayjs';
import { GetBookByID } from '../services';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { calculatePenaltyDuration, calculatePenaltyRate } from '../utils';

export default function PrintReciept() {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const [book, setBook] = useState('');

  // Get ID from URL
  const params = useParams();

  const generateReferenceNumber = () => {
    const referenceNumber = Math.floor(100000000000 + Math.random() * 900000000000);
    return referenceNumber.toString().substring(0, 6); // Ensure it's exactly 12 digits
  };

  useEffect(() => {
    const getBookByID = async () => {
      const getBook = await GetBookByID(params.id);
      setBook(getBook);
      return getBook;
    };

    getBookByID();

    setTimeout(() => {
      handlePrint();
    }, 1000);

    // return () => {
    //   const hasBook = getBookByID();
    //   console.log('hasBook :>> ', hasBook);
    //   if (hasBook) {
    //     setTimeout(() => {
    //       handlePrint();
    //     }, 1000);
    //   }
    // };
  }, []);

  return (
    <>
      <div className="grid container mx-auto">
        <div className="flex flex-col gap-9">
          <div
            ref={componentRef}
            className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark mx-25 my-25"
          >
            <div className="flex justify-center gap-5  border border-stroke py-6  px-6.5 dark:border-strokedark">
              <img
                src="/logo/Sti-form-logo.png"
                alt=""
                className="self-center flex-shrink-0 w-30 h-24 border-lg rounded-lg md:justify-self-start dark:bg-gray-500 dark:border-gray-700"
              />
              <div className="flex flex-col text-center">
                <h4 className="lg:text-lg text-sm text-black">
                  STI ACADEMIC CENTER - CALOOCAN
                </h4>
                <p className="lg:text-lg text-sm text-black">LIBRARY</p>
                <p className="lg:text-lg text-sm text-black">
                  BOOK OVERDUE NOTICE
                </p>
                <p className="lg:text-lg text-sm text-black">
                  <strong>Date: </strong> {dayjs().format('MMM DD, YYYY')}
                </p>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="p-6.5">
                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black">
                    <strong>Name: </strong>
                    {`${book?.availability?.user.first_name} ${book?.availability?.user.last_name}`}
                  </label>
                </div>
                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black">
                    <strong>Book Title: </strong>
                    {book?.title}
                  </label>
                </div>
                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black">
                    <strong>Author: </strong>
                    {book?.author}
                  </label>
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black">
                    <strong>Date Borrowed: </strong>
                    {`${dayjs(book.availability?.borrowDate).format(
                      'MMM DD, YYYY',
                    )}`}
                  </label>
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black">
                    <strong>Date Due:</strong>{' '}
                    {`${dayjs(book?.availability?.dueDate).format(
                      'MMM DD, YYYY',
                    )}`}
                  </label>
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black">
                    <strong>Number of Days: </strong>
                    {`${calculatePenaltyDuration(book.availability?.dueDate)}`}
                  </label>
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black">
                    <strong>Amount Due: </strong>{' '}
                    {`${calculatePenaltyRate(book.availability?.dueDate)}`}
                  </label>
                </div>


                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black">
                    <strong>Reference Number: </strong>
                    {generateReferenceNumber()}
                  </label>
                </div>


                <div className=" ">
                  <div className="flex flex-wrap justify-center">
                    <div className="w-full lg:w-9/12 ">
                      <div className="flex flex-col text-center justify-center mx-50">
                        <br />
                        <img
                          src="/images/signature/samplesignature3.png"
                          alt=""
                          className="self-center flex-shrink-0"
                        />
                        <hr className="flex flex-center justify-center" />
                        <p className="text-black">Authorized Signature</p>
                        <br />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
