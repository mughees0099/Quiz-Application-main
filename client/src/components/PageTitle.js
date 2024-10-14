import React from "react";

function PageTitle({ title }) {
  return (
    <div className="mt-8 mb-4">
      <h1 className="text-4xl font-bold text-gray-800">{title}</h1>
      {/* <div className="h-1 bg-blue-500 w-full mt-2 "></div> */}
    </div>
  );
}

export default PageTitle;
