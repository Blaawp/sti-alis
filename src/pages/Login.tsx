import { FaEye, FaEyeSlash } from 'react-icons/fa';

import { useState, useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { sessionAtom, getSession } from '../Store';
import { useNavigate, Navigate } from 'react-router-dom';
import { IsUserExistByEmail, SaveLoginHistory } from '../services';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPassVisible, setIsPassVisible] = useState(false);
  const [isInvalidCredentials, setIsInvalidCredentials] = useState(false);

  const setSession = useSetAtom(sessionAtom);

  const navigate = useNavigate();

  const login = async (e: any) => {
    e.preventDefault();
    try {
      const res = await IsUserExistByEmail(
        `${email}`,
        password,
      );

      if (!res) {
        setIsInvalidCredentials(true);
        return;
      }

      setSession(res);
      SaveLoginHistory(res);

      if (res.role === 'admin') {
        navigate('/dashboard');
      } else {
        navigate('/home');
      }
    } catch (e) {
      console.log('error :>> ', e);
    }
  };

  if (getSession()) {
    if (getSession().role === 'student') {
      return <Navigate to={`/home`} />;
    } else {
      return <Navigate to={`/dashboard`} />;
    }
  }

  return (
    <>
      <div className="flex h-screen flex-row">
        <div className="h-full w-3/4 hidden lg:block">
          <img
            src="/assets/people-cropped.jpg"
            alt=" "
            className="h-full w-full object-cover object-center"
          ></img>
          <div className="absolute left-24 top-44 z-10 mb-3 flex flex-col space-y-2 px-2 text-white">
            <h4 className="mb-2 text-6xl font-semibold">BE FUTURE-READY</h4>
            <h4 className="mb-2 text-6xl font-semibold">BE STI</h4>
          </div>
          <div className="bg-black-overlay w-3/4"></div>
        </div>
        <form
          className="flex lg:w-1/4 w-full flex-col items-center justify-center bg-[#fff200] p-4 align-middle"
          noValidate
        >
          {/* <div className="flex lg:w-1/4 w-full flex-col items-center justify-center bg-[#fff200] p-4 align-middle"> */}
          <img src="/logo/sti.svg" alt=" " className="mb-12 w-2/4" />
          <h1 className="mb-12 text-2xl font-bold text-blue-500">
            A.L.I.S Login
          </h1>
          <div className="relative mb-2 w-full">
            <input
              className="w-full bg-white rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              type="text"
              placeholder="Email"
              id="email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
            {/* <p className="absolute inset-y-0 right-0 flex items-center rounded-r-lg bg-slate-300 px-4 font-bold bg-alis-gray text-black">
              @caloocan.sti.edu.ph
            </p> */}
          </div>
          <div className="relative mb-2 w-full">
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
              className="absolute inset-y-0 right-0 flex items-center rounded-r-lg bg-white px-4 font-bold text-black"
            >
              {!isPassVisible ? (
                <FaEye color="black" />
              ) : (
                <FaEyeSlash color="black" />
              )}
            </div>
          </div>
          {isInvalidCredentials && (
            <span className="text-danger">Invalid account or credentials</span>
          )}

          <input
            type="submit"
            className="mb-4 w-3/4 rounded bg-alis-blue text-white p-2 text-center font-bold"
            onClick={login}
            value="LOGIN"
          />
          {/* LOGIN
          </button> */}
          <p className="mb-2 text-sm text-black text-center">
            If the user doesn't have an account, please go to the STI College
            Caloocan Library
          </p>
          <p className="text-sm text-black">©2023 ALIS </p>
          {/* </div> */}
        </form>
      </div>
    </>
  );
};

export default Login;
