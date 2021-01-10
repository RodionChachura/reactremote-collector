import React, { useEffect, useState } from "react";
import { getCurrentTabId, getCurrentTabUrl } from "src/chrome/utils";
import { JobFormView, MessageToContent, MessageToContentType } from "src/types";

const containerStyle = {
  backgroundColor: "#121212",
  minWidth: 400,
};

const JobForm = () => {
  const [job, setJob] = useState<JobFormView>({});

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
      chrome.tabs.sendMessage(id, message, (response: JobFormView) => {
        setJob(state => ({ ...state, ...response}))
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
