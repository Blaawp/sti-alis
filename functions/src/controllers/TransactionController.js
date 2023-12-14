/* eslint object-curly-spacing: ["error", "never"] */

// eslint-disable-next-line object-curly-spacing
const { initializeApp } = require('firebase/app');
// eslint-disable-next-line object-curly-spacing
const {
  getDocs,
  getFirestore,
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteField,
} = require('firebase/firestore');
const app = initializeApp({
  apiKey: 'AIzaSyAdXeyicLpBOw6o4QVpqF3Z-q4PKdWeHcs',
  authDomain: 'sti-library-system.firebaseapp.com',
  projectId: 'sti-library-system',
  storageBucket: 'sti-library-system.appspot.com',
  messagingSenderId: '210211330901',
  appId: '1:210211330901:web:d3b80b421135602fb36ddc',
  measurementId: 'G-2454KS1LCT',
});
const db = getFirestore(app);
const dayjs = require('dayjs');
const sgMail = require('@sendgrid/mail');

const COLLECTIONS = {
  BOOKS: 'books',
  USERS: 'users',
  BOOK_TRANSACTION_HISTORIES: 'book_transaction_histories',
  NOTIFICATIONS: 'notifications',
  LOGIN_HISTORIES: 'login_histories',
};

// Services firebase functions
const getAllBorrowedBooks = async () => {
  const rawBooks = await getDocs(collection(db, COLLECTIONS.BOOKS));
  const updatedBooks = [];

  rawBooks.docs.forEach((book) => {
    const b = book.data();
    if (b.availability) {
      if (
        b.availability.status === 'Borrowed' &&
        dayjs().isSame(b.availability.dueDate, 'day')
      ) {
        // eslint-disable-next-line object-curly-spacing
        updatedBooks.push({ id: book.id, ...b });
      }
    }
  });

  return updatedBooks;
};

const getAllReservedBooks = async () => {
  const rawBooks = await getDocs(collection(db, COLLECTIONS.BOOKS));
  const updatedBooks = [];

  rawBooks.docs.forEach((book) => {
    const b = book.data();
    if (b.availability) {
      if (
        b.availability.status === 'Reserved' &&
        dayjs().diff(dayjs(b.availability?.borrowDate), 'day') >= 1
      ) {
        // eslint-disable-next-line object-curly-spacing
        updatedBooks.push({ id: book.id, ...b });
      }
    }
  });

  return updatedBooks;
};

const ReturnBook = async (id, book) => {
  const bookRef = doc(db, COLLECTIONS.BOOKS, id);

  // Remove the 'availability' field from the `books` document
  // Once the availability field has been remove, it's considered as available
  await updateDoc(bookRef, {
    availability: deleteField(),
  });

  const availability = {
    status: 'Reservation Expired',
    user: book.availability.user,
  };

  // Record the history of book transactions
  // eslint-disable-next-line object-curly-spacing
  await SaveBookTrxn({ ...book, availability });
};

const SaveBookTrxn = async (book) => {
  // We need to record any transaction in books
  // It might be borrowed, return, etc.

  const created_at = dayjs().format();
  return await addDoc(collection(db, COLLECTIONS.BOOK_TRANSACTION_HISTORIES), {
    ...book,
    created_at,
  });
};

const updateReservedBookAsAvailable = async (id, book) => {
  return await ReturnBook(id, book);
};

const sendEmail = (book) => {
  sgMail.setApiKey(
    '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',
  );

  const from = 'no-reply@alis-sti.com'; // Change to your verified sender
  const to = book.availability.user.email;

  const msg = {
    to,
    from,
    templateId: 'd-7e51b4178fc04fd4bf6e9ab1d5ccf83d',
    dynamicTemplateData: {
      name: book.availability.user.first_name,
      book_name: book.title,
      borrowed_date: dayjs(book.availability.borrowDate).format(
        'MMM DD, YYYY HH:mm:ss',
      ),
      borrowed_days: dayjs().diff(book.availability.borrowDate, 'day'),
    },
  };

  sgMail
    .send(msg)
    .then(() => {
      console.log(`Email has been sent to ${to}`);
    })
    .catch((error) => {
      // response.status(500).send(error);
      console.log(`there's an error `, error);
    });
};

const sendSms = (book) => {
  const SEMAPHORE_URL = 'https://api.semaphore.co/api/v4/messages';
  const data = {
    apikey: 'b28fee026814387603da937ddfa8d043',
    number: book.availability.user.contact_num,
    message: `Hi ${book.availability.user.first_name},
    
This is a friendly reminder from STI College Caloocan Library that the book titled "${
      book.title
    }" is due for return on ${dayjs(book.availability?.dueDate).format(
      'MMM DD, YYYY HH:mm',
    )}. Please ensure that you return the book to the library by the specified date to avoid any late fees of 5 pesos.
     
Thank you for your cooperation!
    
STI College Caloocan Library`,
  };

  const customHeaders = {
    'Content-Type': 'application/json',
  };

  fetch(SEMAPHORE_URL, {
    method: 'POST',
    headers: customHeaders,
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    });
};

const sendNotification = async (book) => {
  await addDoc(collection(db, 'notifications'), {
    created_at: dayjs().format(),
    user_id: book.availability.user.user_id,
    email: book.availability.user.email,
    is_read: false,
    msg: `${book.title} is expiring soon, please return it ASAP`,
  });

  console.log(`notification has been sent to ${book.availability.user.email}`);
};

exports.manageNotification = async () => {
  // Get borrowed books
  const borrowedBooks = await getAllBorrowedBooks();

  // Validate if there are any borrowed books
  if (borrowedBooks.length === 0) {
    console.log({
      message: `No books due for today (${dayjs().format('MMM DD, YYYY')})`,
    });
    return;
  }

  // Iterate through the borrowed books
  borrowedBooks.forEach((book) => {
    // Send email
    sendEmail(book);
    // Send sms
    sendSms(book);
    // Send notification
    sendNotification(book);
  });
};

exports.cleanUpBookReservations = async () => {
  // Get reserved books
  const reservedBooks = await getAllReservedBooks();

  // Validate if there are any reserved books
  if (reservedBooks.length === 0) {
    console.log({
      message: `No reserved books due for today (${dayjs().format(
        'MMM DD, YYYY',
      )})`,
    });
    return;
  }

  // Iterate through the reserved books
  reservedBooks.forEach(async (book) => {
    await updateReservedBookAsAvailable(book.id, book);
  });
};

exports.TransactionController = {
  getTransactions: async (req, res) => {
    const borrowedBooks = await getAllBorrowedBooks();

    if (borrowedBooks.length === 0) {
      res.status(200).send({
        message: `No books due for today (${dayjs().format('MMM DD, YYYY')})`,
      });
    }

    borrowedBooks.forEach((book) => {
      sendEmail(book, req, res);
      sendSms(book, req, res);
      sendNotification(book);
    });

    res.status(200).send('Email sent');
  },
  sendSms: async (req, res) => {
    const book = {
      title: 'Clean Code',
      availability: {
        dueDate: dayjs().format(),
        user: {
          first_name: 'Paul',
          contact_num: '09266491753',
        },
      },
    };

    sendSms(book);

    res.status(200).send(`SMS sent to ${book.availability.user.contact_num}`);
  },
  checkReservedBookIfExpire: async (req, res) => {
    const reservedBooks = await getAllReservedBooks();

    // Validate if there are any reserved books
    if (reservedBooks.length === 0) {
      console.log({
        message: `No reserved books due for today (${dayjs().format(
          'MMM DD, YYYY',
        )})`,
      });
      return res
        .status(200)
        .send(
          `No reserved books due for today (${dayjs().format('MMM DD, YYYY')})`,
        );
    }

    // Iterate through the reserved books
    reservedBooks.forEach(async (book) => {
      await updateReservedBookAsAvailable(book.id, book);
    });

    return res.status(200).send('Reserved books has been processed for return');
  },
};
