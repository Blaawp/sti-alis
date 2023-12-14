import Breadcrumb from '../components/Breadcrumb';
import { Link } from 'react-router-dom';
import { BsFillPlusSquareFill } from 'react-icons/bs';
import BookCard from '../components/BookCard';
import { useState, useEffect } from 'react';
import { GetRealTimeAllBooks } from '../services';
import SearchBar from '../components/SearchBar';
import DropDown from '../components/DropDown';
import config from '../config';

export default function Inventory() {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const unsub = GetRealTimeAllBooks(setBooks);

    return () => {
      unsub();
    };
  }, []);

  const DROPDOWN_OPTIONS = [
    {
      label: 'All',
      value: 'All',
    },
    ...config.CATEGORIES,
  ];

  const [selected, setSelected] = useState(DROPDOWN_OPTIONS[0]);

  return (
    <>
      <Breadcrumb pageName="Inventory" />
      <div className="my-2 flex h-full w-full flex-col items-center justify-center space-y-10 align-middle">
        <div className="flex-start mb-5 flex w-full items-center justify-center gap-5">
          <DropDown
            options={DROPDOWN_OPTIONS}
            selected={selected}
            setSelected={setSelected}
            label="Category"
          />
          <SearchBar
            placeholder={`Search by book title...`}
            setSearchTerm={setSearchTerm}
          />
        </div>

        <div className="flex w-5/6 flex-row justify-between">
          <h1 className="flex text-lg font-bold">
            Total Books:{' '}
            <p className="ml-2 text-red-500">{books && books.length}</p>
          </h1>

          <Link to="/AddBook">
            <BsFillPlusSquareFill color="black" size="40px" />
          </Link>
        </div>

        {/* bookcards */}
        <div className="grid lg:w-10/12 lg:grid-cols-2 gap-x-4 gap-y-5">
          {books &&
            books
              .filter((book) => {
                if (selected.value === 'General Education') {
                  return book?.category === 'General Education';
                } else if (selected.value === 'Senior High Collection') {
                  return book?.category === 'Senior High Collection';
                } else if (selected.value === 'THESIS') {
                  return book?.category === 'THESIS';
                } else {
                  return book;
                }
              })
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
                <BookCard
                  {...book}
                  key={idx}
                  isInventory={true}
                  withStatus={true}
                />
              ))}
        </div>
        <div>
          {books.filter((val) => {
            if (searchTerm == '') {
              return true;
            } else if (
              val.title.toLowerCase().includes(searchTerm.toLocaleLowerCase())
            ) {
              return true;
            }
            return false;
          }).length === 0 && (
            <div className="text-lg mt-5 flex w-full flex-row items-center justify-center align-middle font-bold text-danger">
              No records found!
            </div>
          )}
        </div>
      </div>
    </>
  );
}
