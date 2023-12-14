import TransactionTable from '../components/TransactionTable';
import Breadcrumb from '../components/Breadcrumb';
import { useState, useEffect } from 'react';
import { GetRealTimeAllBooks } from '../services';

export default function Transactions() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const unsub = GetRealTimeAllBooks(setBooks);

    return () => {
      unsub();
    };
  }, []);

  return (
    <>
      <Breadcrumb pageName="Transactions" />
      <div className="flex flex-col gap-10">
        <TransactionTable transactions={books} />
      </div>
    </>
  );
}
