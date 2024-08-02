// MysteryForm.js
import React, { useState, useRef, useEffect } from 'react';

const MysteryForm = ({ onSubmit, onChange, code, error, isLoading }) => {
  const fieldRef = useRef(null);

  // Function to remove elements with specific classes
  const removeElements = () => {
    const elementsToRemove = [
      ...document.querySelectorAll('.ytp-chrome-top'),
      ...document.querySelectorAll('.ytp-watermark'),
    ];
    elementsToRemove.forEach((element) => {
      if (element) element.remove();
    });
  };

  // Effect to handle the removal after form submission
  useEffect(() => {
    let intervalId;
    const handleFormSubmit = (e) => {
      e.preventDefault();
      onSubmit(e);
      // Start checking for elements to remove after form submission
      intervalId = setInterval(() => {
        removeElements();
      }, 100);
    };

    // Clean up the interval if the component is unmounted or submission is complete
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [onSubmit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <form
      className="flex flex-col gap-y-8 container relative items-center justify-center max-w-md animate-fade-slow"
      autoComplete="off"
      spellCheck="false"
      onSubmit={handleSubmit}
    >
      <h1 className="text-white font-mono text-6xl">△</h1>
      <div className="font-mono uppercase flex gap-x-2 items-end mx-auto">
        <input
          ref={fieldRef}
          name="code"
          type="text"
          className={`flex-grow rounded text-lg py-1 px-2 border border-white bg-black text-white ${error ? 'animate-error' : ''}`}
          value={code}
          onChange={onChange}
        />
        <input
          name="submit"
          type="submit"
          className="rounded-lg px-2 py-[0.35rem] text-white border-2 border-white bg-black hover:bg-gray-200 hover:text-black active:bg-gray-300 cursor-pointer text-transparent disabled:cursor-default disabled:bg-gray-800 transition-all duration-150"
          value="SUBMIT"
          disabled={isLoading}
        />
      </div>
    </form>
  );
};

export default MysteryForm;
