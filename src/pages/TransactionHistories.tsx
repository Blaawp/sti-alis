import Breadcrumb from '../components/Breadcrumb';
import TransactionHistoryTable from '../components/TransactionHistoryTable';
import { useState, useEffect } from 'react';
import { GetBookHistories } from '../services';

export default function TransactionHistories() {
  const [books, setBooks] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [status, setStatus] = useState('Borrowed');

  const handleSearchTerm = (e) => {
    const title = e;
    const hasBooks = books.filter((b) => b.title.toLowerCase().includes(title));

    if (title === '') {
      setTransactions(books);
    } else {
      setTransactions(hasBooks);
    }
  };

  useEffect(() => {
    const fetchBooks = async () => {
      const books = await GetBookHistories();

      // sort the book histories by created_at
      books.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      setBooks(books);

      if (books.length > 0) {
        setTransactions(books);
      }
    };

    fetchBooks();
  }, []);

  return (
    <>
      <Breadcrumb pageName="Transaction Histories" />
      <div className="flex flex-col gap-10">
        <TransactionHistoryTable transactions={books} />
      </div>
    </>
  );
}
