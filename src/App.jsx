"use client";
import { useState } from "react";
import "./App.css";
import { dataApi } from "./api/dataAPI.JSX";

function App() {
  const [inputText, setInputText] = useState("");
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const normalizedInput = inputText.replace(/[\n;]/g, ",");

    const domainSuffixRegex = /\.[a-zA-Z]{2, }(?=\s|$)/g;
    const processedInput = normalizedInput.replace(domainSuffixRegex, "$&,");

    const dataQuery = processedInput
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    const payload = { dataQuery };

    try {
      const result = await dataApi(payload);
      setResponse(result);
      setError(null);
    } catch (err) {
      setError(err.message);
      setResponse(null);
    }
  };

  return (
    <section className="flex flex-col justify-center w-full h-screen">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-5 container mx-auto w-full justify-center px-2 py-3">
          <label htmlFor="dataInput"></label>
          <textarea
            id="dataInput"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="border-2 rounded-full px-7 resize-none outline-none flex"
            placeholder="Paste your data here"
          ></textarea>
          <button type="submit" disabled={!inputText.trim()} className={`border rounded-full w-full max-w-52 flex place-self-center justify-center cursor-pointer py-1.5 ${inputText.trim()? 'bg-blue-600 border-blue-600 text-white hover:bg-blue-700': 'bg-gray-300 text-gray-500 cursor-not-allowed border-gray-300'}`}>
            Submit
          </button>
        </div>
      </form>

      {response && (
        <div className="mt-4 p-4 bg-green-100 rounded">
          <h3 className="text-green-800 font-bold">Response:</h3>
          <pre className="text-green-800">{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
      {error && (
        <div className="mt-4 p-4 bg-red-100 rounded">
          <h3 className="text-red-800 font-bold">Error:</h3>
          <p className="text-red-800">{error}</p>
        </div>
      )}
    </section>
  );
}

export default App;
