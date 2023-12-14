import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import dayjs from 'dayjs';
import { calculatePenaltyDuration, calculatePenaltyRate } from '../utils';
import { Link } from 'react-router-dom';

import { ReturnBook } from '../services';

let statusColor_MUI = {
  Borrowed: 'red',
  Available: 'gray',
  Exceeded: 'blue',
  Lost: 'red',
  Return: 'green',
};

export default function TransactionList(props) {
  const handleStatus = async (e) => {
    const status = e.target.value; // get selected status value

    if (status === 'Return') {
      const book = { ...props };
      await ReturnBook(book.id, book);
    }
  };

  return (
    <div className="grid grid-cols-3 border-b border-stroke dark:border-strokedark sm:grid-cols-7">
      <div className="flex items-center gap-3 p-2.5 xl:p-5">
        <div className="hidden text-black dark:text-white sm:block flex-shrink-0">
          <img
            className="w-12 object-cover"
            src="/images/icon/user.png"
            alt=""
          />
        </div>
        <div className="flex flex-col">
          <p className="text-sm text-black dark:text-white leading-4">
            {`${props.availability?.user?.first_name} ${props.availability?.user?.last_name}`}
          </p>
          <p className="hidden sm:block text-sm leading-6">{`${props.availability?.user?.user_id}`}</p>
        </div>
      </div>

      <div className="flex items-center justify-center p-2.5 xl:p-5">
        <FormControl variant="standard" sx={{ m: 1, minWidth: 80 }}>
          <Select
            sx={{ color: statusColor_MUI['Borrowed'] }}
            value={`Borrowed`}
            onChange={handleStatus}
          >
            <MenuItem value="Borrowed">Borrowed</MenuItem>
            <MenuItem value="Return">Return</MenuItem>
          </Select>
        </FormControl>
      </div>

      <div className="flex items-center justify-center p-2.5 xl:p-5">
        <p className="text-center text-sm text-black dark:text-meta-5">
          {props.title}
        </p>
      </div>

      <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
        <p className="text-success dark:text-success">
          {dayjs(props.availability?.borrowDate).format(
            'MMM DD, YYYY HH:mm:ss',
          )}
        </p>
      </div>

      <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
        <p className="text-danger dark:text-danger">
          {dayjs(props.availability?.dueDate).format('MMM DD, YYYY HH:mm:ss')}
        </p>
      </div>

      <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
        <p className="text-danger dark:text-danger">
          {`${calculatePenaltyRate(props.availability.dueDate)}`}
          {calculatePenaltyRate(props.availability.dueDate) !== 'P0.00'
            ? ` (${calculatePenaltyDuration(props.availability.dueDate)} day/s)`
            : ' (0 day/s)'}
        </p>
      </div>

      <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
        <p className="text-danger dark:text-danger">
          <Link to={`/transactions/${props.id}/printReciept`}>
            <button className="rounded bg-success text-white p-2">
              Print Receipt
            </button>
          </Link>
        </p>
      </div>
    </div>
  );
}
