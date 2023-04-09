import React, { useState } from "react";
import Axios from "axios";
// import fileDownload from "js-file-download";
// import urllib.request;
import "./input.css";

function getFile(filename) {
  Axios({
    url: `http://localhost:5000/download/${filename}`, //your url
    method: "GET",
    responseType: "blob", // important
  }).then((response) => {
    // create file link in browser's memory
    const href = URL.createObjectURL(response.data);
    // console.log("response" + JSON.stringify(response.data));
    // console.log("href" + href);

    // create "a" HTML element with href to file & click
    const link = document.createElement("a");
    link.href = href;
    link.setAttribute("download", `${filename}.zip`); //or any other extension
    document.body.appendChild(link);
    link.click();

    // clean up "a" element & remove ObjectURL
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  });
}

function LoadingIndicator() {
  return (
    // <div
    //   className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
    //   role="status"
    // >
    //   <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
    //     Loading...
    //   </span>
    // </div>

    <div className="relative rounded-xl overflow-auto p-8">
      <div className="flex items-center justify-center">
        <button
          type="button"
          className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-blue-600 hover:bg-blue-400 transition ease-in-out duration-150 cursor-not-allowed"
          disabled=""
        >
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Processing...
        </button>
      </div>
    </div>
  );
}

function DownloadButton({ playlistID }) {
  return (
    <button
      className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
      onClick={(e) => {
        // e.preventDefault();
        // e.persist();
        getFile(playlistID);
      }}
    >
      <svg
        className="fill-current w-4 h-4 mr-2"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
      >
        <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
      </svg>
      <span>Download</span>
    </button>
  );
}

function App() {
  // const [data, setData] = useState([{}]);
  const [playlistID, setPlaylistID] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorResponse, setErrorResponse] = useState("");
  const [successResponse, setSuccessResponse] = useState("");

  function handleChange(event) {
    let link = event.target.value;
    let slicedLink = link.slice(link.indexOf("=") + 1, link.length);
    setPlaylistID(slicedLink);
  }

  async function convertFile(filename) {
    setIsLoading(true);
    setSuccessResponse(false);
    setErrorResponse("");
    await Axios({
      url: `http://localhost:5000/convert/${filename}`, //your url
      method: "GET",
    })
      .then((response) => {
        setIsLoading(false);
        setSuccessResponse(true);
      })
      .catch(function (error) {
        setIsLoading(false);
        setErrorResponse(error.response.data);
      });
  }

  return (
    <div className=" min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-sky-500 to-indigo-500">
      <h1 className="text-white font-bold text-4xl mb-10">
        YouTube Playlist to MP3 Converter
      </h1>{" "}
      <h1 className="text-white font-bold text-xl">
        Welcome! Please paste your playlist link in the box below to get
        started! {<br />}
      </h1>
      <h6 className="text-white text-xs">
        (Make sure the privacy status is set to either 'public' or 'unlisted'!)
      </h6>
      <div id="playlistID" className="flex flex-row md:w-2/3 my-10">
        <label className="rounded py-2 px-4 bg-blue-600 text-white font-bold">
          Link:
        </label>
        <input
          className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
          type="text"
          id="playlistID"
          name="playlistID"
          onChange={handleChange}
        />
        {!playlistID ? (
          <button className="bg-indigo-600 text-white font-bold py-2 px-4 rounded opacity-50 cursor-not-allowed">
            Convert
          </button>
        ) : (
          <button
            className="bg-indigo-600 hover:bg-indigo-800 text-white font-bold py-2 px-4 rounded"
            onClick={(e) => {
              convertFile(playlistID);
            }}
          >
            Convert
          </button>
        )}
      </div>
      <div className="">
        {isLoading && <LoadingIndicator />}
        {errorResponse && (
          <h3 className="text-white font-bold text-xl">
            {errorResponse}. Please try again with a valid link.
          </h3>
        )}
        {successResponse && (
          <div className="text-center">
            <h3 className="mb-5 text-white font-bold text-xl ">
              Your playlist has been successfully converted! Click the download
              button below for your files!
            </h3>
            <DownloadButton playlistID={playlistID} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
