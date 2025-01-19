import { message } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getExamById } from "../../../apicalls/exams";
import { addReport, getAllReportsByUser } from "../../../apicalls/reports";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import Instructions from "./Instructions";

function WriteExam() {
  const [examData, setExamData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [result, setResult] = useState({});
  const [resultCalculated, setResultCalculated] = useState(false);
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [view, setView] = useState("instructions");
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [timeUp, setTimeUp] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [unfocusCount, setUnfocusCount] = useState(0);

  const { user } = useSelector((state) => state.users);

  const shuffleArray = (array) => {
    const shuffledArray = [];
    const usedIndices = new Set();

    while (shuffledArray.length < array.length) {
      const randomIndex = Math.floor(Math.random() * array.length);
      if (!usedIndices.has(randomIndex)) {
        shuffledArray.push(array[randomIndex]);
        usedIndices.add(randomIndex);
      }
    }

    return shuffledArray;
  };

  const getExamData = useCallback(async () => {
    try {
      dispatch(ShowLoading());
      const response = await getExamById({
        examId: params.id,
      });
      dispatch(HideLoading());
      if (response.success) {
        setQuestions(shuffleArray(response.data.questions));
        setExamData(response.data);
        setSecondsLeft(response.data.duration);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  }, [dispatch, params.id]);

  const calculateResult = useCallback(async () => {
    if (resultCalculated) return;
    setResultCalculated(true);

    try {
      let correctAnswers = [];
      let wrongAnswers = [];

      questions.forEach((question, index) => {
        if (question.correctOption === selectedOptions[index]) {
          correctAnswers.push(question);
        } else {
          wrongAnswers.push(question);
        }
      });

      let verdict = "Pass";
      if (correctAnswers.length < examData.passingMarks) {
        verdict = "Fail";
      }

      const tempResult = {
        correctAnswers,
        wrongAnswers,
        verdict,
      };
      setResult(tempResult);
      dispatch(ShowLoading());
      const response = await addReport({
        exam: params.id,
        result: tempResult,
        user: user._id,
      });
      dispatch(HideLoading());
      if (response.success) {
        setView("result");
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  }, [
    questions,
    selectedOptions,
    examData,
    params.id,
    user._id,
    dispatch,
    resultCalculated,
  ]);

  const startTimer = () => {
    let totalSeconds = examData.duration;
    const intervalId = setInterval(() => {
      if (totalSeconds > 0) {
        totalSeconds = totalSeconds - 1;
        setSecondsLeft(totalSeconds);
      } else {
        setTimeUp(true);
      }
    }, 1000);
    setIntervalId(intervalId);
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours < 1 ? "" : hours < 10 ? "0" + hours + ":" : hours}${
      minutes < 10 ? "0" + minutes : minutes
    }:${remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds}`;
  };

  useEffect(() => {
    if (timeUp && view === "questions") {
      clearInterval(intervalId);
      calculateResult();
    }
  }, [timeUp, intervalId, view, calculateResult]);

  useEffect(() => {
    async function getExamData() {
      const examHistory = await getAllReportsByUser(user._id);
      const exam = examHistory.data.map((item) => item.exam._id);
      if (exam.includes(params.id)) {
        navigate("/");
      }
    }
    getExamData();
  }, [navigate, params.id, user._id]);

  useEffect(() => {
    if (params.id) {
      getExamData();
    }
  }, [params.id, getExamData]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setUnfocusCount((prevCount) => {
          const newCount = prevCount + 1;
          if (newCount > 0 && newCount < 3) {
            message.warning(
              `Warning: You have unfocused the screen ${newCount} time(s). You have ${
                3 - newCount
              } unfocus(es) left.`
            );
          }
          if (newCount >= 3) {
            message.error(
              "You have unfocused the screen 3 times. The exam will be submitted automatically."
            );
            clearInterval(intervalId);
            calculateResult();
            setTimeUp(true);
          }
          return newCount;
        });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [intervalId, calculateResult]);

  if (!user) {
    return null;
  }

  return (
    examData && (
      <div className="mt-2 relative">
        <div className="divider"></div>
        <h1 className="text-center font-bold text-2xl ">{examData.name}</h1>

        <div className="divider"></div>

        {view === "instructions" && (
          <Instructions
            examData={examData}
            setView={setView}
            startTimer={startTimer}
          />
        )}

        {view === "questions" && questions.length > 0 && (
          <div className="flex flex-col gap-2 ">
            <div className="flex justify-between">
              <h1 className="text-2xl">
                {selectedQuestionIndex + 1} :{" "}
                {questions[selectedQuestionIndex]?.name}
              </h1>

              <div className="timer  ">
                <span className="text-xl ">{formatTime(secondsLeft)}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 ">
              {Object.keys(questions[selectedQuestionIndex]?.options || {}).map(
                (option, index) => {
                  return (
                    <div
                      className={`flex gap-2 flex-col ${
                        selectedOptions[selectedQuestionIndex] === option
                          ? "selected-option"
                          : "option"
                      }`}
                      key={crypto.randomUUID()}
                      onClick={() => {
                        setSelectedOptions({
                          ...selectedOptions,
                          [selectedQuestionIndex]: option,
                        });
                      }}
                    >
                      <h1 className="text-xl cursor-pointer">
                        {option} :{" "}
                        {questions[selectedQuestionIndex]?.options[option]}
                      </h1>
                    </div>
                  );
                }
              )}
            </div>

            <div className="flex justify-between">
              {selectedQuestionIndex > 0 && (
                <button
                  className="primary-outlined-btn"
                  onClick={() => {
                    setSelectedQuestionIndex(selectedQuestionIndex - 1);
                  }}
                >
                  Previous
                </button>
              )}

              {selectedQuestionIndex < questions.length - 1 && (
                <button
                  className="primary-contained-btn"
                  onClick={() => {
                    setSelectedQuestionIndex(selectedQuestionIndex + 1);
                  }}
                >
                  Next
                </button>
              )}
            </div>
            <div className="relative">
              <button
                className=" bg-red-500  text-white absolute right-0"
                onClick={() => {
                  const finishExam = window.confirm(
                    "Are you sure you want to finish the exam?"
                  );

                  function afterFinishExam() {
                    clearInterval(intervalId);
                    calculateResult();
                    setTimeUp(true);
                  }
                  if (finishExam) {
                    afterFinishExam();
                  }
                }}
              >
                Submit Exam
              </button>
            </div>
          </div>
        )}

        {view === "result" && (
          <div className="flex  items-center mt-2 justify-center result">
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl">RESULT</h1>
              <div className="divider"></div>
              <div className="marks">
                <h1 className="text-md">Total Marks : {examData.totalMarks}</h1>
                <h1 className="text-md">
                  Obtained Marks :{result.correctAnswers.length}
                </h1>
                <h1 className="text-md">
                  Wrong Answers : {result.wrongAnswers.length}
                </h1>
                <h1 className="text-md">
                  Passing Marks : {examData.passingMarks}
                </h1>
                <h1 className="text-md">VERDICT :{result.verdict}</h1>

                <div className="flex gap-2 mt-2">
                  <button
                    className="primary-contained-btn"
                    onClick={() => {
                      setView("review");
                    }}
                  >
                    Review Answers
                  </button>
                </div>
              </div>
            </div>
            <div className="lottie-animation">
              {result.verdict === "Pass" && (
                <lottie-player
                  src="https://assets2.lottiefiles.com/packages/lf20_ya4ycrti.json"
                  background="transparent"
                  speed="1"
                  loop
                  autoplay
                ></lottie-player>
              )}

              {result.verdict === "Fail" && (
                <lottie-player
                  src="https://assets4.lottiefiles.com/packages/lf20_qp1spzqv.json"
                  background="transparent"
                  speed="1"
                  loop
                  autoplay
                ></lottie-player>
              )}
            </div>
          </div>
        )}

        {view === "review" && (
          <div className="flex flex-col gap-2">
            {questions.map((question, index) => {
              const isCorrect =
                question.correctOption === selectedOptions[index];
              return (
                <div
                  className={`flex flex-col gap-1 p-2 ${
                    isCorrect ? "bg-success" : "bg-error"
                  }`}
                  key={crypto.randomUUID()}
                >
                  <h1 className="text-xl">
                    {index + 1} : {question.name}
                  </h1>
                  <h1 className="text-md">
                    Submitted Answer : {selectedOptions[index]} -{" "}
                    {question.options[selectedOptions[index]]}
                  </h1>
                  <h1 className="text-md">
                    Correct Answer : {question.correctOption} -{" "}
                    {question.options[question.correctOption]}
                  </h1>
                </div>
              );
            })}

            <div className="flex justify-center gap-2">
              <button
                className="primary-outlined-btn"
                onClick={() => {
                  navigate("/");
                }}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    )
  );
}

export default WriteExam;
