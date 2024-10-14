import React from "react";
import { useNavigate } from "react-router-dom";
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

function Instructions({ examData, setView, startTimer }) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center gap-5">
      <ul className="flex flex-col gap-1">
        <h1 className="text-2xl underline">Instructions</h1>
        <li>Exam must be completed in {formatDuration(examData.duration)}</li>
        <li>
          Exam will be submitted automatically after{" "}
          {formatDuration(examData.duration)}
        </li>
        <li>Once submitted, you cannot change your answers.</li>
        <li>Do not refresh the page.</li>
        <li>
          Do not switch to <span className="font-bold">another tab </span> or
          <span className="font-bold"> window</span> , as this will
          automatically submit the exam.
        </li>
        <li>
          You can use the <span className="font-bold">"Previous"</span> and
          <span className="font-bold">"Next"</span> buttons to navigate between
          questions.
        </li>
        <li>
          Total marks of the exam is{" "}
          <span className="font-bold">{examData.totalMarks}</span>.
        </li>
        <li>
          Passing marks of the exam is{" "}
          <span className="font-bold">{examData.passingMarks}</span>.
        </li>
      </ul>

      <div className="flex gap-2">
        <button className="primary-outlined-btn" onClick={() => navigate("/")}>
          CLOSE
        </button>
        <button
          className="primary-contained-btn"
          onClick={() => {
            startTimer();
            setView("questions");
          }}
        >
          Start Exam
        </button>
      </div>
    </div>
  );
}

export default Instructions;
