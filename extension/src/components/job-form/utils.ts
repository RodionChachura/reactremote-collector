import { JobDBView, JobFormView } from "src/types";
import { dynamoUtils } from 'src/db'

export const convertToDbView = (job: JobFormView): JobDBView => {
  const view: Partial<JobDBView> = {
    timestamp: job.timestamp || Math.round(Date.now() / 1000),
    reactNative: job.reactNative || false,
    salary: job.salary,
    timezoneRestriction: job.timezoneRestriction,
    locationRestriction: job.locationRestriction,
    backendTechnologies: job.backendTechnologies,
    position: job.position,
    companyName: job.companyName,
    url: job.url,
  };

  const viewWithoutUndefined: Partial<JobDBView> = Object.fromEntries(
    Object.entries(view).filter(([, value]) => value)
  );

  return dynamoUtils.withId(viewWithoutUndefined) as JobDBView;
};
