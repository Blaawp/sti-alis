import Breadcrumb from '../components/Breadcrumb';
import { Link } from 'react-router-dom';
import { BsFillPlusSquareFill } from 'react-icons/bs';
import UsersTable from '../components/UsersTable';
import { useState, useEffect } from 'react';
import { GetAllUsers } from '../services';
import SearchBar from '../components/SearchBar.jsx';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      const users = await GetAllUsers();


      setUsers(users);
    };

    fetchUsers();
  }, []);

  return (
    <>
      <Breadcrumb pageName="Users" />
      <div className="flex flex-col gap-10">
        <div className="my-2 flex h-full w-full flex-col items-center justify-center space-y-10 align-middle">
          <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
            <div className="flex w-full flex-row justify-between pb-5 ">
              <SearchBar
                placeholder={`Search by user ID...`}
                setSearchTerm={setSearchTerm}
              />
              <Link to="/AddUser">
                <BsFillPlusSquareFill color="black" size="40px" />
              </Link>
            </div>

            <div className="flex flex-col">
              <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-4">
                <div className="hidden p-2.5 text-center sm:block xl:p-5">
                  <h5 className="text-sm font-medium uppercase xsm:text-base text-center">
                    Student's Information
                  </h5>
                </div>
                <div className="p-2.5 text-center xl:p-5">
                  <h5 className="text-sm font-medium uppercase xsm:text-base">
                    Email
                  </h5>
                </div>
                <div className="p-2.5 text-center xl:p-5">
                  <h5 className="text-sm font-medium uppercase xsm:text-base">
                    Role
                  </h5>
                </div>
                <div className="p-2.5 text-center  xl:p-5">
                  <h5 className="text-sm font-medium uppercase xsm:text-base">
                    Actions
                  </h5>
                </div>
              </div>

              {users &&
                users
                  .filter((val) => {
                    if (searchTerm == '') {
                      return val;
                    } else if (val.user_id.includes(searchTerm)) {
                      return val;
                    }
                  })
                  .map((user, id) => <UsersTable {...user} key={id} />)}
            </div>

            <div>
              {users.filter((val) => {
                if (searchTerm === '') {
                  return true;
                } else if (val.user_id.includes(searchTerm)) {
                  return true;
                }
                return false;
              }).length === 0 && (
                <div className="text-lg pb-5 mt-5 flex w-full flex-row items-center justify-center align-middle font-bold text-danger">
                  No records found!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
