import Breadcrumb from '../components/Breadcrumb';
import { Link, useLocation } from 'react-router-dom';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import ListSubheader from '@mui/material/ListSubheader';
import { BiUpload } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { UpdateUserByID } from '../services';
import config from '../config';
import { validateEmail } from '../utils';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function EditUser() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const {
    id,
    email,
    first_name,
    middle_name,
    last_name,
    contact_num,
    password,
    course,
    role,
    user_id,
  } = state;

  const [firstName, setFirstName] = useState(first_name);
  const [middleName, setMiddleName] = useState(middle_name);
  const [lastName, setLastName] = useState(last_name);
  const [contactNumber, setContactNumber] = useState(contact_num);
  const [userEmail, setUserEmail] = useState(email);
  const [userPassword, setUserPassword] = useState(password);
  const [userCourse, setUserCourse] = useState(course);
  const [userRole, setUserRole] = useState(role);
  const [userId, setUserId] = useState(user_id);
  const [isValidContactNumber, setIsValidContactNumber] = useState(true);
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isConfirmPassVisible, setIsConfirmPassVisible] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [isPassVisible, setIsPassVisible] = useState(false);

  const isFormValid = () => {
    // Check if required fields are not empty
    return (
      firstName.trim() !== '' &&
      middleName.trim() !== '' &&
      lastName.trim() !== '' &&
      contactNumber.trim() !== '' &&
      userEmail.trim() !== '' &&
      userPassword.trim() !== '' &&
      userCourse !== '' &&
      userRole !== ''
    );
  };

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


    if (userPassword === '') {
      alert("Password cannot be empty.")
      return;
    }
 
    // if (userPassword !== confirmPassword) {
    //   alert("Passwords do not match")
    //   return;
    // }

    
    const userDetails = {
      first_name: firstName,
      middle_name: middleName,
      last_name: lastName,
      contact_num: contactNumber,
      user_id: userId,
      email: userEmail,
      password: userPassword,
      course: userCourse,
      role: userRole.toLowerCase(),
    };

    try {
      await UpdateUserByID(userDetails);
      console.log("user updated")
      // Redirect to the users page after successful update
      navigate('/users');
    } catch (error) {
      console.error('Error updating user: ', error);
    }
  };

  return (
    <>
      <Breadcrumb pageName="Edit User" />
      <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
        <div className="flex flex-col gap-9">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="flex justify-between  border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Edit User
              </h3>
              <Link
                to="/Users"
                className="inline-flex items-center justify-center rounded-full bg-primary py-2 px-6 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-5"
              >
                Back
              </Link>
            </div>
            <form action="#">
              <div className="p-6.5">
                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    User ID
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your User ID"
                    disabled
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary dark:disabled:bg-black"
                    value={userId}
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
                    onChange={(e) => {
                      setFirstName(e.target.value);
                    }}
                    required
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
                      value={userPassword}
                      required
                      onChange={(e) => setUserPassword(e.target.value)}
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

                      <ListSubheader>SENIOR HIGH SCHOOL PROGRAM</ListSubheader>
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
                <button
                  type="submit"
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
      </div>
    </>
  );
}
