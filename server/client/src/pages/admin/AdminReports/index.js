import React, { useState, useEffect } from "react";
import PageTitle from "../../../components/PageTitle";
import { message, Table } from "antd";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import { getAllReports } from "../../../apicalls/reports";
import moment from "moment";

function AdminReports() {
  const [reportsData, setReportsData] = useState([]);
  const dispatch = useDispatch();
  const [filters, setFilters] = useState({
    examName: "",
    userName: "",
  });

  const columns = [
    {
      title: "Exam Name",
      dataIndex: "examName",
      render: (text, record) => (
        <span className="font-semibold">{record.exam.name}</span>
      ),
    },
    {
      title: "User Name",
      dataIndex: "userName",
      render: (text, record) => <span>{record.user.name}</span>,
    },
    {
      title: "Date",
      dataIndex: "date",
      render: (text, record) => (
        <span>{moment(record.createdAt).format("DD-MM-YYYY hh:mm:ss")}</span>
      ),
    },
    {
      title: "Total Marks",
      dataIndex: "totalMarks",
      render: (text, record) => <span>{record.exam.totalMarks}</span>,
    },
    {
      title: "Passing Marks",
      dataIndex: "passingMarks",
      render: (text, record) => <span>{record.exam.passingMarks}</span>,
    },
    {
      title: "Obtained Marks",
      dataIndex: "correctAnswers",
      render: (text, record) => (
        <span>{record.result.correctAnswers.length}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "verdict",
      render: (text, record) => (
        <span>
          {" "}
          {record.result.correctAnswers.length >= record.exam.passingMarks
            ? "Passed"
            : "Failed"}
        </span>
      ),
    },
  ];

  const getData = async (tempFilters) => {
    try {
      dispatch(ShowLoading());
      const response = await getAllReports(tempFilters);
      if (response.success) {
        setReportsData(response.data);
      } else {
        message.error(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  useEffect(() => {
    getData(filters);
  }, []); // Ensure useEffect runs only when filters change

  return (
    <div className="p-4 md:p-6 bg-white shadow-md rounded-lg">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <PageTitle title="Reports" />
        <div className="flex gap-4 mt-4 md:mt-0">
          <button
            className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition duration-300"
            onClick={() => {
              setFilters({ examName: "", userName: "" });
              getData({ examName: "", userName: "" });
            }}
          >
            Clear
          </button>
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
            onClick={() => getData(filters)}
          >
            Search
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Exam"
          value={filters.examName}
          onChange={(e) => {
            const examName =
              e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1);
            setFilters({ ...filters, examName });
          }}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="User"
          value={filters.userName}
          onChange={(e) => setFilters({ ...filters, userName: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Table for larger screens */}
      <div className="hidden lg:block">
        <Table
          columns={columns}
          dataSource={reportsData}
          pagination={false}
          scroll={{ x: 800 }}
          rowClassName={(record) =>
            record.result.correctAnswers.length >= record.exam.passingMarks
              ? "bg-green-200"
              : "bg-red-200"
          }
        />
      </div>

      {/* Responsive layout for smaller screens */}
      <div className="block md:grid md:grid-cols-2 md:gap-4 lg:hidden">
        {reportsData.map((report) => (
          <div
            key={report._id}
            className={`  shadow-md rounded-lg p-4 mb-4 ${
              report.exam.passingMarks <= report.result.correctAnswers.length
                ? "bg-green-200 text-green-800"
                : "bg-red-200 text-red-800"
            }`}
          >
            <h2 className="text-xl font-semibold mb-2">
              Exam: {report.exam.name}
            </h2>
            <p className="text-sm text-gray-600">User: {report.user.name}</p>
            <p className="text-sm text-gray-600">
              Date: {moment(report.createdAt).format("DD-MM-YYYY hh:mm:ss")}
            </p>
            <p className="text-sm text-gray-600">
              Total Marks: {report.exam.totalMarks}
            </p>
            <p className="text-sm text-gray-600">
              Passing Marks: {report.exam.passingMarks}
            </p>
            <p className="text-sm text-gray-600">
              Obtained Marks: {report.result.correctAnswers.length}
            </p>
            <p className="text-sm text-gray-600 ">
              Status:{" "}
              {report.exam.passingMarks <= report.result.correctAnswers.length
                ? "Passed"
                : "Failed"}{" "}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminReports;
