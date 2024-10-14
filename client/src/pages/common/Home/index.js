import { Col, message, Row } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllExams } from "../../../apicalls/exams";
import { getAllReportsByUser } from "../../../apicalls/reports";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import PageTitle from "../../../components/PageTitle";
import { useNavigate } from "react-router-dom";

function Home() {
  const [exams, setExams] = useState([]);
  const [examHistory, setExamHistory] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);

  const getExams = async () => {
    try {
      dispatch(ShowLoading());
      const response = await getAllExams();
      if (response.success) {
        setExams(response.data);
      } else {
        message.error(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const getExamHistory = async () => {
    try {
      dispatch(ShowLoading());
      const response = await getAllReportsByUser(user._id);
      if (response.success) {
        setExamHistory(response.data);
      } else {
        message.error(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

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

  useEffect(() => {
    getExams();
    getExamHistory();
  }, []);

  return (
    user && (
      <div className="container mx-auto p-4">
        <PageTitle title={`Hi ${user.name}, Welcome to Quiz Application`} />
        <div className="border-b-2 border-gray-200 my-4"></div>
        <Row gutter={[16, 16]}>
          {exams.map((exam) => {
            const hasTakenExam = examHistory.some(
              (examT) => examT.exam && examT.exam._id === exam._id
            );

            return (
              <Col span={6} key={exam._id}>
                <div className="bg-white shadow-2xl shadow-black/70 rounded-lg p-6 flex flex-col gap-1 transition-transform transform hover:scale-105 h-72">
                  <h1 className="text-2xl font-semibold text-gray-800 truncate">
                    {exam?.name}
                  </h1>
                  <h1 className="text-md text-gray-600">
                    Category: {exam.category}
                  </h1>
                  <h1 className="text-md text-gray-600">
                    Total Marks: {exam.totalMarks}
                  </h1>
                  <h1 className="text-md text-gray-600">
                    Passing Marks: {exam.passingMarks}
                  </h1>
                  <h1 className="text-md text-gray-600">
                    Duration: {formatDuration(exam.duration)}
                  </h1>
                  <button
                    className={`mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300 ${
                      hasTakenExam && "bg-slate-500 hover:bg-slate-600"
                    } `}
                    onClick={() => navigate(`/user/write-exam/${exam._id}`)}
                    disabled={hasTakenExam}
                  >
                    {hasTakenExam ? "Exam Taken" : "Start Exam"}
                  </button>
                </div>
              </Col>
            );
          })}
        </Row>
      </div>
    )
  );
}

export default Home;
