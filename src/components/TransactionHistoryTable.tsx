// import React from 'react'
import DropDown from './DropDown';
import TransactionHistoryList from './TransactionHistoryList.jsx';
import SearchBar from './SearchBar.jsx';
import { useState } from 'react';

export default function TransactionHistoryTable({ transactions }) {
  const [status, setStatus] = useState('Borrowed');
  const [searchTerm, setSearchTerm] = useState('');

  const DROPDOWN_OPTIONS = [
    {
      label: 'All',
      value: 'All',
    },
    {
      label: 'Borrowed Books',
      value: 'Borrowed',
    },
    {
      label: 'Returned Books',
      value: 'Return',
    },
    {
      label: 'Reserved Books',
      value: 'Reserved',
    },
    {
      label: 'Reservation Expired Books',
      value: 'Reservation Expired',
    },
  ];

  const [selected, setSelected] = useState(DROPDOWN_OPTIONS[0]);

  return (
    <div className="my-2 flex h-full w-full flex-col items-center justify-center space-y-10 align-middle">
      <div className="flex-start mb-5 flex w-full items-center justify-center gap-5">
        <DropDown
          options={DROPDOWN_OPTIONS}
          selected={selected}
          setSelected={setSelected}
        />
        <SearchBar
          placeholder={`Search by barcode, student number, student name...`}
          setSearchTerm={setSearchTerm}
        />
        {/* <div className="relative mb-2 w-full md:w-2/3 lg:w-2/3 drop-shadow-lg">
          <input
            className="h-10 w-full rounded-lg border bg-white pl-3 pr-8 text-base font-bold focus:outline-none"
            type="text"
          />
        </div> */}
      </div>

      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        {/* <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
          Transaction List
        </h4> */}

        <div className="flex flex-col">
          <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-4">
            <div className="p-2.5 text-center xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Title of Book
              </h5>
            </div>
            <div className="p-2.5 xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base text-center">
                Student's Information
              </h5>
            </div>
            <div className="p-2.5 text-center xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Status
              </h5>
            </div>
            <div className="hidden p-2.5 text-center sm:block xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Transaction Date
              </h5>
            </div>
          </div>

          {/* User Details */}
          {transactions &&
            transactions
              .filter((transaction) => {
                if (selected.value === 'Borrowed') {
                  return transaction.availability.status === 'Borrowed';
                } else if (selected.value === 'Return') {
                  return transaction.availability.status === 'Return';
                } else if (selected.value === 'Reserved') {
                  return transaction.availability.status === 'Reserved';
                } else if (selected.value === 'Reservation Expired') {
                  return (
                    transaction.availability.status === 'Reservation Expired'
                  );
                } else {
                  return transaction; // show all
                }
              })
              .filter((val) => {
                if (searchTerm === '') {
                  return val;
                } else if (
                  // Search by student name
                  val.availability?.user?.first_name
                    ?.toLowerCase()
                    .includes(searchTerm.toLocaleLowerCase())
                ) {
                  return val;
                } else if (
                  // Search by student number
                  val.availability?.user?.user_id
                    ?.toLowerCase()
                    .includes(searchTerm.toLocaleLowerCase())
                ) {
                  return val;
                } else if (
                  // Search by book barcode
                  val.barcode.includes(searchTerm.toLocaleLowerCase())
                ) {
                  return val;
                }
              })
              .map((transaction, i) => (
                <TransactionHistoryList {...transaction} key={i} />
              ))}
        </div>
        <div>
          {transactions.filter((val) => {
            if (searchTerm === '') {
              return true;
            } else if (
              val.availability?.user?.first_name
                ?.toLowerCase()
                .includes(searchTerm.toLocaleLowerCase())
            ) {
              return true;
            } else if (
              val.availability?.user?.user_id
                ?.toLowerCase()
                .includes(searchTerm.toLocaleLowerCase())
            ) {
              return true;
            } else if (val.barcode.includes(searchTerm.toLocaleLowerCase())) {
              return val;
            }
            return false;
          }).length === 0 && (
            <div className="text-lg pb-5 mt-5 flex w-full flex-row items-center justify-center align-middle font-bold text-danger">
              No records found!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
