import { Form, message } from "antd";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { loginUser } from "../../../apicalls/users";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";

function Login() {
  const dispatch = useDispatch();
  const [passwordVisible, setPasswordVisible] = useState(false);

  const onFinish = async (values) => {
    try {
      dispatch(ShowLoading());
      const response = await loginUser(values);
      dispatch(HideLoading());
      if (response.success) {
        message.success(response.message);
        localStorage.setItem("token", response.data);
        window.location.href = "/";
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
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
              QUIZ - LOGIN <i className="ri-login-circle-line"></i>
            </h1>
          </div>
          <div className="w-full border-b-2 border-gray-200 mb-4"></div>
          <Form layout="vertical" className="mt-4 w-full" onFinish={onFinish}>
            <Form.Item name="email" label="Email">
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
              />
            </Form.Item>
            <Form.Item name="password" label="Password">
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

            <div className="flex flex-col gap-4 mt-4">
              <button
                type="submit"
                className="w-full py-3 rounded-lg text-white bg-blue-600 md:hover:bg-blue-700 transition duration-300"
              >
                Login
              </button>
              <Link
                to="/register"
                className="text-center text-blue-600 md:hover:underline"
              >
                Not a member? Register
              </Link>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Login;
