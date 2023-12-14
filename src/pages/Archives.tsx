import Breadcrumb from '../components/Breadcrumb';
import SearchBar from '../components/SearchBar';
import ArchiveList from '../components/ArchiveList';
import { useState, useEffect } from 'react';
import { GetRealTimeAllBooks } from '../services';

export default function Archives() {
  const [searchTerm, setSearchTerm] = useState('');
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const unsub = GetRealTimeAllBooks(setBooks);

    return () => {
      unsub();
    };
  }, []);

  return (
    <>
      <Breadcrumb pageName="Archives" />
      <div className="flex flex-col gap-10">
        <div className="my-2 flex h-full w-full flex-col items-center justify-center space-y-10 align-middle">
          <div className="flex-start mb-5 flex w-full items-center justify-center gap-5">
            <SearchBar
              placeholder={`Search by barcode, title...`}
              setSearchTerm={setSearchTerm}
            />
          </div>

          <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
            <div className="flex flex-col">
              <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-5">
                <div className="p-2.5 text-center xl:p-5">
                  <h5 className="text-sm font-medium uppercase xsm:text-base">
                    Title of Book
                  </h5>
                </div>

                <div className="p-2.5 text-center xl:p-5">
                  <h5 className="text-sm font-medium uppercase xsm:text-base text-center">
                    Barcode
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

                <div className="hidden p-2.5 text-center sm:block xl:p-5">
                  <h5 className="text-sm font-medium uppercase xsm:text-base">
                    Action
                  </h5>
                </div>
              </div>

              {/* User Details */}
              {books &&
                books
                  .filter(
                    (trnx) =>
                      trnx.availability?.status === 'Lost' ||
                      trnx.availability?.status === 'Damaged',
                  )
                  // .filter((trnx) => trnx.availability?.status === 'Damage')
                  .filter((val) => {
                    if (searchTerm == '') {
                      return val;
                    } else if (
                      // Search by book title
                      val.title
                        .toLowerCase()
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
                  .map((book, i) => <ArchiveList {...book} key={i} />)}
            </div>
            <div>
              {books.filter((val) => {
                if (searchTerm === '') {
                  return true;
                } else if (
                  val.title
                    .toLowerCase()
                    .includes(searchTerm.toLocaleLowerCase())
                ) {
                  return true;
                } else if (
                  // Search by book barcode
                  val.barcode.includes(searchTerm.toLocaleLowerCase())
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
      </div>
    </>
  );
}
