import { message, Table } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteExamById, getAllExams } from "../../../apicalls/exams";
import PageTitle from "../../../components/PageTitle";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";

function Exams() {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const dispatch = useDispatch();

  const formatDuration = (duration) => {
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    if (hours > 0) {
      return `${hours} ${hours > 1 ? "hours" : "hour"} ${minutes} ${
        minutes > 1 ? "minutes" : "minute"
      }`;
    } else {
      return `${minutes} ${minutes > 1 ? "minutes" : "minute"}`;
    }
  };

  const getExamsData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await getAllExams();
      dispatch(HideLoading());
      if (response.success) {
        const examsWithConvertedDuration = response.data.map((exam) => ({
          ...exam,
          duration: formatDuration(exam.duration),
        }));
        setExams(examsWithConvertedDuration);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const deleteExam = async (examId) => {
    try {
      dispatch(ShowLoading());
      const response = await deleteExamById({
        examId,
      });
      dispatch(HideLoading());
      if (response.success) {
        message.success(response.message);
        getExamsData();
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const columns = [
    {
      title: "Exam Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <span className="font-semibold">{text}</span>,
    },
    {
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Total Marks",
      dataIndex: "totalMarks",
      key: "totalMarks",
    },
    {
      title: "Passing Marks",
      dataIndex: "passingMarks",
      key: "passingMarks",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (text, record) => (
        <div className="flex gap-2">
          <i
            className="ri-pencil-line text-blue-500 cursor-pointer"
            onClick={() => navigate(`/admin/exams/edit/${record._id}`)}
          ></i>
          <i
            className="ri-delete-bin-line text-red-500 cursor-pointer"
            onClick={() => deleteExam(record._id)}
          ></i>
        </div>
      ),
    },
  ];

  useEffect(() => {
    getExamsData();
  }, []);

  return (
    <div className="p-4 md:p-6 bg-white shadow-md rounded-lg">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <PageTitle title="Exams" />
        <button
          className="mt-4 md:mt-0 bg-blue-500 text-white py-2 px-4 rounded flex items-center md:hover:bg-blue-600 transition duration-300"
          onClick={() => navigate("/admin/exams/add")}
        >
          <i className="ri-add-line mr-2"></i>
          Add Exam
        </button>
      </div>
      <div className="border-b-2 border-gray-200 mb-4"></div>

      {/* Table for larger screens */}
      <div className="hidden lg:block">
        <Table columns={columns} dataSource={exams} />
      </div>

      {/* Responsive layout for smaller screens */}
      <div className="block md:grid md:grid-cols-2 gap-3 lg:hidden">
        {exams.map((exam) => (
          <div
            key={exam._id}
            className="bg-white shadow-md rounded-lg p-4 mb-4 transition-transform transform md:md:hover:scale-[1.02] "
          >
            <h2 className="text-xl font-semibold mb-2">{exam.name}</h2>
            <p className="text-sm text-gray-600">Duration: {exam.duration}</p>
            <p className="text-sm text-gray-600">Category: {exam.category}</p>
            <p className="text-sm text-gray-600">
              Total Marks: {exam.totalMarks}
            </p>
            <p className="text-sm text-gray-600">
              Passing Marks: {exam.passingMarks}
            </p>
            <div className="flex justify-end mt-4 gap-2">
              <button
                className="bg-blue-500 text-white py-1 px-3 rounded md:hover:bg-blue-600"
                onClick={() => navigate(`/admin/exams/edit/${exam._id}`)}
              >
                Edit
              </button>
              <button
                className="bg-red-500 text-white py-1 px-3 rounded md:hover:bg-red-600"
                onClick={() => deleteExam(exam._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Exams;
