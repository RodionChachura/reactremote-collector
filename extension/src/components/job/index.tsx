import React, { useEffect, useState } from "react";

const containerStyle = {
  backgroundColor: "#121212",
  minWidth: 400,
};

type JobState = {
  date: string,
  reactNative: boolean,
  backendTechnologies: string,
  position: string,
  companyName: string,
  url: string
}

const DEFAULT_JOB_STATE = {
  date: '',
  reactNative: false,
  backendTechnologies: '',
  position: '',
  companyName: '',
  url: ''
}

const JobForm = () => {
  const [job, setJob] = useState<JobState>(DEFAULT_JOB_STATE)

  useEffect(() => {
    const queryInfo = { active: true, lastFocusedWindow: true };

    chrome.tabs &&
      chrome.tabs.query(queryInfo, (tabs) => {
        const url = tabs[0].url || ''
        setJob(state => ({ ...state, url }))
      });
  }, []);

  console.log(job)

  return (
    <div
      style={containerStyle}
      className="container flex flex-col space-y-10 p-2"
    >
      
    </div>
  );
};

export default JobForm;
