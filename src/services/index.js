import { db, imageDb } from '../firebase';
import {
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  deleteField,
  onSnapshot,
  collection,
  query,
  getDoc,
  getDocs,
  where,
  orderBy,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import dayjs from 'dayjs';

const COLLECTIONS = {
  BOOKS: 'books',
  USERS: 'users',
  BOOK_TRANSACTION_HISTORIES: 'book_transaction_histories',
  NOTIFICATIONS: 'notifications',
  LOGIN_HISTORIES: 'login_histories',
};

const GetAllUsers = async () => {
  const rawUsers = await getDocs(collection(db, COLLECTIONS.USERS));
  let updatedUsers = [];

  rawUsers.docs.forEach((user) => {
    updatedUsers.push({ id: user.id, ...user.data() });
  });

  return updatedUsers;
};

const UpdateUserByID = async (user) => {
  try {
    const userQuery = query(
      collection(db, COLLECTIONS.USERS),
      where("user_id", "==", user.user_id)
    );

    const userDocs = await getDocs(userQuery);

    userDocs.forEach(async (userDoc) => {
      // Update each document individually
      await updateDoc(userDoc.ref, {
        email: user.email,
        first_name: user.first_name,
        middle_name: user.middle_name,
        last_name: user.last_name,
        contact_num: user.contact_num,
        password: user.password,
        course: user.course,
        role: user.role.toLowerCase(), // Convert to lowercase
        user_id: user.user_id,
      });

      console.log(`User with ID ${user.user_id} updated successfully`);
    });

  } catch (error) {
    console.error('Error updating user:', error.message);
    // Handle the error appropriately
  }
};



const UpdateProfilePhoto = async (file, bucketPath, session) => {
  const fileName = file.name;

  const storageRef = ref(imageDb, `${bucketPath}/${fileName}`);

  uploadBytes(storageRef, file).then((snapshot) => {
    getDownloadURL(snapshot.ref).then((downloadURL) => {
      // Update user profile photo
      updateDoc(doc(db, COLLECTIONS.USERS, session.id), {
        profile_photo: downloadURL,
      });
    });
  });
};

const UpdateCoverPhoto = async (file, bucketPath, session) => {
  const fileName = file.name;

  const storageRef = ref(imageDb, `${bucketPath}/${fileName}`);

  uploadBytes(storageRef, file).then((snapshot) => {
    getDownloadURL(snapshot.ref).then((downloadURL) => {
      // Update user profile photo
      updateDoc(doc(db, COLLECTIONS.USERS, session.id), {
        cover_photo: downloadURL,
      });
    });
  });
};

const AddUserByID = async (user) => {
  await addDoc(collection(db, COLLECTIONS.USERS), {
    email: user.email,
    first_name: user.first_name,
    middle_name: user.middle_name,
    last_name: user.last_name,
    contact_num: user.contact_num,
    password: user.password,
    course: user.course,
    role: user.role,
    user_id: user.user_id,
  });
};

const SaveLoginHistory = async (user) => {
  await addDoc(collection(db, COLLECTIONS.LOGIN_HISTORIES), {
    email: user.email,
    first_name: user.first_name,
    middle_name: user.middle_name,
    last_name: user.last_name,
    contact_num: user.contact_num,
    course: user.course,
    role: user.role,
    user_id: user.user_id,
    created_at: dayjs().format(),
  });
};

const GetAllBooks = async () => {
  const rawBooks = await getDocs(collection(db, COLLECTIONS.BOOKS));
  let updatedBooks = [];

  rawBooks.docs.forEach((book) => {
    updatedBooks.push({ id: book.id, ...book.data() });
  });

  return updatedBooks;
};

const GetBookByID = async (bookID) => {
  if (!bookID) {
    return;
  }

  const bookRef = doc(db, COLLECTIONS.BOOKS, bookID);
  const bookSnapshot = await getDoc(bookRef);

  return bookSnapshot.data();
};

const UpdateBookByID = async (book) => {
  const bookDetails = {
    barcode: book.barcode || '',
    account_num: book.accountNum || '',
    title: book.title || '',
    author: book.author || '',
    location: book.location || '',
    ed: book.ed || '',
    copyright: book.copyright || '',
    publisher: book.publisher || '',
    isbn: book.isbn || '',
    subject: book.subject || '',
    call_num: book.callNum || '',
    shelf_num: book.shelfNum || '',
    level_num: book.levelNum || '',
    synopsis: book.synopsis || '',
    category: book.category,
    book_cover: book.bookCover || '',
    book_map: book.bookMap || '',
    remarks: book.remarks || '',
  };

  const created_at = dayjs().format();
  if (book.status === 'Lost' || book.status === 'Damaged') {
    bookDetails['availability'] = {
      status: book.status,
      created_at,
      // Here, we can assume that only admin
      // can update the book to Lost/Damage
      // hence setting user details always as Admin
      user: {
        first_name: 'Admin',
        last_name: 'Admin',
      },
    };

    // Record the history of book transactions
    await SaveBookTrxn({ ...bookDetails });
  }

  await updateDoc(doc(db, COLLECTIONS.BOOKS, book.id), bookDetails);
};

const GetRealTimeNotificationsByID = (setNotifications, userID) => {
  const q = query(
    collection(db, COLLECTIONS.NOTIFICATIONS),
    where('user_id', '==', userID),
  );

  const unsub = onSnapshot(q, (querySnapshot) => {
    setNotifications(
      querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })),
    );
  });

  return unsub;
};

const UpdateNotificationByID = async (notificationID) => {
  await updateDoc(doc(db, COLLECTIONS.NOTIFICATIONS, notificationID), {
    is_read: true,
  });
};

const GetRealTimeAllBooks = (setBooks, isGroupByQty = false) => {
  const q = query(collection(db, COLLECTIONS.BOOKS), orderBy('title'));
  const unsub = onSnapshot(q, (querySnapshot) => {
    if (!isGroupByQty) {
      setBooks(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })),
      );
    } else {
      const booksMap = {};
      querySnapshot.docs.forEach((doc) => {
        const book = doc.data();
        const INITIAL_QTY = 1;
        if (!(book.title in booksMap)) {
          if (
            book.availability?.status === 'Borrowed' ||
            book.availability?.status === 'Reserved' ||
            book.availability?.status === 'Damaged' ||
            book.availability?.status === 'Lost'
          ) {
            // Set the qty as zero if borrowed
            booksMap[book.title] = { id: doc.id, ...book, qty: 0 };
          } else {
            booksMap[book.title] = { id: doc.id, ...book, qty: INITIAL_QTY };
          }
        } else {
          // Increment qty only if book status is not "Borrowed, Damaged, Lost"
          if (!book.availability) {
            booksMap[book.title].qty += 1;
          }
        }

        // Convert books into array with qty key
        const books = Object.values(booksMap);
        setBooks(books);
      });
    }
  });

  return unsub;
};

const GetRealTimeBookHistories = (setBookHistories) => {
  const q = query(
    collection(db, COLLECTIONS.BOOK_TRANSACTION_HISTORIES),
    orderBy('title'),
  );
  const unsub = onSnapshot(q, (querySnapshot) => {
    setBookHistories(
      querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })),
    );
  });

  return unsub;
};

const DeleteBook = async (bookID) => {
  await deleteDoc(doc(db, COLLECTIONS.BOOKS, bookID));
};

const AddNewBook = async (book) => {
  await addDoc(collection(db, COLLECTIONS.BOOKS), {
    barcode: book.barcode,
    account_num: book.accountNum,
    title: book.title,
    author: book.author,
    location: book.location,
    ed: book.ed,
    copyright: book.copyright,
    publisher: book.publisher,
    isbn: book.isbn,
    subject: book.subject,
    call_num: book.callNum,
    shelf_num: book.shelfNum,
    level_num: book.levelNum,
    synopsis: book.synopsis,
    category: book.category,
    book_cover: book.bookCover || '',
    book_map: book.bookMap || '',
  });
};

const GetBookHistories = async () => {
  const rawBooks = await getDocs(
    collection(db, COLLECTIONS.BOOK_TRANSACTION_HISTORIES),
  );
  let updatedBooks = [];

  rawBooks.docs.forEach((book) => {
    updatedBooks.push({ id: book.id, ...book.data() });
  });

  return updatedBooks;
};

const BorrowBook = async (id, book, availability) => {
  // Query that will update the availability of book
  // to borrow, if any book has availability field
  // for now, it's considered as "Borrowed"
  await updateDoc(doc(db, COLLECTIONS.BOOKS, id), {
    ...availability,
  });

  // Record the history of book transactions
  await SaveBookTrxn({ ...book, ...availability });
};

const ReserveBook = async (id, book, availability) => {
  // Query that will update the availability of book to reserve
  await updateDoc(doc(db, COLLECTIONS.BOOKS, id), {
    ...availability,
  });

  // Record the history of book transactions
  await SaveBookTrxn({ ...book, ...availability });
};

// From Archives, if any of the books
// were damage or lost, through this service
// will be able to mark the book again as
// Available status
const MarkArchiveAsAvailable = async (book) => {
  const bookRef = doc(db, COLLECTIONS.BOOKS, book.id);

  // Remove the 'availability' field from the `books` document
  // Once the availability field has been remove, it's considered as available
  await updateDoc(bookRef, {
    availability: deleteField(),
  });

  const availability = {
    status: 'Available',
    user: {
      first_name: 'Admin',
      last_name: 'Admin',
    },
  };

  // Record the history of book transactions
  await SaveBookTrxn({ ...book, availability });
};

const ReturnBook = async (id, book) => {
  const bookRef = doc(db, COLLECTIONS.BOOKS, id);

  // Remove the 'availability' field from the `books` document
  // Once the availability field has been remove, it's considered as available
  await updateDoc(bookRef, {
    availability: deleteField(),
  });

  const availability = {
    status: 'Return',
    user: book.availability.user,
  };

  // Record the history of book transactions
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

const UploadImage = async (file, setImage, bucketPath) => {
  const fileName = file.name;

  const storageRef = ref(imageDb, `${bucketPath}/${fileName}`);

  uploadBytes(storageRef, file).then((snapshot) => {
    getDownloadURL(snapshot.ref).then((downloadURL) => {
      setImage(downloadURL);
    });
  });
};

const IsUserExistByStudentNumber = async (student_num) => {
  const rawUsers = await getDocs(
    query(
      collection(db, COLLECTIONS.USERS),
      where('user_id', '==', student_num),
    ),
  );

  let userDetails = false;

  rawUsers.docs.forEach((user) => {
    if (user.data().user_id === student_num) {
      userDetails = { id: user.id, ...user.data() };
    }
  });

  if (!userDetails) {
    return false;
  }

  delete userDetails.password;

  return userDetails;
};

const IsUserExistByEmail = async (email, password) => {
  const rawUsers = await getDocs(
    query(collection(db, COLLECTIONS.USERS), where('email', '==', email)),
  );

  let userDetails = false;

  rawUsers.docs.forEach((user) => {
    if (user.data().email === email) {
      userDetails = { id: user.id, ...user.data() };
    }
  });

  if (!userDetails) {
    return false;
  }

  if (userDetails.password !== password) {
    return false;
  }

  delete userDetails.password;

  return userDetails;
};

const GetUserByID = (id, setUser) => {
  const unsub = onSnapshot(doc(db, COLLECTIONS.USERS, id), (doc) => {
    setUser({
      id: doc.id,
      ...doc.data(),
    });
  });

  return unsub;
};

export {
  // Books
  AddNewBook,
  DeleteBook,
  GetAllBooks,
  GetBookByID,
  UpdateBookByID,
  GetRealTimeAllBooks,
  GetBookHistories,
  GetRealTimeBookHistories,
  MarkArchiveAsAvailable,

  // Inventory
  BorrowBook,
  ReserveBook,
  ReturnBook,
  SaveBookTrxn,
  UploadImage,

  // Users
  IsUserExistByEmail,
  IsUserExistByStudentNumber,
  GetAllUsers,
  UpdateUserByID,
  AddUserByID,
  UpdateProfilePhoto,
  UpdateCoverPhoto,
  GetUserByID,
  SaveLoginHistory,

  // Notifications
  GetRealTimeNotificationsByID,
  UpdateNotificationByID,
};
