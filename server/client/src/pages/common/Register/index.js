import { Form, message } from "antd";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../../apicalls/users";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [passwordVisible, setPasswordVisible] = useState(false);

  const onFinish = async (values) => {
    try {
      dispatch(ShowLoading());
      const response = await registerUser(values);

      dispatch(HideLoading());
      if (response.success) {
        message.success(response.message);
        navigate("/login");
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="flex justify-center items-center h-screen w-screen relative">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://static.vecteezy.com/system/resources/previews/006/691/884/large_2x/blue-question-mark-background-with-text-space-quiz-symbol-vector.jpg')",
        }}
      ></div>
      <div className="relative w-96 p-8 bg-white rounded-lg shadow-lg">
        <div className="flex flex-col items-center">
          <div className="flex mb-4">
            <h1 className="text-3xl font-bold text-gray-800">
              QUIZ - REGISTER <i className="ri-user-add-line"></i>
            </h1>
          </div>
          <div className="w-full border-b-2 border-gray-200 mb-4"></div>
          <Form layout="vertical" className="mt-4 w-full" onFinish={onFinish}>
            <Form.Item name="name" label="Name">
              <input
                type="text"
                name="name"
                value={formValues.name}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
              />
            </Form.Item>
            <Form.Item name="email" label="Email">
              <input
                type="text"
                name="email"
                value={formValues.email}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
              />
            </Form.Item>
            <Form.Item name="password" label="Password">
              <div className="relative">
                <input
                  type={passwordVisible ? "text" : "password"}
                  name="password"
                  value={formValues.password}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                />
                <i
                  className={`absolute right-3 top-2 cursor-pointer ${
                    passwordVisible ? "ri-eye-off-line" : "ri-eye-line"
                  }`}
                  onClick={togglePasswordVisibility}
                ></i>
              </div>
            </Form.Item>

            <div className="flex flex-col gap-4 mt-4">
              <button
                type="submit"
                className="w-full py-3 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition duration-300"
              >
                Register
              </button>
              <Link
                to="/login"
                className="text-center text-blue-600 hover:underline"
              >
                Already a member? Login
              </Link>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Register;
