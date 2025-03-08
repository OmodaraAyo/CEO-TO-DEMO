"use client";
import { useEffect, useState } from "react";
import "./App.css";
import { FetchApi } from "./api/FetchApi";
import { IoCloseSharp } from "react-icons/io5";
import { GrDocumentDownload } from "react-icons/gr";
import { motion } from "motion/react";
import { lineSpinner } from "ldrs";
lineSpinner.register();

function App() {
  const [inputText, setInputText] = useState("");
  const [response, setResponse] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedResponse = localStorage.getItem("response");
    if (savedResponse) {
      setResponse(JSON.parse(savedResponse));
    }
  }, []);

  useEffect(() => {
    if (response) {
      localStorage.setItem("response", JSON.stringify(response));
    } else {
      localStorage.removeItem("response");
    }
  }, [response]);

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
      setIsLoading(true);
      const result = await FetchApi(payload);
      setResponse(result);
      setInputText("");
    } catch (err) {
      alert(err.message);
      setResponse(null);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadResponseAsTextFile =  (data) => {
    const textContent = data.map((item) => `${item.ceoName}\n${item.actualInput}\n\n`).join("");
    
    const blob = new Blob([textContent], {type: 'text/plain'});
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "cto-to-demo.txt";
    link.click();
    
    URL.revokeObjectURL(link.href);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }
  return (
    <section className="flex flex-col justify-center w-full h-svh">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-5 container mx-auto w-full justify-center px-13 py-3 sm:px-2">
          <label htmlFor="dataInput"></label>
          <textarea
            id="dataInput"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            className="border-2 rounded-full px-7 pt-5 pb-0.5 resize-none outline-none overflow-y-scroll no-scrollbar transform transition-all duration-300 ease-in-out"
            placeholder="Paste your data here"
          ></textarea>
          <button
            type="submit"
            disabled={!inputText.trim()}
            className={`border rounded-full w-full max-w-52 flex place-self-center justify-center cursor-pointer py-1.5 overflow-hidden transform transition-all duration-300 ease-in-out ${
              inputText.trim()
                ? "bg-green-800 border-green-800 text-white hover:bg-green-950"
                : "bg-gray-300 text-gray-500 cursor-not-allowed border-gray-300"
            }`}
          >
            Submit
          </button>
        </div>
      </form>

      {isLoading && (
        <motion.div
          transition={{ duration: 0.2, ease: "linear" }}
          className="fixed bg-amber-100 w-full h-full overflow-hidden flex items-center justify-center"
        >
          <l-line-spinner
            size="100"
            stroke="3"
            speed="1"
            color="black"
            className="cursor-pointer"
            key="loading"
          ></l-line-spinner>
        </motion.div>
      )}

      {response.length > 0 && (
        <motion.div
          transition={{ duration: 0.2 }}
          className="fixed w-full h-full bg-amber-100 rounded p-8 flex flex-col gap-3.5 mx-auto"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-green-800 font-bold text-xl">Response:</h3>
            <IoCloseSharp
              className="cursor-pointer transform scale-105 text-green-800 drop-shadow-lg hover:text-red-500 active:text-green-950"
              size={32}
              onClick={() => setResponse([])}
            />
          </div>
          <div className="overflow-y-auto bg-amber-100 rounded-lg scrollbar-custom h-[calc(100vh-220px)]">
            {response.map((item, index) => (
              <div key={index} className="mb-4">
                <pre className="text-green-950 mb-4 whitespace-pre-wrap break-words p-3 flex flex-col">
                  <p>{item.ceoName}</p>
                  <p>{item.actualInput}</p>
                  {/* {JSON.stringify(response, null, 2)} */}
                </pre>
              </div>
            ))}
          </div>
          <button
            onClick={() => downloadResponseAsTextFile(response)}
            className={`border rounded-full w-full h-9 max-w-44 flex place-self-center justify-center items-center gap-2 italic font-semibold cursor-pointer py-1 overflow-hidden hover:border-green-800 hover:text-white hover:bg-green-800 active:border-green-950 active:text-gray-400 transform transition-all duration-300 ease-in-out`}
          >
            <GrDocumentDownload />
            <p>Download...</p>
          </button>
        </motion.div>
      )}
    </section>
  );
}

export default App;
