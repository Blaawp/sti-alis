import Breadcrumb from '../components/Breadcrumb';

export default function Home() {
  return (
    <>
      <Breadcrumb pageName="Home" />
      <div className="mt-5 flex w-full flex-col items-center gap-5">
        <div className="max-sm:flex max-sm:flex-col lg:flex lg:flex-row h-full w-full justify-between gap-5 ">
          <div className="bg-white w-full p-5">
            <p className="w-full text-center font-bold text-lg">
              RULES AND REGULATIONS
            </p>
            <hr className="h-1 mx-auto bg-[#fce047] mb-1" />
            <div className="lg:flex lg:flex-row justify-center">
              <img
                className="object-contain lg:h-48 lg:w-96 lg:h-48 lg:w-66"
                src="/assets/libpic.jpg"
                alt="lib pic"
              />
              <div className="flex flex-col justify-center items-center">
                <p className="font-bold">LIBRARY HOURS</p>
                <p>Monday - Friday</p>
                <p>8:00am - 4:00pm</p>
              </div>
            </div>
          </div>

          <div className="bg-white w-full p-5">
            <p className="w-full text-center font-bold text-lg">
              LIBRARY SERVICES
            </p>
            <hr className="h-1 mx-auto bg-[#fce047] mb-1" />
            <div className="flex flex-col mt-4 items-center">
              <p className="font-bold text-center text-sm">
                LIBRARY PROVIDES THE FOLLOWING SERVICES TO ITS LEADER
              </p>
              <ul className="list-disc w-2/3 mb-4">
                <li>Internet and WIFI Services</li>
                <li>Referral Rervices</li>
                <li>Readers Services</li>
                <li>Visiting Researchers (for non STI Students)</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col bg-white drop-shadow-md w-full h-full p-5">
          <p className="w-full text-center font-bold text-lg">
            BORROWING &amp; RETURNING OF BOOKS
          </p>
          <hr className="h-1 w-full mx-auto bg-[#fce047] mb-1" />
          <ol className="list-decimal text-sm px-10 py-4 font-semibold">
            <li>
              An ALIS Account is required for all the library transactions.
            </li>
            <li>
              All library users must apply for the ALIS before they can be
              borrowed from the library.
            </li>
            <li>The use of ALIS is non-transferable.</li>
            <li>
              A student can borrow a maximum of three (3) books at a time but
              can only borrow two (2) fiction books at a time.
            </li>
            <li>
              Loan period for are as follows:
              <ul className="list-disc pl-8">
                <li>General Education Books - Overnight (1 Day)</li>
                <li>Fiction Books – One Week</li>
                <li>Thesis, References &amp; Periodicals- Library Use Only</li>
              </ul>
            </li>
            <li>
              The borrower is accountable for safekeeping of the book/s during
              the period of the loan.
            </li>
            <li>The overdue fine is Php 5.00 for each book per day.</li>
            <li>
              Lost of book must be reported to the librarian as soon as
              possible.
            </li>
          </ol>
        </div>

        <div className="flex flex-col bg-white drop-shadow-md w-full h-full p-5">
          <p className="w-full text-center font-bold text-lg">
            LIBRARY RULES &amp; REGULATIONS
          </p>
          <hr className="h-1 w-full mx-auto bg-[#fce047] mb-1" />
          <ol className="list-decimal text-sm px-10 py-4 font-semibold">
            <li>Silence should be observed inside the library at all times.</li>
            <li>
              An A.L.I.S. Account is required for all the library transactions.
            </li>
            <li>
              All library users should log in the library's attendance upon
              entering and before leaving the library.
            </li>
            <li>
              Mobile phones and other electronic gadgets must be turned to
              silent mode. Phone calls must be answered outside the library.
            </li>
            <li>
              Wearing of proper uniform is required for all library users.
              Wearing of caps, bandanas, shades and earrings (for male students)
              are not allowed.
            </li>
            <li>
              Eating, smoking, grooming, running and sleeping are not allowed
              Inside the library.
            </li>
            <li>
              Playing of video games and board games are not allowed inside the
              library. &amp; Laptops and electronic gadgets can be used inside
              the library. However, the library will not be liable for any
              losses.
            </li>
            <li>Charging of gadgets are not allowed in the library.</li>
            <li>
              Library furniture (l.e., tables, chairs, etc.) are not allowed to
              be relocated or transferred to another place.
            </li>
            <li>
              Public display of affection (PDA), discourtesy, disrespecting
              authority and any unethical actions will not be tolerated Inside
              the library and is subject to appropriate disciplinary actions.
            </li>
          </ol>
        </div>
      </div>
    </>
  );
}
