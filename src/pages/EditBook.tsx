import Breadcrumb from '../components/Breadcrumb';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import { useState } from 'react';
import { UpdateBookByID, UploadImage } from '../services';
import config from '../config';

export default function EditBook() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const [id, setId] = useState(state.id);
  const [barcode, setBarcode] = useState(state.barcode);
  const [accountNum, setAccountNum] = useState(state.account_num);
  const [title, setTitle] = useState(state.title);
  const [author, setAuthor] = useState(state.author);
  const [location, setLocation] = useState(state.location);
  const [ed, setEd] = useState(state.ed);
  const [copyright, setCopyright] = useState(state.copyright);
  const [publisher, setPublisher] = useState(state.publisher);
  const [isbn, setIsbn] = useState(state.isbn);
  const [subject, setSubject] = useState(state.subject);
  const [callNum, setCallNum] = useState(state.call_num);
  const [levelNum, setLevelNum] = useState(state.level_num);
  const [shelfNum, setShelfNum] = useState(state.shelf_num);
  const [synopsis, setSynopsis] = useState(state.synopsis);
  const [bookMap, setbookMap] = useState(state.book_map);
  const [bookCover, setBookCover] = useState(state.book_cover);
  const [category, setCategory] = useState(state.category);
  const [status, setStatus] = useState(
    state.availability?.status || 'Available',
  );
  const [remarks, setRemarks] = useState(state.remarks || '');

  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

  const handleBookCoverUpload = async (e) => {
    const file = e.target.files[0];
    const FS_BUCKET_PATH = '/books/book-covers';

    if (!file) return null;

    await UploadImage(file, setBookCover, FS_BUCKET_PATH);
  };

  const handleBookMapUpload = async (e) => {
    const file = e.target.files[0];
    const FS_BUCKET_PATH = '/books/maps';

    if (!file) return null;

    await UploadImage(file, setbookMap, FS_BUCKET_PATH);
  };

  const isFormValid = () => {
    // Check if required fields have values
    const requiredFields = [
      barcode,
      accountNum,
      title,
      author,
      location,
      ed,
      copyright,
      publisher,
      isbn,
      subject,
      callNum,
      shelfNum,
      levelNum,
      synopsis,
      category,
      status,
    ];

    return requiredFields.every((field) => field !== '');
  };

  const handleSubmit = async (e) => {
    if (!isFormValid()) {
      // Display an error message or handle the invalid form case
      return;
    }

    const bookDetails = {
      id,
      barcode,
      accountNum,
      title,
      author,
      location,
      ed,
      copyright,
      publisher,
      isbn,
      subject,
      callNum,
      shelfNum,
      levelNum,
      synopsis,
      category,
      bookCover,
      bookMap,
      status,
      remarks,
    };

    await UpdateBookByID(bookDetails);
    navigate('/inventory'); // redirect to inventory's dashboard
  };

  return (
    <>
      <Breadcrumb pageName="Edit Book" />
      <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
        <div className="flex flex-col gap-9">
          {/* Edit book form */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="flex justify-between border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                {/* Borrowing Book */}
              </h3>
              <Link
                to="/Inventory"
                className="inline-flex items-center justify-center rounded-full bg-primary py-2 px-6 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-5"
              >
                Back
              </Link>
            </div>
            <form
              method="post"
              className="flex flex-col"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="p-6.5">
                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Barcode <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter barcode here"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    value={barcode}
                    onChange={(e) => setBarcode(e.target.value)}
                  />
                </div>
                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Account number <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Account number here"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    value={accountNum}
                    onChange={(e) => setAccountNum(e.target.value)}
                  />
                </div>
                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Title <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter title here"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Author <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter author here"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                  />
                </div>
                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Location <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter location here"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Ed <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter ed here"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    value={ed}
                    onChange={(e) => setEd(e.target.value)}
                  />
                </div>
                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Copyright <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter copyright here"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    value={copyright}
                    onChange={(e) => setCopyright(e.target.value)}
                  />
                </div>
                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Publisher <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter publisher here"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    value={publisher}
                    onChange={(e) => setPublisher(e.target.value)}
                  />
                </div>
                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    ISBN <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter isbn here"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    value={isbn}
                    onChange={(e) => setIsbn(e.target.value)}
                  />
                </div>
                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Subject <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter subject here"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>
                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Call Number <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter call number here"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    value={callNum}
                    onChange={(e) => setCallNum(e.target.value)}
                  />
                </div>
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Level Number <span className="text-meta-1">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter level no"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                      value={levelNum}
                      onChange={(e) => setLevelNum(e.target.value)}
                    />
                  </div>

                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Shelf Number <span className="text-meta-1">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter shelf no"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                      value={shelfNum}
                      onChange={(e) => setShelfNum(e.target.value)}
                    />
                  </div>
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Category <span className="text-meta-1">*</span>
                  </label>
                  <div className="relative z-20 bg-transparent dark:bg-form-input">
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    >
                      <option value="">Select Category</option>
                      {config.CATEGORIES.map((cat, idx) => {
                        return (
                          <option value={cat.value} key={idx}>
                            {cat.label}
                          </option>
                        );
                      })}
                    </select>
                    <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2">
                      <svg
                        className="fill-current"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g opacity="0.8">
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                            fill=""
                          ></path>
                        </g>
                      </svg>
                    </span>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Synopsis <span className="text-meta-1">*</span>
                  </label>
                  <textarea
                    rows={6}
                    placeholder="Type here"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    value={synopsis}
                    onChange={(e) => setSynopsis(e.target.value)}
                  ></textarea>
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Status <span className="text-meta-1">*</span>
                    <span className="text-sm italic">
                      (Note: This changing of status works only if want to mark
                      the book as Lost or Damaged)
                    </span>
                  </label>
                  <div className="relative z-20 bg-transparent dark:bg-form-input">
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    >
                      <option value="">Select Status</option>
                      {config.STATUSES.map((stat, idx) => {
                        return (
                          <option value={stat.label} key={idx}>
                            {stat.value}
                          </option>
                        );
                      })}
                    </select>
                    <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2">
                      <svg
                        className="fill-current"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g opacity="0.8">
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                            fill=""
                          ></path>
                        </g>
                      </svg>
                    </span>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Remarks
                  </label>
                  <textarea
                    rows={6}
                    placeholder="Type here"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                  ></textarea>
                </div>

                <button
                  onClick={handleSubmit}
                  className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray"
                  disabled={!isFormValid()}
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="flex flex-col gap-9">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Upload Here
              </h3>
            </div>
            <div className="m-14 sm:w-2/5 lg:w-full lg:pl-20 sm:pl-0 ">
              <div className="flex align-center flex-row pb-4">
                <label className="w-1/2 pr-7">Book Cover:</label>
                <Button
                  component="label"
                  variant="contained"
                  startIcon={<CloudUploadIcon />}
                >
                  Upload file
                  <VisuallyHiddenInput
                    type="file"
                    onChange={handleBookCoverUpload}
                  />
                </Button>
              </div>
              <div className="flex flex-row pb-4">
                {bookCover && (
                  <img
                    className="my-4 w-1/4 object-cover"
                    src={`${bookCover}`}
                    alt=" "
                    width={100}
                    height={100}
                  />
                )}
              </div>
              <div className="flex flex-row pb-4">
                <label className="w-1/2 pr-7">Book Map:</label>
                <Button
                  component="label"
                  variant="contained"
                  startIcon={<CloudUploadIcon />}
                >
                  Upload file
                  <VisuallyHiddenInput
                    type="file"
                    onChange={handleBookMapUpload}
                  />
                </Button>
              </div>
              <div className="flex flex-row pb-4">
                {bookMap && (
                  <img
                    className="my-4 w-1/4 object-cover"
                    src={`${bookMap}`}
                    alt=" "
                    width={100}
                    height={100}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
