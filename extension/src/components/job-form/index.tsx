import React, { useEffect, useState } from "react";
import { DateTime } from 'luxon'

import { getCurrentTabId, getCurrentTabUrl } from "src/chrome/utils";
import { JobFormView, MessageToContent, MessageToContentType } from "src/types";
import Input from "./input";
import { convertToDbView } from "./utils";
import { putJob, isJobExists } from 'src/db'

const containerStyle = {
  backgroundColor: "#121212",
  minWidth: 400,
};

const JOB_DEFAULT_STATE: JobFormView = {
  timestamp: Math.round(Date.now() / 1000),
};

enum SubmitStatus {
  Success = 'Success',
  Failure = 'Failure'
}

const JobForm = () => {
  const [job, setJob] = useState<JobFormView>(JOB_DEFAULT_STATE);
  const [isJobExistsInDb, setIsJobExistsInDb] = useState<boolean>(false)
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus | null>(null)
  const [submittedJobId, setSubmittedJobId] = useState<string | undefined>()
  const [isReactJob, setIsReactJob] = useState<Boolean>(false)

  useEffect(() => {
    if(job.url) {
      chrome.storage.local.get(job.url, result => updateJob(result[job.url as string]))
    }
  }, [job.url])

  useEffect(() => {
    const checkIfExists = async () => {
      if (job.position && job.companyName) {
        const exists = await isJobExists(job.position, job.companyName)
        if (exists) {
          setIsJobExistsInDb(true)
        }
      }
    }
    checkIfExists()
  }, [job.position, job.companyName])

  const updateJob = (part: Partial<JobFormView>) => {
    setJob((state) => ({
      ...state,
      ...part,
    }));
  };

  useEffect(() => {
    chrome.storage.local.set({ [job.url || '']: job })
  }, [job])

  useEffect(() => {
    if (submittedJobId) {
      chrome.storage.local.remove(submittedJobId)
    }
  }, [submittedJobId])

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
      chrome.tabs.sendMessage(id, message, ({ job, isReactJob }) => {
        updateJob(job);
        setIsReactJob(isReactJob)
      });
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const dbView = convertToDbView(job)
    console.log('Submit: ', dbView)
    try {
      await putJob(dbView)
      setSubmitStatus(SubmitStatus.Success)
      setSubmittedJobId(dbView.id)
    } catch (err) {
      console.log('Fail to put a job: ', err)
      setSubmitStatus(SubmitStatus.Failure)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={containerStyle}
      className="container flex flex-col space-y-2 p-2"
    >
      {!isReactJob && (
        <p className="text-yellow-200">No React</p>
      )}
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
      <div className="flex space-x-2">
        <Input
          label={'Timestamp'}
          value={job.timestamp}
          onChange={(str) => updateJob({ timestamp: Number(str) })}
        />
        <button type="button" onClick={() => updateJob({ timestamp: Math.round(DateTime.local().minus({ days: 1 }).toSeconds()) })} className="p-2 text-gray-800 shadow-sm rounded-md bg-yellow-200">
          Yesterday
        </button>
      </div>
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
        label="Location Restriction"
        value={job.locationRestriction?.join(',')}
        onChange={(str) => updateJob({ locationRestriction: str.split(',') })}
      />
      <Input
        label="Backend Technologies"
        value={job.backendTechnologies?.join(',')}
        onChange={(str) => updateJob({ backendTechnologies: str.split(',') })}
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
          className="h-4 w-4 text-indigo-200 border-gray-300 rounded"
          onChange={() => 
            updateJob({ reactNative: !job.reactNative })
          }
          checked={job.reactNative}
        />
      </div>
      <button type="submit" className="p-2 text-gray-800 shadow-sm rounded-md bg-indigo-200 hover:bg-indigo-300">
        Submit
      </button>
      {submitStatus && (submitStatus === SubmitStatus.Success ? (
        <p className="text-green-200">Success: {submittedJobId}</p>
      ) : (
        <p className="text-red-200">Fail</p>
      ))}
      {isJobExistsInDb && (
        <p className="text-green-200">In the DB</p>
      )}
    </form>
  );
};

export default JobForm;
