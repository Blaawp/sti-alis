import SearchBar from './SearchBar';
import { useState } from 'react';

import TransactionList from './TransactionList';

export default function TransactionTable({ transactions }) {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="my-2 flex h-full w-full flex-col items-center justify-center space-y-10 align-middle">
      <SearchBar
        setSearchTerm={setSearchTerm}
        placeholder={`Search by book title...`}
      />
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
          Transaction List
        </h4>

        <div className="flex flex-col">
          <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-7">
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
            <div className="p-2.5 text-center xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Title of Book
              </h5>
            </div>
            <div className="hidden p-2.5 text-center sm:block xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Borrow Date
              </h5>
            </div>

            <div className="hidden p-2.5 text-center sm:block xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Due Date
              </h5>
            </div>

            <div className="hidden p-2.5 text-center sm:block xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Penalty
              </h5>
            </div>

            <div className="hidden p-2.5 text-center sm:block xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Action
              </h5>
            </div>
          </div>

          {/* User Details */}
          {transactions &&
            transactions
              .filter((trnx) => trnx.availability?.status === 'Borrowed')
              .filter((val) => {
                if (searchTerm === '') {
                  return val;
                } else if (
                  val.title
                    .toLowerCase()
                    .includes(searchTerm.toLocaleLowerCase())
                ) {
                  return val;
                }
              })
              .map((trnx: any, i: number) => (
                <TransactionList {...trnx} key={i} />
              ))}
        </div>
        <div>
          {transactions.filter((val) => {
            if (searchTerm === '') {
              return true;
            } else if (
              val.title.toLowerCase().includes(searchTerm.toLocaleLowerCase())
            ) {
              return true;
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
