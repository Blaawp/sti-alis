import dayjs from 'dayjs';
import { MarkArchiveAsAvailable } from '../services';

export default function ArchiveList(props) {
  const handleBookAvailability = async (book) => {
    await MarkArchiveAsAvailable(book);
  };

  return (
    <>
      <div className="grid grid-cols-3 border-b border-stroke dark:border-strokedark sm:grid-cols-5">
        <div className="flex items-center justify-center p-2.5 xl:p-5">
          <p className="text-center text-sm text-black dark:text-meta-5">
            {props.title}
          </p>
        </div>

        <div className="flex items-center justify-center p-2.5 xl:p-5">
          <p className="text-center text-sm text-black dark:text-meta-5">
            {props.barcode}
          </p>
        </div>

        <div className="flex items-center justify-center p-2.5 xl:p-5">
          <p className="text-center text-danger dark:text-meta-5">
            {props.availability?.status}
          </p>
        </div>

        <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
          <p className="hidden text-danger sm:block">
            {dayjs(props.availability.created_at).format(
              'MMM DD, YYYY HH:mm:ss',
            )}
          </p>
        </div>

        <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
          <button
            className="rounded bg-success text-white p-2"
            onClick={() => handleBookAvailability(props)}
          >
            Mark As Available
          </button>
        </div>
      </div>
    </>
  );
}
