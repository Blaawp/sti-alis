import { FaEye, FaEyeSlash } from 'react-icons/fa';

import { useDropzone } from 'react-dropzone';
import * as xlsx from 'xlsx';

import Breadcrumb from '../components/Breadcrumb';
import { Link } from 'react-router-dom';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import ListSubheader from '@mui/material/ListSubheader';
import { BiUpload } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import { AddUserByID } from '../services';
import { useRef, useState } from 'react';
import config from '../config';
import { validateEmail } from '../utils';

export default function AddUser() {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userCourse, setUserCourse] = useState('');
  const [userRole, setUserRole] = useState('');
  const [userId, setUserId] = useState('');
  const [isValidContactNumber, setIsValidContactNumber] = useState(true);
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [password, setPassword] = useState('');
  const [isPassVisible, setIsPassVisible] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isConfirmPassVisible, setIsConfirmPassVisible] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [formIsValid, setFormIsValid] = useState(true);

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    // Check if passwords match and update state
    setPasswordsMatch(e.target.value === confirmPassword);
  };

  // const handleConfirmPasswordChange = (e) => {
  //   setConfirmPassword(e.target.value);
  //   // Check if passwords match and update state
  //   setPasswordsMatch(e.target.value === password);
  // };

  const isFormValid = () => {
    if (
      firstName.trim() === '' ||
      lastName.trim() === '' ||
      contactNumber.trim() === '' ||
      userEmail.trim() === '' ||
      userPassword.trim() === '' ||
      userCourse.trim() === '' ||
      userRole.trim() === ''
    ) {
      // If any required field is empty, the form is not valid
      return false;
    }

    // You can add more specific validation conditions here

    return true;
  };



  const readUploadFile = (e) => {
    e.preventDefault();
    if (e.target.files) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = xlsx.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = xlsx.utils.sheet_to_json(worksheet);
        json.forEach(async (row) => {

          try {
            // Access values using property names
            const userId = row['User ID'].toString();
            const firstName = row['First Name'];
            const middleName = row['Middle Name'];
            const lastName = row['Last Name'];
            const contactNumber = row['Contact Number'];
            const email = row['Email'];
            const password = row['Password'];
            const confirmPassword = row['Confirm Password'];
            const course = row['Course'];
            const role = row['Role'];

            // Check for missing values and skip the row if necessary
            // Check for missing values and skip the row if necessary
            if (
              userId === undefined ||
              firstName === undefined ||
              lastName === undefined ||
              contactNumber === undefined ||
              email === undefined ||
              password === undefined ||
              confirmPassword === undefined ||
              course === undefined ||
              role === undefined
            ) {
              alert(`Skipping row due to missing values`);
              return; // Skip to the next iteration
            }

         

            const userDetails = {
              user_id: userId,
              first_name: firstName,
              middle_name: middleName,
              last_name: lastName,
              contact_num: contactNumber,
              email: email,
              password: password,
              course: course,
              role: role
            };

            try {
              await AddUserByID(userDetails);
        
            } catch (error) {
              console.error('Error adding document: ', error);
            }

          } catch (error) {
            console.error(`Error processing row:`, error);
            alert(`Error processing row:`);
          }

        });

        alert("File has been successfully loaded")
        navigate('/users')
      };
      reader.readAsArrayBuffer(e.target.files[0]);
    }
  }


  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsValidContactNumber(true);
    setIsValidEmail(true);

    if (contactNumber.length !== 11) {
      setIsValidContactNumber(false);
      return;
    }

    if (!validateEmail) {
      setIsValidEmail(false);
      alert("Invalid Email")
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match")
      return;
    }


    const userDetails = {
      first_name: firstName,
      middle_name: middleName,
      last_name: lastName,
      contact_num: contactNumber,
      user_id: userId,
      email: userEmail,
      password: userPassword,
      course: userCourse,
      role: userRole,
    };

    try {
      await AddUserByID(userDetails);

      navigate('/users');
    } catch (error) {
      console.error('Error adding document: ', error);
    }

    setUserId('');
    setFirstName('');
    setMiddleName('');
    setLastName('');
    setContactNumber('');
    setUserEmail('');
    setUserPassword('');
    setUserCourse('');
    setUserRole('');
  };

  return (
    <>
      <Breadcrumb pageName="Add User" />
      <div className="grid grid-cols-2 gap-9 sm:grid-cols-2">
        <div className="flex flex-col gap-9">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="flex justify-between  border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Add User
              </h3>
              <Link
                to="/Users"
                className="inline-flex items-center justify-center rounded-full bg-primary py-2 px-6 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-5"
              >
                Back
              </Link>
            </div>
            <form
              className="flex flex-col"
              onSubmit={(e) => handleSubmit}
            >
              <div className="p-6.5">
                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    User ID <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your User ID"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    value={userId}
                    onChange={(e) => {
                      setUserId(e.target.value);
                    }}
                    required
                  />
                </div>
                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    First Name <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your first name"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    value={firstName}
                    required
                    onChange={(e) => {
                      setFirstName(e.target.value);
                    }}
                  />
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Middle Name <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your middle name"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    value={middleName}
                    onChange={(e) => {
                      setMiddleName(e.target.value);
                    }}
                    required
                  />
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Last Name <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your last name"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    value={lastName}
                    onChange={(e) => {
                      setLastName(e.target.value);
                    }}
                    required
                  />
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Contact Number <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your contact number (e.g. 09261234567)"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    value={contactNumber}
                    onChange={(e) => {
                      const contactNum = e.target.value;
                      const removeNonNumbers = contactNum.replace(/\D/g, '');
                      if (removeNonNumbers.length > 11) {
                        return;
                      }
                      setContactNumber(removeNonNumbers);
                    }}
                    required
                  />
                  {!isValidContactNumber && (
                    <span className="text-danger">Invalid contact number</span>
                  )}
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Email <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    value={userEmail}
                    onChange={(e) => {
                      setUserEmail(e.target.value);
                    }}
                    required
                  />
                  {!isValidEmail && (
                    <span className="text-danger">Invalid email</span>
                  )}
                </div>


                <div className="relative mb-2 w-full">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Password <span className="text-meta-1">*</span>
                  </label>
                  <div className="relative">
                    <input
                      className="w-full bg-white rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-500"
                      type={`${isPassVisible ? `text` : `password`}`}
                      placeholder="Password"
                      id="email"
                      value={password}
                      required
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <div
                      onClick={() => setIsPassVisible(!isPassVisible)}
                      className="absolute inset-y-0 right-0 flex items-center rounded-r-lg bg-white px-4 font-bold text-black cursor-pointer"
                    >
                      {!isPassVisible ? (
                        <FaEye color="black" />
                      ) : (
                        <FaEyeSlash color="black" />
                      )}
                    </div>
                  </div>
                </div>


                {/* CONFIRM PASSWORD */}
                <div className="relative mb-2 w-full">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Confirm Password <span className="text-meta-1">*</span>
                  </label>
                  <div className="relative">
                    <input
                      className={`w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${!passwordsMatch ? 'border-red-500' : ''
                        }`}
                      type={isConfirmPassVisible ? 'text' : 'password'}
                      placeholder="Confirm Password"
                      id="confirmPassword"
                      value={confirmPassword}
                      required
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <div
                      onClick={() => setIsConfirmPassVisible(!isConfirmPassVisible)}
                      className="absolute inset-y-0 right-0 flex items-center rounded-r-lg bg-white px-4 font-bold text-black cursor-pointer"
                    >
                      {!isConfirmPassVisible ? (
                        <FaEye color="black" />
                      ) : (
                        <FaEyeSlash color="black" />
                      )}
                    </div>
                  </div>
                </div>

                {!passwordsMatch && (
                  <span className="text-danger">Passwords do not match</span>
                )}



                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Course <span className="text-meta-1">*</span>
                  </label>
                  <div className="relative z-20 bg-transparent dark:bg-form-input">
                    <Select
                      className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent  outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                      value={userCourse}
                      onChange={(e) => {
                        setUserCourse(e.target.value);
                      }}
                    >
                      <ListSubheader>COLLEGE COURSES</ListSubheader>
                      {config.COURSES.COLLEGE.map((course, idx) => {
                        return (
                          <MenuItem value={course.value} key={idx}>
                            {course.label}
                          </MenuItem>
                        );
                      })}
                      .<ListSubheader>SENIOR HIGH SCHOOL PROGRAM</ListSubheader>
                      {config.COURSES.SHSP.map((course, idx) => {
                        return (
                          <MenuItem value={course.value} key={idx}>
                            {course.label}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </div>
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Role <span className="text-meta-1">*</span>
                  </label>
                  <div className="relative z-20 bg-transparent dark:bg-form-input">
                    <Select
                      className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent  outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                      value={userRole}
                      onChange={(e) => {
                        setUserRole(e.target.value);
                      }}
                    >
                      {config.ROLES.map((role, idx) => {
                        return (
                          <MenuItem value={role.value} key={idx}>
                            {role.label}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </div>
                </div>
                {/* Your form fields here... */}

                {!isFormValid() && (
                  <div className="text-red-500 mb-2">
                    Please fill in all required fields and correct any errors.
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleSubmit}
                  className={`flex w-full justify-center rounded bg-primary p-3 font-medium text-gray`}
                >
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
        {/* Second Column for Add Multiple Users Section */}
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Add Multiple Users
            </h3>
          </div>
          <div className="p-6.5">


            <form>
              <label htmlFor="upload">Upload File</label>
              <input
                type="file"
                name="upload"
                id="upload"
                onChange={readUploadFile}
              />
            </form>
            <label className="mb-2.5 block text-black dark:text-white py-10">
              You can add multiple users at once by simply uploading the list of students using an excel file.
            </label>
          </div>
        </div>
      </div>
    </>
  );
}
