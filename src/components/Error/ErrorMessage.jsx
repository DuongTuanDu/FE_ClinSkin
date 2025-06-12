import React from "react";
import { MdError } from "react-icons/md";

const ErrorMessage = ({ message = "" }) => {
  return (
    <div className="text-red-500 font-medium text-sm py-1 flex gap-1 items-center">
      {message && (
        <>
          <MdError />
          <span> {message}</span>
        </>
      )}
    </div>
  );
};

export default ErrorMessage;
