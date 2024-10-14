// import React from "react";
// import PageTitle from "../../../components/PageTitle";
// import { message, Table } from "antd";
// import { useDispatch } from "react-redux";
// import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
// import { getAllReports } from "../../../apicalls/reports";
// import { useEffect } from "react";
// import moment from "moment";

// function AdminReports() {
//   const [reportsData, setReportsData] = React.useState([]);
//   const dispatch = useDispatch();
//   const [filters, setFilters] = React.useState({
//     examName: "",
//     userName: "",
//   });
//   const columns = [
//     {
//       title: "Exam Name",
//       dataIndex: "examName",
//       render: (text, record) => <>{record.exam.name}</>,
//     },
//     {
//       title: "User Name",
//       dataIndex: "userName",
//       render: (text, record) => <>{record.user.name}</>,
//     },
//     {
//       title: "Date",
//       dataIndex: "date",
//       render: (text, record) => (
//         <>{moment(record.createdAt).format("DD-MM-YYYY hh:mm:ss")}</>
//       ),
//     },
//     {
//       title: "Total Marks",
//       dataIndex: "totalQuestions",
//       render: (text, record) => <>{record.exam.totalMarks}</>,
//     },
//     {
//       title: "Passing Marks",
//       dataIndex: "correctAnswers",
//       render: (text, record) => <>{record.exam.passingMarks}</>,
//     },
//     {
//       title: "Obtained Marks",
//       dataIndex: "correctAnswers",
//       render: (text, record) => <>{record.result.correctAnswers.length}</>,
//     },
//     {
//       title: "Verdict",
//       dataIndex: "verdict",
//       render: (text, record) => <>{record.result.verdict}</>,
//     },
//   ];

//   const getData = async (tempFilters) => {
//     try {
//       dispatch(ShowLoading());
//       const response = await getAllReports(tempFilters);
//       if (response.success) {
//         setReportsData(response.data);
//       } else {
//         message.error(response.message);
//       }
//       dispatch(HideLoading());
//     } catch (error) {
//       dispatch(HideLoading());
//       message.error(error.message);
//     }
//   };

//   useEffect(() => {
//     getData(filters);
//   }, []);

//   return (
//     <div>
//       <PageTitle title="Reports" />
//       <div className="divider"></div>
//       <div className="flex gap-2">
//         <input
//           type="text"
//           placeholder="Exam"
//           value={filters.examName}
//           onChange={(e) => setFilters({ ...filters, examName: e.target.value })}
//         />
//         <input
//           type="text"
//           placeholder="User"
//           value={filters.userName}
//           onChange={(e) => setFilters({ ...filters, userName: e.target.value })}
//         />
//         <button
//           className="primary-outlined-btn"
//           onClick={() => {
//             setFilters({
//               examName: "",
//               userName: "",
//             });
//             getData({
//               examName: "",
//               userName: "",
//             });
//           }}
//         >
//           Clear
//         </button>
//         <button className="primary-contained-btn" onClick={() => getData(filters)}>
//           Search
//         </button>
//       </div>
//       <Table columns={columns} dataSource={reportsData} className="mt-2" />
//     </div>
//   );
// }

// export default AdminReports;

import React, { useState } from "react";
import PageTitle from "../../../components/PageTitle";
import { message, Table } from "antd";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import { getAllReports } from "../../../apicalls/reports";
import { useEffect } from "react";
import moment from "moment";

function AdminReports() {
  const [reportsData, setReportsData] = useState([]);
  const dispatch = useDispatch();
  const [filters, setFilters] = useState({
    examName: "",
    userName: "",
  });

  const columns = [
    {
      title: "Exam Name",
      dataIndex: "examName",
      render: (text, record) => <>{record.exam.name}</>,
    },
    {
      title: "User Name",
      dataIndex: "userName",
      render: (text, record) => <>{record.user.name}</>,
    },
    {
      title: "Date",
      dataIndex: "date",
      render: (text, record) => (
        <>{moment(record.createdAt).format("DD-MM-YYYY hh:mm:ss")}</>
      ),
    },
    {
      title: "Total Marks",
      dataIndex: "totalQuestions",
      render: (text, record) => <>{record.exam.totalMarks}</>,
    },
    {
      title: "Passing Marks",
      dataIndex: "correctAnswers",
      render: (text, record) => <>{record.exam.passingMarks}</>,
    },
    {
      title: "Obtained Marks",
      dataIndex: "correctAnswers",
      render: (text, record) => <>{record.result.correctAnswers.length}</>,
    },
    {
      title: "Status",
      dataIndex: "verdict",
      render: (text, record) => <>{record.result.verdict}</>,
    },
  ];

  const getData = async (tempFilters) => {
    try {
      dispatch(ShowLoading());
      const response = await getAllReports(tempFilters);
      if (response.success) {
        setReportsData(response.data);
      } else {
        message.error(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  useEffect(() => {
    getData(filters);
  }, []);

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <PageTitle title="Reports" />
      <div className="border-b-2 border-gray-200 mb-4"></div>
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Exam"
          value={filters.examName}
          onChange={(e) => setFilters({ ...filters, examName: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="User"
          value={filters.userName}
          onChange={(e) => setFilters({ ...filters, userName: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition duration-300"
          onClick={() => {
            setFilters({
              examName: "",
              userName: "",
            });
            getData({
              examName: "",
              userName: "",
            });
          }}
        >
          Clear
        </button>
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
          onClick={() => getData(filters)}
        >
          Search
        </button>
      </div>
      <Table columns={columns} dataSource={reportsData} className="mt-4" />
    </div>
  );
}

export default AdminReports;
