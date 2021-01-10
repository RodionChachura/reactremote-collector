import React, { useEffect, useState } from "react";
import { getCurrentTabId, getCurrentTabUrl } from "src/chrome/utils";
import { MessageToContent, MessageToContentType } from "src/types";

const containerStyle = {
  backgroundColor: "#121212",
  minWidth: 400,
};

type JobState = {
  date: string;
  reactNative: boolean;
  backendTechnologies: string;
  position: string;
  companyName: string;
  url: string;
};

const DEFAULT_JOB_STATE = {
  date: "",
  reactNative: false,
  backendTechnologies: "",
  position: "",
  companyName: "",
  url: "",
};

const JobForm = () => {
  const [job, setJob] = useState<JobState>(DEFAULT_JOB_STATE);

  useEffect(() => {
    getCurrentTabUrl((url = "") => {
      setJob((state) => ({ ...state, url }));
    });
  }, []);

  useEffect(() => {
    const message: MessageToContent = {
      type: MessageToContentType.GetJobInfo,
    };

    getCurrentTabId((id = 0) => {
      console.log('Tab id: ', id)
      chrome.tabs.sendMessage(id, message, (response) => {
        console.log('Response: ', response);
      });
    });
  });

  console.log(job);

  return (
    <div
      style={containerStyle}
      className="container flex flex-col space-y-10 p-2"
    >
      Job Form Will Be Here
    </div>
  );
};

export default JobForm;
