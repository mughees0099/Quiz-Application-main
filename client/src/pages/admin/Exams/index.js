import { message, Table } from "antd";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteExamById, getAllExams } from "../../../apicalls/exams";
import PageTitle from "../../../components/PageTitle";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";

function Exams() {
  const navigate = useNavigate();
  const [exams, setExams] = React.useState([]);
  const dispatch = useDispatch();

  const getExamsData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await getAllExams();
      dispatch(HideLoading());
      if (response.success) {
        setExams(response.data);
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
    <div className="p-6 bg-white shadow-md rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <PageTitle title="Exams" />
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded flex items-center hover:bg-blue-600 transition duration-300"
          onClick={() => navigate("/admin/exams/add")}
        >
          <i className="ri-add-line mr-2"></i>
          Add Exam
        </button>
      </div>
      <div className="border-b-2 border-gray-200 mb-4"></div>
      <Table columns={columns} dataSource={exams} pagination={false} />
    </div>
  );
}

export default Exams;
