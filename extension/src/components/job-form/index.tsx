import React, { useEffect, useState } from "react";

import { getCurrentTabId, getCurrentTabUrl } from "src/chrome/utils";
import { JobFormView, MessageToContent, MessageToContentType } from "src/types";
import Input from "./input";
import { convertToDbView } from "./utils";
import { putJob } from 'src/db'

const containerStyle = {
  backgroundColor: "#121212",
  minWidth: 400,
};

const JOB_DEFAULT_STATE: JobFormView = {
  timestamp: Math.round(Date.now() / 1000),
};

const JobForm = () => {
  const [job, setJob] = useState<JobFormView>(JOB_DEFAULT_STATE);

  const updateJob = (part: Partial<JobFormView>) => {
    setJob((state) => ({
      ...state,
      ...part,
    }));
  };

  useEffect(() => {
    getCurrentTabUrl((url = "") => {
      updateJob({ url });
    });
  }, []);

  useEffect(() => {
    const message: MessageToContent = {
      type: MessageToContentType.GetJobInfo,
    };

    getCurrentTabId((id = 0) => {
      chrome.tabs.sendMessage(id, message, (response: JobFormView) => {
        updateJob(response);
      });
    });
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const dbView = convertToDbView(job)
    console.log('Submit: ', dbView)
    putJob(dbView)
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={containerStyle}
      className="container flex flex-col space-y-2 p-2"
    >
      <Input
        label={'Position'}
        value={job.position}
        onChange={(str) => updateJob({ position: str })}
      />
      <Input
        label={'Company Name'}
        value={job.companyName}
        onChange={(str) => updateJob({ companyName: str })}
      />
      <Input
        label={'Timestamp'}
        value={job.timestamp}
        onChange={(str) => updateJob({ timestamp: Number(str) })}
      />
      <Input
        label="Salary"
        value={job.salary}
        onChange={(str) => updateJob({ salary: str })}
      />
      <Input
        label="Timezone Restriction"
        value={job.timezoneRestriction}
        onChange={(str) => updateJob({ timezoneRestriction: str })}
      />
      <Input
        label="Backend Technologies"
        value={job.backendTechnologies?.join(',')}
        onChange={(str) => updateJob({ backendTechnologies: str.split(',') })}
      />
      <Input
        label="Location Restriction"
        value={job.locationRestriction?.join(',')}
        onChange={(str) => updateJob({ locationRestriction: str.split(',') })}
      />
      <Input
        label="Url"
        value={job.url}
        onChange={(str) => updateJob({ url: str })}
      />
      <div className="flex flex-row items-center space-x-2">
        <label className="text-sm text-gray-100">React Native</label>
        <input
          type="checkbox"
          className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
          onChange={() => 
            updateJob({ reactNative: !job.reactNative })
          }
          checked={job.reactNative}
        />
      </div>
      <button type="submit" className="p-2 text-gray-800 shadow-sm rounded-md bg-indigo-200 hover:bg-indigo-300">
        Submit
      </button>
    </form>
  );
};

export default JobForm;
