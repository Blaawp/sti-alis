import dayjs from 'dayjs';
import { getSession } from './Store';

const calculatePenaltyRate = (dueDate) => {
  const PENALTY_RATE_PER_DAY = 5;

  if (!dayjs().isAfter(dueDate, 'day')) {
    return 'P0.00';
  }

  return `P${calculatePenaltyDuration(dueDate) * PENALTY_RATE_PER_DAY}.00`;
};

const calculatePenaltyDuration = (dueDate) => {
  const daysOverDue = dayjs().diff(dueDate, 'day');
  return `${daysOverDue}`;
};

const filterBooksByStatus = (books, status) => {
  return books.filter(
    (book) =>
      book?.availability?.status === status &&
      book?.availability?.user?.user_id === getSession().user_id,
  );
};

const validateEmail = (email) => {
  // custom email regex
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || email.length === 0) {
    return 'Email is required';
  }

  if (!regex.test(email)) {
    return 'Invalid email format';
  }

  return null;
};

export {
  calculatePenaltyRate,
  calculatePenaltyDuration,
  filterBooksByStatus,
  validateEmail,
};
