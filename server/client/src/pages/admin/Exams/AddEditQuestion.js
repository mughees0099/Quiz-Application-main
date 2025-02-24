import { Form, message, Modal, Upload, Button } from "antd";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addQuestionToExam, editQuestionById } from "../../../apicalls/exams";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import { UploadOutlined } from "@ant-design/icons";
import mammoth from "mammoth";

function AddEditQuestion({
  showAddEditQuestionModal,
  setShowAddEditQuestionModal,
  refreshData,
  examId,
  selectedQuestion,
  setSelectedQuestion,
}) {
  const dispatch = useDispatch();
  const [formValues, setFormValues] = useState({
    name: "",
    correctOption: "",
    A: "",
    B: "",
    C: "",
    D: "",
  });

  useEffect(() => {
    if (selectedQuestion) {
      setFormValues({
        name: selectedQuestion.name || "",
        correctOption: selectedQuestion.correctOption || "",
        A: selectedQuestion.options?.A || "",
        B: selectedQuestion.options?.B || "",
        C: selectedQuestion.options?.C || "",
        D: selectedQuestion.options?.D || "",
      });
    } else {
      setFormValues({
        name: "",
        correctOption: "",
        A: "",
        B: "",
        C: "",
        D: "",
      });
    }
  }, [selectedQuestion]);

  const onFinish = async (values) => {
    try {
      dispatch(ShowLoading());
      const requiredPayload = {
        name: values.name,
        correctOption: values.correctOption,
        options: {
          A: values.A,
          B: values.B,
          C: values.C,
          D: values.D,
        },
        exam: examId,
      };

      let response;
      if (selectedQuestion) {
        response = await editQuestionById({
          ...requiredPayload,
          questionId: selectedQuestion._id,
        });
      } else {
        response = await addQuestionToExam(requiredPayload);
      }
      if (response.success) {
        message.success(response.message);
        refreshData();
        setShowAddEditQuestionModal(false);
      } else {
        message.error(response.message);
      }
      setSelectedQuestion(null);
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleFileUpload = async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      const questions = parseQuestions(result.value);
      await saveQuestions(questions);
      message.success("Questions uploaded successfully");
      refreshData();
      setShowAddEditQuestionModal(false);
    } catch (error) {
      message.error("Failed to upload questions");
    }
  };

  const parseQuestions = (text) => {
    const questions = [];
    const lines = text.split("\n").filter((line) => line.trim() !== "");

    for (let i = 0; i < lines.length; i++) {
      let name = lines[i].trim();
      const correctOption = lines[i + 1]?.trim();
      const optionA = lines[i + 2]?.trim();
      const optionB = lines[i + 3]?.trim();
      const optionC = lines[i + 4]?.trim();
      const optionD = lines[i + 5]?.trim();

      if (
        !name ||
        !correctOption ||
        !optionA ||
        !optionB ||
        !optionC ||
        !optionD
      ) {
        continue; // Skip this set if any line is missing
      }

      const A = optionA.split(") ")[1];
      const B = optionB.split(") ")[1];
      const C = optionC.split(") ")[1];
      const D = optionD.split(") ")[1];

      if (!A || !B || !C || !D) {
        continue; // Skip this set if any option is missing
      }

      questions.push({
        name,
        correctOption,
        options: { A, B, C, D },
      });

      i += 5; // Move to the next question set
    }

    return questions;
  };

  const saveQuestions = async (questions) => {
    dispatch(ShowLoading());
    for (const question of questions) {
      await addQuestionToExam({ ...question, exam: examId });
    }
    dispatch(HideLoading());
  };

  return (
    <Modal
      title={selectedQuestion ? "Edit Question" : "Add Question"}
      open={showAddEditQuestionModal}
      footer={null}
      onCancel={() => {
        setShowAddEditQuestionModal(false);
        setSelectedQuestion(null);
      }}
      className="rounded-lg shadow-lg"
    >
      <Form
        onFinish={onFinish}
        layout="vertical"
        initialValues={formValues}
        className="space-y-4"
      >
        <Form.Item name="name" label="Question" className="font-semibold">
          <input
            required
            type="text"
            name="name"
            value={formValues.name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </Form.Item>

        <Form.Item
          name="correctOption"
          label="Correct Option"
          className="font-semibold"
        >
          <input
            required
            type="text"
            name="correctOption"
            value={formValues.correctOption}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </Form.Item>

        <div className="flex gap-3">
          <Form.Item name="A" label="Option A" className="flex-1 font-semibold">
            <input
              required
              type="text"
              name="A"
              value={formValues.A}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </Form.Item>
          <Form.Item name="B" label="Option B" className="flex-1 font-semibold">
            <input
              required
              type="text"
              name="B"
              value={formValues.B}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </Form.Item>
        </div>
        <div className="flex gap-3">
          <Form.Item name="C" label="Option C" className="flex-1 font-semibold">
            <input
              required
              type="text"
              name="C"
              value={formValues.C}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </Form.Item>
          <Form.Item name="D" label="Option D" className="flex-1 font-semibold">
            <input
              required
              type="text"
              name="D"
              value={formValues.D}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </Form.Item>
        </div>

        <div className="flex justify-end mt-4 gap-3">
          <button
            className="bg-gray-500 text-white py-2 px-4 rounded md:hover:bg-gray-600 transition duration-300"
            type="button"
            onClick={() => setShowAddEditQuestionModal(false)}
          >
            Cancel
          </button>
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded md:hover:bg-blue-600 transition duration-300"
            type="submit"
          >
            Save
          </button>
        </div>
      </Form>

      <div className="mt-4">
        <div>
          <h1 className="flex-1 font-semibold">
            Format of questions should be:{" "}
          </h1>
          Which company developed JavaScript? <br />
          B <br />
          A) Microsoft <br />
          B) Netscape <br />
          C) Sun Microsystems <br />
          D) Oracle <br />
        </div>

        <Upload
          accept=".docx"
          showUploadList={false}
          beforeUpload={(file) => {
            handleFileUpload(file);
            return false;
          }}
        >
          <Button icon={<UploadOutlined />}>Upload Questions from DOCX</Button>
        </Upload>
      </div>
    </Modal>
  );
}

export default AddEditQuestion;
