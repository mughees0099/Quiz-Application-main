import React, { useState, useEffect } from "react";
import PageTitle from "../../../components/PageTitle";
import { message, Table } from "antd";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import { getAllReportsByUser } from "../../../apicalls/reports";
import moment from "moment";

function UserReports() {
  const [reportsData, setReportsData] = useState([]);
  const dispatch = useDispatch();

  const columns = [
    {
      title: "Exam Name",
      dataIndex: "examName",
      render: (text, record) => (
        <span className="font-semibold">{record?.exam?.name}</span>
      ),
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
      render: (text, record) => <span>{record?.exam?.totalMarks}</span>,
    },
    {
      title: "Passing Marks",
      dataIndex: "passingMarks",
      render: (text, record) => <span>{record?.exam?.passingMarks}</span>,
    },
    {
      title: "Obtained Marks",
      dataIndex: "correctAnswers",
      render: (text, record) => (
        <span>{record?.result?.correctAnswers.length}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "verdict",
      render: (text, record) => (
        <span>
          {record.result.correctAnswers.length && record.exam.passingMarks
            ? record.result.correctAnswers.length >= record.exam.passingMarks
              ? "Passed"
              : "Failed"
            : "Not Attempted"}
        </span>
      ),
    },
  ];

  const getData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await getAllReportsByUser();
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
    getData();
  }, []);

  return (
    <div className="p-4 md:p-6 bg-white shadow-md rounded-lg">
      <PageTitle title="Reports" />
      <div className="border-b-2 border-gray-200 mb-4"></div>

      {/* Table for larger screens */}
      <div className="hidden md:block">
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
      <div className="block md:hidden">
        {reportsData.length > 0 ? (
          reportsData.map((report) => {
            // Determine background color based on the status
            const bgColor =
              report.result.correctAnswers.length >= report.exam.passingMarks
                ? "bg-green-200"
                : "bg-red-200";

            return (
              <div
                key={report._id}
                className={`shadow-md rounded-lg p-4 mb-4 ${bgColor}`}
              >
                <h2 className="text-xl font-semibold mb-2">
                  Exam: {report.exam.name}
                </h2>
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
                <p className="text-sm text-gray-600">
                  Status: {bgColor.includes("green") ? "Passed" : "Failed"}
                </p>
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-500">No reports found.</p>
        )}
      </div>
    </div>
  );
}

export default UserReports;
