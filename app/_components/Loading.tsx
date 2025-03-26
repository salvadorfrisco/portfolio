import React from "react";
const Loading: React.FC = () => {
  return (
    <div className="mb flex h-screen items-center justify-center">
      <span className="loading loading-ring loading-xs"></span>
      <span className="loading loading-ring loading-sm"></span>
      <span className="loading loading-ring loading-md"></span>
      <span className="loading loading-ring loading-lg"></span>
    </div>
  );
};

export default Loading;
