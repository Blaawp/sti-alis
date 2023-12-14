import dayjs from 'dayjs';

export default function TransactionHistoryList(props) {
  return (
    <div className="grid grid-cols-3 border-b border-stroke dark:border-strokedark sm:grid-cols-4">
      <div className="flex items-center justify-center p-2.5 xl:p-5">
        <p className="text-center text-sm text-black dark:text-meta-5">
          {props.title}
        </p>
      </div>

      <div className="flex items-center gap-3 p-2.5 xl:p-5">
        <div className="hidden sm:block flex-shrink-0">
          <img
            className="w-12 object-cover"
            src="/images/icon/user.png"
            alt=""
          />
        </div>
        <div className="flex flex-col">
          <p className="text-black dark:text-white sm:block leading-4">
            {`${
              props.availability?.user?.first_name ||
              props.availability?.user?.firstName
            } 
              ${
                props.availability?.user?.last_name ||
                props.availability?.user?.lastName
              }
							`}
          </p>
          <p className="text-sm leading-6">
            {props.availability?.user?.user_id}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center p-2.5 xl:p-5">
        <p
          className={`${
            props.availability.status === 'Borrowed' ||
            props.availability.status === 'Damaged' ||
            props.availability.status === 'Lost'
              ? `text-danger`
              : props.availability.status === 'Reserved' ||
                props.availability.status === 'Reservation Expired'
              ? 'text-primary'
              : 'text-success'
          }`}
        >
          {props.availability?.status}
        </p>
      </div>

      <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
        <p className="text-danger dark:text-danger">
          {dayjs(props.created_at).format('MMM DD, YYYY HH:mm:ss')}
        </p>
      </div>
    </div>
  );
}
