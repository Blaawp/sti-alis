import BookCard from '../components/BookCard';
import Breadcrumb from '../components/Breadcrumb';
import { useLocation, Link } from 'react-router-dom';
import config from '../config';
import { getSession } from '../Store';

export default function DetailedBookCard() {
  const { state } = useLocation();
  const BOOK_STATUSES = Object.values(config.BOOK_STATUSES) || [];

  const returnDisabledMap = (data) => {
    return (
      <div>
        <h1 className="text-danger lg:text-lg text-sm">
          Book has already been <strong>{data.availability?.status}</strong>{' '}
          hence map was unavailable
        </h1>

        {data.remarks && <h2>{`(Note: ${data.remarks})`}</h2>}
      </div>
    );
  };

  const returnMap = (data) => {
    return (
      <img
        className="my-4 w-full border-4 border-black object-cover"
        src={data.book_map}
        alt="Library Map"
      />
    );
  };

  const returnNoMapAvailable = () => {
    return (
      <img
        className="my-4 bg-[#BABABA] w-full border-4 h-full border-black object-scale-down"
        src={`/images/placeholders/no-map-available.png`}
        alt="Library Map"
      />
    );
  };

  const identifyMapToShow = (data) => {
    if (BOOK_STATUSES.includes(data.availability?.status)) {
      // if book was reserved and belongs to the user, show the map
      if (
        data.availability.status === config.BOOK_STATUSES.RESERVED &&
        data.availability?.user.user_id === getSession().user_id
      ) {
        return returnMap(data);
      } else {
        return returnDisabledMap(data);
      }
    } else {
      // if book status was set as available and has map available
      if (data.book_map) {
        return returnMap(data);
      } else {
        return returnNoMapAvailable();
      }
    }
  };

  return (
    <>
      <Breadcrumb pageName="Book Details" />
      <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
        <div className="flex flex-col gap-9">
          {/* Content */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="flex border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <Link
                to="/Cataloging"
                className="inline-flex items-center justify-center rounded-full bg-primary py-2 px-6 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-5"
              >
                Back
              </Link>
            </div>
            <BookCard {...state} />
          </div>

          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="text-center border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-bold text-black dark:text-white">
                Book Information
              </h3>
            </div>
            <div className="flex w-full flex-col rounded-md border-1 border-gray-200 bg-white p-8 text-black">
              <div className="flex w-full flex-row">
                <p className="mr-3 text-right font-bold text-black dark:text-white">
                  Author:{' '}
                </p>{' '}
                <p className="text-black dark:text-meta-3">{state.author}</p>
              </div>
              <p className="mx-auto w-4/5 text-left"></p>
              <div className="flex w-full flex-row">
                <p className="mr-3 text-right font-bold text-black dark:text-white">
                  Category:{' '}
                </p>{' '}
                <p className="text-black dark:text-meta-3">{state.category}</p>
              </div>
              <div className="flex w-full flex-row">
                <p className="mr-3 text-right font-bold text-black dark:text-white">
                  Subject:{' '}
                </p>{' '}
                <p className="text-black dark:text-meta-3">{state.subject}</p>
              </div>
              <div className="flex w-full flex-row">
                <p className="mr-3 text-right font-bold text-black dark:text-white">
                  Call Number:{' '}
                </p>{' '}
                <p className="text-black dark:text-meta-3">{state.call_num}</p>
              </div>
              <div className="flex w-full flex-row">
                <p className="mr-3 text-right font-bold text-black dark:text-white">
                  ISBN:{' '}
                </p>{' '}
                <p className="text-black dark:text-meta-3">{state.isbn}</p>
              </div>
              <div className="flex w-full flex-row">
                <p className="mr-3 text-right font-bold text-black dark:text-white">
                  ED:{' '}
                </p>{' '}
                <p className="text-black dark:text-meta-3">{state.ed}</p>
              </div>
              <div className="flex w-full flex-row">
                <p className="mr-3 text-right font-bold text-black dark:text-white">
                  Copyright<span>&#169;</span>:{' '}
                </p>{' '}
                <p className="text-black dark:text-meta-3">{state.copyright}</p>
              </div>
              <div className="flex w-full flex-row">
                <p className="mr-3 text-right font-bold text-black dark:text-white">
                  Level No.:{' '}
                </p>{' '}
                <p className="text-black dark:text-meta-3">{state.level_num}</p>
              </div>
              <div className="flex w-full flex-row">
                <p className="mr-3 text-right font-bold text-black dark:text-white">
                  Shelf No.:{' '}
                </p>{' '}
                <p className="text-black dark:text-meta-3">{state.shelf_num}</p>
              </div>
              <div className="flex w-full flex-row">
                <p className="mr-3 text-right font-bold text-black dark:text-white">
                  Loan Period:{' '}
                </p>{' '}
                <p className="text-black dark:text-meta-3">7 days</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex lg:w-3/4 sm:w-full flex-col justify-center items-center mx-30">
          <p className="text-xl text-black font-bold  dark:text-white">MAP</p>
          {identifyMapToShow(state)}
        </div>
      </div>
    </>
  );
}
