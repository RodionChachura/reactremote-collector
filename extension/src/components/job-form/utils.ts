import { JobDBView, JobFormView } from "src/types";
import { dynamoUtils } from 'src/db'

const getFilteredArray = (array: string[] | undefined): string[] | undefined => {
  const filtered = (array || []).filter(s => !['', ' '].includes(s))
  return filtered.length ? filtered : undefined
}

export const convertToDbView = (job: JobFormView): JobDBView => {
  const view: Partial<JobDBView> = {
    timestamp: job.timestamp || Math.round(Date.now() / 1000),
    reactNative: job.reactNative || false,
    salary: job.salary,
    timezoneRestriction: job.timezoneRestriction,
    position: job.position,
    companyName: job.companyName,
    backendTechnologies: getFilteredArray(job.backendTechnologies),
    locationRestriction: getFilteredArray(job.locationRestriction),
    url: job.url,
  };

  const viewWithoutUndefined: Partial<JobDBView> = Object.fromEntries(
    Object.entries(view).filter(([, value]) => value)
  );

  return dynamoUtils.withId(viewWithoutUndefined) as JobDBView;
};
