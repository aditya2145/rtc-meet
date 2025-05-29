import React from 'react';

const Confirmation = ({ handleNo, handleYes, confirmationType }) => {
  const handleClick = () => {
    handleYes();
    handleNo(false);
  }

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center px-4">
      <div className="bg-gray-900 rounded-xl shadow-xl max-w-sm w-full p-8 text-center">
        <h3 className="text-2xl font-semibold text-white mb-4">
          {confirmationType.charAt(0).toUpperCase() + confirmationType.slice(1)}?
        </h3>
        <p className="text-gray-400 mb-8 text-sm">
          Are you sure you want to <span className="font-medium text-indigo-400">{confirmationType}</span>?
        </p>
        <div className="flex justify-center gap-6">
          <button
            onClick={handleClick}
            className="bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200 text-white font-semibold py-2 px-8 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Yes
          </button>
          <button
            onClick={() => handleNo(false)}
            className="bg-gray-700 hover:bg-gray-600 transition-colors duration-200 text-gray-300 font-semibold py-2 px-8 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;

