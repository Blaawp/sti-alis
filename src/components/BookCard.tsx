import { Link } from 'react-router-dom';
import BookQty from '../components/BookQty.jsx';
import BookStatus from '../components/BookStatus.jsx';
import config from '../config.js';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { calculatePenaltyDuration, calculatePenaltyRate } from '../utils';
import { DeleteBook, ReserveBook } from '../services';
import { useState } from 'react';
import dayjsBusinessDays from 'dayjs-business-days';
dayjs.extend(dayjsBusinessDays);

// temporary fix
const toTitleCase = (str) => {
  return str.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

export default function BookCard({
  id,
  barcode,
  account_num,
  title,
  author,
  location,
  ed,
  copyright,
  publisher,
  isbn,
  subject,
  level_num,
  call_num,
  shelf_num,
  category,
  book_cover,
  book_map,

  synopsis,
  img = '/books/book1.jpg',
  status = null,
  // onClick = null,
  empty = false,
  withStatus = false,
  isInventory = false,
  isCirculation = false,
  isCatalog = false,
  availability,
  qty,
  remarks,
  isReservation = false,
  user = {},
  totalRequestedBook = 0,
}) {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleDelete = async () => {
    if (!id) {
      return null;
    }

    await DeleteBook(id);

    navigate('/inventory'); // redirect to inventory page
  };

  const handleReservation = async () => {
    if (totalRequestedBook >= 3) {
      alert(
        `You have already reached maximum requested (reserved/borrowed) books!`,
      );
      return;
    }

    const availability = {
      availability: {
        borrowDate: dayjs().format(),
        dueDate: dayjs().nextBusinessDay().format(),
        status: 'Reserved',
        user,
      },
    };

    const book = {
      barcode,
      account_num,
      title,
      author,
      location,
      ed,
      copyright,
      publisher,
      isbn,
      subject,
      level_num,
      call_num,
      shelf_num,
      category,
      book_cover,
      book_map,
      synopsis,
    };

    await ReserveBook(id, book, availability);
  };

  return (
    <>
      <div className="w-full md:h-65 lg:h-70 flex flex-row rounded-md bg-white p-4 ">
        <div className="w-1/3 z-index-1 relative">
          {book_cover ? (
            <img
              className="object-cover w-full h-35 lg:h-full rounded-md"
              src={book_cover}
              alt=" "
            />
          ) : (
            <img
              className="object-cover w-full h-35 lg:h-full max rounded-md"
              src={config.PLACEHOLDER_NO_IMAGE_BOOK_AVAILABLE}
              alt=" "
            />
          )}
          <div className="absolute z-index-100 top-0 lg:left-0 w-15 text-center">
            <p className="rounded-md bg-[#4c3feb] text-sm text-center align-middle text-white">
              {category}
            </p>
          </div>
        </div>
        <div className="ml-4 flex w-3/4 flex-col">
          <div className="flex flex-row items-center justify-between">
            {isCatalog ? (
              <p
                className="lg:text-lg md:text-md text-sm text-justify cursor-pointer"
                onClick={() => {
                  navigate(
                    `/cataloging/book/${title
                      .replace(/\s+/g, '-')
                      .toLowerCase()}`,
                    {
                      state: {
                        id,
                        barcode,
                        account_num,
                        title,
                        author,
                        location,
                        ed,
                        copyright,
                        publisher,
                        isbn,
                        subject,
                        level_num,
                        call_num,
                        shelf_num,
                        category,
                        book_cover,
                        book_map,
                        synopsis,
                        img,
                        status,
                        empty,
                        withStatus,
                        isInventory,
                        isCirculation,
                        isCatalog,
                        availability,
                        qty,
                        remarks,
                      },
                    },
                  );
                }}
              >
                {' '}
                <span className="font-bold">Title:</span> {toTitleCase(title)}
              </p>
            ) : (
              <p>
                {' '}
                <span className="font-bold">Title:</span> {toTitleCase(title)}
              </p>
            )}
          </div>
          {isCirculation ? (
            <div className="flex flex-row justify-between space-x-4">
              <div className="flex flex-col">
                <p className="text-md font-bold">Borrowed On:</p>
                <p className="text-md text-success">
                  {dayjs(availability.borrowDate).format(
                    'MMM DD, YYYY HH:mm:ss',
                  )}
                </p>
              </div>
              <div className="flex flex-col">
                <p className="text-md font-bold">Return On:</p>
                <p className="text-md text-danger">
                  {' '}
                  {dayjs(availability.dueDate).format('MMM DD, YYYY HH:mm:ss')}
                </p>
              </div>
              <div className="flex flex-col">
                <p className="text-md font-bold">Penalty:</p>
                <p className="text-md text-danger">
                  {/* {calculatePenaltyRate(availability.dueDate)}
                  {`(${calculatePenaltyDuration(availability.dueDate)} day/s)`} */}

                  {`${calculatePenaltyRate(availability.dueDate)}`}
                  {calculatePenaltyRate(availability.dueDate) !== 'P0.00'
                    ? ` (${calculatePenaltyDuration(
                        availability.dueDate,
                      )} day/s)`
                    : ' (0 day/s)'}
                </p>
              </div>
            </div>
          ) : (
            <></>
          )}

          {qty !== undefined && <BookQty qty={qty} />}

          {withStatus && (
            <div className="flex flex-row justify-between items-center space-x-4 font-semibold">
              <BookStatus availability={availability} />
              {isReservation && !availability ? (
                <p>
                  <button
                    className="text-xs lg:text-sm rounded bg-success text-white font-thin p-1 lg:p-2 "
                    onClick={handleReservation}
                  >
                    Reserve
                  </button>
                </p>
              ) : (
                <></>
              )}
            </div>
          )}

          {isInventory && !isCirculation ? (
            <div className="mt-5 flex flex-row justify-end space-x-4 font-semibold">
              <button
                className="text-sm lg:text-lg md:text-md"
                onClick={() => {
                  navigate(`/editBook/${barcode}`, {
                    state: {
                      id,
                      barcode,
                      account_num,
                      title,
                      author,
                      location,
                      ed,
                      copyright,
                      publisher,
                      isbn,
                      subject,
                      call_num,
                      shelf_num,
                      level_num,
                      category,
                      synopsis,
                      book_map,
                      book_cover,
                      availability,
                      remarks,
                    },
                  });
                }}
              >
                Edit
              </button>
              <button
                className="text-sm lg:text-lg md:text-md"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </>
  );
}
