import { JobDBView, JobFormView } from "src/types";
import { dynamoUtils } from 'src/db'

export const convertToDbView = (job: JobFormView): JobDBView => {
  const view: Partial<JobDBView> = {
    timestamp: job.timestamp || Math.round(Date.now() / 1000),
    reactNative: job.reactNative || false,
    salary: job.salary,
    timezoneRestriction: job.timezoneRestriction,
    position: job.position,
    companyName: job.companyName,
    url: job.url,
  };
  if (job.backendTechnologies && job.backendTechnologies.length > 0) {
    view.backendTechnologies = job.backendTechnologies
  }
  if (job.locationRestriction && job.locationRestriction.length > 0) {
    view.locationRestriction = job.locationRestriction
  }

  const viewWithoutUndefined: Partial<JobDBView> = Object.fromEntries(
    Object.entries(view).filter(([, value]) => value)
  );

  return dynamoUtils.withId(viewWithoutUndefined) as JobDBView;
};
