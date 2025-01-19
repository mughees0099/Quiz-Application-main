import { Col, message, Row } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllExams, verifyExamPassword } from "../../../apicalls/exams";
import { getAllReportsByUser } from "../../../apicalls/reports";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import PageTitle from "../../../components/PageTitle";
import { useNavigate } from "react-router-dom";
import PasswordModal from "./PasswordInput";
function Home() {
  const [exams, setExams] = useState([]);
  const [examHistory, setExamHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [password, setPassword] = useState("");
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
    const fetchData = async () => {
      await getExams();
      await getExamHistory();
      setLoading(false);
    };
    fetchData();
  }, []);

  const handlePasswordCheck = async () => {
    try {
      dispatch(ShowLoading());
      const response = await verifyExamPassword({
        examId: selectedExam._id,
        password,
      });
      dispatch(HideLoading());

      if (response.success) {
        message.success(response.message);
        navigate(`/user/write-exam/${selectedExam._id}`);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const handleTakeExam = (exam) => {
    setSelectedExam(exam);
    setPasswordModalVisible(true);
  };

  const handleModalOk = () => {
    handlePasswordCheck();
    setPasswordModalVisible(false);
    setPassword("");
  };

  const handleModalCancel = () => {
    setPasswordModalVisible(false);
    setPassword("");
  };

  return (
    user && (
      <div className="container mx-auto w-full p-4">
        <PageTitle title={`Hi ${user.name}`} />
        <div className="border-b-2 border-gray-200 my-4"></div>
        <Row gutter={[16, 16]}>
          {exams.map((exam) => {
            const hasTakenExam = examHistory.some(
              (examT) => examT.exam && examT.exam._id === exam._id
            );

            return (
              <Col xs={20} md={12} xl={7} key={exam._id}>
                <div className="bg-white shadow-2xl shadow-black/70 rounded-lg p-6 flex flex-col gap-1 transition-transform transform md:hover:scale-[1.02] h-72">
                  <h1 className="text-2xl font-semibold text-gray-800 truncate">
                    {exam?.name}
                  </h1>
                  <h1 className="text-md text-gray-600">
                    Category: {exam?.category}
                  </h1>
                  <h1 className="text-md text-gray-600">
                    Total Marks: {exam?.totalMarks}
                  </h1>
                  <h1 className="text-md text-gray-600">
                    Passing Marks: {exam?.passingMarks}
                  </h1>
                  <h1 className="text-md text-gray-600">
                    Duration: {formatDuration(exam?.duration)}
                  </h1>

                  <button
                    className={`mt-4 py-2 px-4 rounded transition duration-300 ${
                      loading
                        ? "bg-white text-gray-500 cursor-not-allowed"
                        : hasTakenExam
                        ? "bg-slate-500 text-white hover:bg-slate-600"
                        : "bg-blue-500 text-white hover:bg-blue-600"
                    }`}
                    onClick={() => handleTakeExam(exam)}
                    disabled={loading || hasTakenExam}
                  >
                    {loading ? (
                      <span className="loader"></span>
                    ) : hasTakenExam ? (
                      "Already Taken"
                    ) : (
                      "Take Exam"
                    )}
                  </button>
                </div>
              </Col>
            );
          })}
        </Row>

        <PasswordModal
          visible={passwordModalVisible}
          onOk={handleModalOk}
          onCancel={handleModalCancel}
          password={password}
          setPassword={setPassword}
        />
      </div>
    )
  );
}

export default Home;
