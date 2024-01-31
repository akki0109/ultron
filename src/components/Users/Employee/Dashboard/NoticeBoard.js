import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  getUserListForReporting,
  noticeSaveRequest,
  getAllNotices,
  acknowledgementPost,
  deleteNotice,
} from "../../../../services/noticeBoard.services";
// import Pagination from "react-js-pagination";
import NoticeList from "./NoticeList";
import TextBox from "./TextBox";
import Select from "react-select";
import { Form } from "react-bootstrap";

const NoticeBoard = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [userList, setUserList] = useState([]);
  const [options, setOptions] = useState([]);
  const [selectedValue, setSelectedValue] = useState([]);
  const [editorVal, setEditorVal] = useState("");
  const [editorError, setEditorError] = useState({});
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const [noticeList, setNoticeList] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [page, setPage] = useState(1);
  const [fUpdate, setfUpdate] = useState(1);
  const listInnerRef = useRef(null);
  const contentRef = useRef();
  const [showOptions, setShowOptions] = useState();

  useEffect(() => {
    getAllUser();
  }, []);

  useEffect(() => {
    getNotices();
  }, [fUpdate]);

  const getAllUser = () => {
    let payload = {
      search: "",
    };
    getUserListForReporting(payload)
      .then((item) => {
        let reportingList = [];
        let suggetionList = [];
        let optionList = [];
        if (item.data) {
          item?.data?.map((item) => {
            if (user?.data?._id !== item._id) {
              reportingList.push({
                id: item?._id,
                name: item?.first_name + " " + item?.last_name,
              });

              suggetionList.push({
                id: item?._id,
                value: item?.first_name + " " + item?.last_name,
              });

              optionList.push({
                value: item?._id,
                label: item?.first_name + " " + item?.last_name,
              });
            }
          });
          setSuggestions(suggetionList);
          setUserList([
            ...reportingList,
            {
              id: user.data?._id,
              name: user.data?.first_name + " " + user.data?.last_name,
            },
          ]);
          setOptions(optionList);
        }
      })
      .catch((error) => {
        console.log("erroes", error);
        setError(error);
        setLoading(false);
      });
    console.log(error);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Remove any HTML tags from the editor value
    const sanitizedValue = editorVal.replace(/(<([^>]+)>)/gi, "");
    // Validate if the sanitized value is empty or only contains whitespace
    if (sanitizedValue.trim() === "") {
      // Handle the case when the editor is blank
      setEditorError({ error: "Please enter your text." });
    } else {
      // Perform the desired action with the non-empty editor value
      let assignTo = [];
      selectedValue.length > 0 &&
        selectedValue.map((user) => {
          assignTo.push(user?.value);
        });
      let payload = {
        createdBy: user?.data?._id,
        title: editorVal,
        assignedTo: assignTo,
      };
      console.log(2233, payload);
      setLoading(true);
      noticeSaveRequest(payload).then((data) => {
        if (data.status === 200) {
          setEditorVal("");
          setLoading(false);
          setSelectedValue([]);
          setFilterType("all");
          setPage(1);
          setfUpdate(Math.random());
          setEditorError({ error: "" });
        } else {
          setError(data.errors);
          setEditorVal("");
          setLoading(false);
        }
      });
    }
  };

  const acknowledgement = (noticeId, indexId) => {
    acknowledgementPost({ noticeId, userId: user.data._id }).then((result) => {
      if (result.status == 200) {
        let replaceData = [...noticeList];
        replaceData[indexId] = {
          noticeboards: {
            ...result.noticeData[0].noticeboards,
            total_acknowledments:
              result.noticeData[0].noticeboards.acknowledments.length,
          },
        };
        setNoticeList(replaceData);
      } else console.log("error", result);
    });
  };

  const getNotices = () => {
    let request = {
      userId: user?.data?._id,
      filter: filterType,
      page: page,
    };

    getAllNotices(request).then((data) => {
      if (data.status === 200) {
        if (page > 1 && noticeList.length > 0) {
          let oldList = noticeList;
          let newList = oldList.concat(data?.data);
          setNoticeList(newList);
        } else {
          setNoticeList(data?.data);
        }
        setError({});
      } else {
        setError(data.errors);
      }
    });
  };

  const getUserInitials = (Name) => {
    if (Name !== undefined && Name !== null && Name != "") {
      const initials = Name.charAt(0);
      return initials.toUpperCase();
    } else {
      return "";
    }
  };

  const filterList = (type) => {
    setFilterType(type);
    setPage(1);
    setfUpdate(Math.random());
  };

  const onScroll = () => {
    if (listInnerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
      if (scrollTop + clientHeight === scrollHeight) {
        // TO SOMETHING HERE
        console.log("Reached bottom");

        let pages = Number(page) + 1;

        setPage(pages);
        setfUpdate(Math.random());
      }
    }
  };

  const trashNotice = (_id, index) => {
    deleteNotice({ _id }).then((result) => {
      if (result.status == 200) {
        let replaceData = [...noticeList];
        replaceData.splice(index, 1);
        setNoticeList(replaceData);
      } else console.log("error", result);
    });
  };

  const handleChange = (e) => {
    setSelectedValue(e);
  };

  const focusOnTextBox = () => {
    setTimeout(() => {
      contentRef.current.focus();
    }, 500);
  };

  const resetTextBoxData = () => {
    setEditorVal("");
    setSelectedValue([]);
    setEditorError({});
  };

  const handleInputChange = useCallback((typedOption) => {
    if (typedOption.trim().length > 2) {
      setShowOptions(true);
    } else {
      setShowOptions(false);
    }
  }, []);

  return (
    <div
      ref={listInnerRef}
      className="test dashboard_info_box_tabdetail"
      onScroll={() => onScroll()}
    >
      <div className="d-flex p-2 filter_internal">
        <div>
          <a
            href="javascript:;"
            data-toggle="modal"
            onClick={() => filterList("all")}
            className={filterType == "all" ? "link active" : "link"}
          >
            All
          </a>
        </div>

        <div>
          <a
            href="javascript:;"
            data-toggle="modal"
            onClick={() => filterList("in")}
            className={filterType == "in" ? "link active" : "link"}
          >
            Received
          </a>
        </div>

        <div>
          <a
            href="javascript:;"
            data-toggle="modal"
            onClick={() => filterList("out")}
            className={filterType == "out" ? "link active" : "link"}
          >
            Sent
          </a>
        </div>
      </div>
      <div className="collapseMessagefield_area">
        <a
          data-bs-toggle="collapse"
          href="#collapseMessagefield"
          role="button"
          aria-expanded="false"
          aria-controls="collapseMessagefield"
          style={{ cursor: "pointer" }}
          className="w-100"
        >
          <Form.Control
            type="email"
            onFocus={focusOnTextBox}
            placeholder=" Write a new update"
            className="mt-0"
          />
        </a>
        <div className="collapse mt-0" id="collapseMessagefield">
          <div className="card">
            <div className="editor-container">
              {suggestions.length ? (
                <TextBox
                  people={suggestions}
                  value={editorVal}
                  setEditorVal={setEditorVal}
                  editorVal={editorVal}
                  setSelectedValue={setSelectedValue}
                  ref={contentRef}
                />
              ) : null}
            </div>
            <div>
              <div className="d-flex my-2 justify-content-between align-items-center mx-3">
                <div className="d-flex align-items-center iconRemove">
                  <label className="mr-3 mb-0">Notify:</label>
                  <Select
                    isMulti
                    name="colors"
                    options={showOptions ? options : []}
                    value={selectedValue}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    noOptionsMessage={() => (showOptions ? "No options" : null)}
                    onChange={handleChange}
                    placeholder="All Users"
                    onInputChange={handleInputChange}
                  />
                </div>
                <div className="text-right">
                  <a
                    className="mr-3 btn btn-sm btn-default"
                    data-bs-toggle="collapse"
                    href="#collapseMessagefield"
                    role="button"
                    aria-expanded="false"
                    aria-controls="collapseMessagefield"
                    onClick={resetTextBoxData}
                  >
                    Cancel
                  </a>
                  <button
                    type="button"
                    onClick={(e) => handleSubmit(e)}
                    className="btn btn-sm btn-primary"
                    disabled={loading}
                  >
                    {loading ? "Loading..." : "Update"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {editorError?.error ? (
        <p className="text-danger ml-3 mt-1">{editorError.error}</p>
      ) : null}
      <NoticeList
        noticeList={noticeList}
        getUserInitials={(name) => getUserInitials(name)}
        getNotices={getNotices}
        userList={userList}
        acknowledgement={acknowledgement}
        trashNotice={trashNotice}
        currentUser={user}
      />
    </div>
  );
};

export default NoticeBoard;
