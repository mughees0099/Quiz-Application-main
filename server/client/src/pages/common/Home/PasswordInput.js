import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import React, { useRef, useEffect, useState, forwardRef } from "react";
import { Modal, Button } from "antd";

const PasswordInput = forwardRef(({ value, onChange, placeholder }, ref) => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="relative">
      <input
        ref={ref}
        type={passwordVisible ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
      />
      <div
        className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
        onClick={togglePasswordVisibility}
      >
        {passwordVisible ? (
          <RiEyeOffLine className="text-gray-500" />
        ) : (
          <RiEyeLine className="text-gray-500" />
        )}
      </div>
    </div>
  );
});

const PasswordModal = ({ visible, onOk, onCancel, password, setPassword }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    if (visible) {
      inputRef.current.focus();
    }
  }, [visible]);

  return (
    <Modal
      title="Enter Password"
      open={visible}
      onOk={onOk}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={onOk}>
          Submit
        </Button>,
      ]}
    >
      <p className="text-sm text-gray-500 mt-1">Ask your admin for password</p>
      <PasswordInput
        ref={inputRef}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
    </Modal>
  );
};

export default PasswordModal;
