import React, { useEffect, useState } from "react";
import { Link,Redirect } from "react-router-dom";
import Navbar from "../../Layout/Navbar";
import Footer from "../../../../GlobalComponents/Footer";
import { terminateList } from "../../../../../services/admin/terminateUser.service";
// import ConfirmTerminate from "../ConfirmTerminate";
import Pagination from "react-js-pagination";
import { Input } from "reactstrap";
import TerminateUpdate from "../User/Terminate";
import moment from "moment";

const TerminateData = () => {
  const [usersList, setUserList] = useState();
  const [toggle, setToggle] = useState(false);
  const [terminateData, setTerminateData] = useState();
  const [activePage, setActivePage] = useState(1);
  const [totalItemsCount, setTotalItemsCount] = useState(0);
  const user = JSON.parse(localStorage.getItem("user"));
  useEffect(() => {
    terminateListData(activePage);
  }, []);
  const terminateListData = (page, search = "") => {
    terminateList(page, search).then((result) => {
      if (result.data.data) {
        setUserList(result.data.data);
      }
      console.log("totalItemsCount", result?.data?.total_count);
      if (result?.data?.total_count)
        setTotalItemsCount(result?.data?.total_count);
    });
  };
  console.log("hello world", totalItemsCount);
  function update(data) {
    setTerminateData(data);
    setToggle(true);
  }
  const handlePageChange = (e) => {
    setActivePage(e);
    terminateListData(e);
  };
  const handleSearch = (e) => {
    setActivePage(1);
    terminateListData(1, e);
  };

  if (!user) {
    return <Redirect to="/" />;
  }
  if (user.data.user_role !== "Admin") {
    return <Redirect to="/" />;
  }
  return (
    <div>
      <Navbar activePage="dashboard" />
      <main className="offset">
        <div className="container-fluid hard-pad mb-5">
          <div className="row align-items-center pt-4 border-mobile">
            <div className="col-lg-4 col-6">
              <h2 className="page-heading"> Exit </h2>
            </div>
          </div>
          <div className="row align-items-center pt-4 border-mobile">
            <div className="col-lg-8">
              <ul className="submenu">
                <li>
                  <Link to="/admin/settings/users">Employees</Link>
                </li>
                <li className="">
                  <Link to="/admin/settings/department">Departments</Link>
                </li>
                <li className="">
                  <Link to="/admin/holidays">Holidays</Link>
                </li>
                <li className="active">
                  <Link to="/admin/settings/terminate-list">Exit</Link>
                </li>
              </ul>
            </div>
            <div className="col-lg-4 search-box">
              <Input
                id="exampleSearch"
                name="search"
                className="search__input"
                autoComplete="off"
                placeholder="Search"
                type="search"
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="main-table">
            <div className="table-scroll mt-4 pagination_mrg">
              <table className="">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th>Employee Name</th>
                    <th>Designation</th>
                    <th>Phone</th>
                    <th>Date of Joining</th>
                    <th>Last working day</th>
                    <th>Reason</th>
                    <th className="text-center hight_index">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {usersList &&
                    usersList.map((item) => (
                      <tr key={item._id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="name">
                              <strong>
                                <div className="avtar">
                                  {item.users.first_name.slice(0, 1)}{" "}
                                  {item.users.last_name.slice(0, 1)}
                                </div>
                              </strong>
                            </div>
                          </div>
                        </td>
                        <td className="text-capitalize">
                          <a>
                            <strong>
                              {item.users.first_name} {item.users.last_name}
                            </strong>
                          </a>
                        </td>
                        <td className="text-capitalize">
                          <a>{item.users.designation}</a>
                        </td>
                        <td>
                          <a>{item.users.phone}</a>
                        </td>
                        <td className="text-nowrap">
                          <a>
                            {" "}
                            {moment(item.users.date_of_joining).format("L")}
                          </a>
                        </td>
                        <td className="text-nowrap">
                          <a>
                            {" "}
                            {moment(item.terminateReason[0].date).format("L")}
                          </a>
                        </td>
                        <td
                          data-bs-toggle="tooltip"
                          data-bs-placement="top"
                          title={item.terminateReason[0].reason}
                        >
                          <div className="text_eclip text-capitalize">
                            <a>{item.terminateReason[0].reason}</a>
                          </div>
                        </td>
                        <td className="text-center">
                          <div className="action-area dropdown">
                            <a
                              className="dropdown-toggle"
                              id="navbarDropdown"
                              role="button"
                              data-bs-toggle="dropdown"
                              aria-haspopup="true"
                              aria-expanded="false"
                            >
                              <span className="dots">...</span>
                            </a>
                            <div
                              className="dropdown-menu"
                              aria-labelledby="navbarDropdown"
                            >
                              <a
                                className="dropdown-item "
                                onClick={() => update(item.terminateReason[0])}
                              >
                                Edit
                              </a>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  {usersList?.length === 0 && (
                    <tr>
                      <td colSpan={8} className="text-center">
                        <div className="norecords"> <div className="norecords">No Record Found</div> </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
          {usersList && usersList.length > 0 && (
            <Pagination
              activePage={activePage}
              itemsCountPerPage={10}
              totalItemsCount={totalItemsCount}
              pageRangeDisplayed={5}
              onChange={handlePageChange}
              itemClass="page-item"
              linkClass="page-link"
              innerClass="pagination justify-content-center"
              activeLinkClass="active"
              nextPageText="Next"
              prevPageText="Previous"
            />
          )}
      </main>
      <div className="right-aside">
        <p className="mt-5 text-center">Terminate Summary</p>

        <div className="stats">
          <div className="stats-big">{totalItemsCount}</div>
          <div className="stats-small">Employees</div>
        </div>
      </div>

      <Footer />

      {/* Confirmation of termination */}
      {/* <ConfirmTerminate
        show={show}
        isClose={handleClose}
        id={ids}
        userList={terminateListData}
        error={setError}
      /> */}
      {/* Edit user data */}
      <TerminateUpdate
        isOpen={toggle}
        isClose={() => setToggle(!toggle)}
        data={terminateData}
        userList={terminateListData}
        userId={terminateData?.userId}
      />
    </div>
  );
};

export default TerminateData;
