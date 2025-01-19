import { Col, Form, message, Row, Table, Tabs } from "antd";
import React, { useEffect, useState } from "react";
import {
  addExam,
  deleteQuestionById,
  editExamById,
  getExamById,
} from "../../../apicalls/exams";
import PageTitle from "../../../components/PageTitle";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import AddEditQuestion from "./AddEditQuestion";
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";

function AddEditExam() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [examData, setExamData] = useState(null);
  const [showAddEditQuestionModal, setShowAddEditQuestionModal] =
    useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const params = useParams();

  const onFinish = async (values) => {
    try {
      dispatch(ShowLoading());
      let response;

      if (params.id) {
        const { duration } = values;
        values.duration = duration * 60;

        response = await editExamById({
          examId: params.id,
          ...values,
        });
      } else {
        const { duration } = values;
        values.duration = duration * 60;

        response = await addExam(values);
      }
      if (response.success) {
        message.success(response.message);
        navigate("/admin/exams");
      } else {
        message.error(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const getExamData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await getExamById({
        examId: params.id,
      });
      dispatch(HideLoading());
      if (response.success) {
        const { duration } = response.data;
        response.data.duration = Math.round(duration / 60);
        setExamData(response.data);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  useEffect(() => {
    if (params.id) {
      getExamData();
    }
  }, []);

  const deleteQuestion = async (questionId) => {
    try {
      dispatch(ShowLoading());
      const response = await deleteQuestionById({
        questionId,
        examId: params.id,
      });
      dispatch(HideLoading());
      if (response.success) {
        message.success(response.message);
        getExamData();
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const questionsColumns = [
    {
      title: "Question",
      dataIndex: "name",
    },
    {
      title: "Options",
      dataIndex: "options",
      render: (text, record) => {
        return Object.keys(record.options).map((key) => {
          return (
            <div key={key}>
              {key} : {record.options[key]}
            </div>
          );
        });
      },
    },
    {
      title: "Correct Option",
      dataIndex: "correctOption",
      render: (text, record) => {
        return ` ${record.correctOption} : ${
          record.options[record.correctOption]
        }`;
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => (
        <div className="flex gap-2">
          <i
            className="ri-pencil-line text-blue-500 cursor-pointer"
            onClick={() => {
              setSelectedQuestion(record);
              setShowAddEditQuestionModal(true);
            }}
          ></i>
          <i
            className="ri-delete-bin-line text-red-500 cursor-pointer"
            onClick={() => {
              deleteQuestion(record._id);
            }}
          ></i>
        </div>
      ),
    },
  ];

  const tabItems = [
    {
      key: "1",
      label: "Exam Details",
      children: (
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Form.Item label="Exam Name" name="name">
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Exam Duration" name="duration">
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Category" name="category">
              <select className="w-full p-2 border border-gray-300 rounded">
                <option value="">Select Category</option>
                <option value="Javascript">Javascript</option>
                <option value="React">React</option>
                <option value="Node">Node</option>
                <option value="MongoDB">MongoDB</option>
                <option value="PMP">PMP</option>
              </select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Total Marks" name="totalMarks">
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Passing Marks" name="passingMarks">
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            {!params.id && (
              <Form.Item name="examPassword" label="Exam Password">
                <div className="relative">
                  <input
                    type={passwordVisible ? "text" : "password"}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                  />
                  <div
                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                  >
                    {passwordVisible ? (
                      <RiEyeOffLine className="text-gray-500" />
                    ) : (
                      <RiEyeLine className="text-gray-500" />
                    )}
                  </div>
                </div>
              </Form.Item>
            )}
          </Col>
        </Row>
      ),
    },
    params.id && {
      key: "2",
      label: "Questions",
      children: (
        <>
          <div className="flex justify-end mb-4">
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded md:hover:bg-blue-600 transition duration-300"
              type="button"
              onClick={() => setShowAddEditQuestionModal(true)}
            >
              Add Question
            </button>
          </div>
          <Table
            columns={questionsColumns}
            dataSource={examData?.questions || []}
            pagination={false}
            className="custom-table"
          />
        </>
      ),
    },
  ].filter(Boolean);

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <PageTitle title={params.id ? "Edit Exam" : "Add Exam"} />
      <div className="border-b-2 border-gray-200 mb-4"></div>

      {(examData || !params.id) && (
        <Form layout="vertical" onFinish={onFinish} initialValues={examData}>
          <Tabs defaultActiveKey="1" items={tabItems} />
          <div className="flex justify-end gap-2 mt-4">
            <button
              className="bg-gray-500 text-white py-2 px-4 rounded md:hover:bg-gray-600 transition duration-300"
              type="button"
              onClick={() => navigate("/admin/exams")}
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
      )}

      {showAddEditQuestionModal && (
        <AddEditQuestion
          setShowAddEditQuestionModal={setShowAddEditQuestionModal}
          showAddEditQuestionModal={showAddEditQuestionModal}
          examId={params.id}
          refreshData={getExamData}
          selectedQuestion={selectedQuestion}
          setSelectedQuestion={setSelectedQuestion}
        />
      )}
    </div>
  );
}

export default AddEditExam;
