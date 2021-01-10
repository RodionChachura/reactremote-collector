export interface JobDBView {
  date: string,
  reactNative: boolean,
  salary?: string,
  timezoneRestriction?: string,
  locationRestriction?: string[],
  backend?: {
    technologies: string[],
  },
  position: string,
  company: {
    name: string,
  },
  url: string,
}

export interface JobFormView {
  date?: string;
  reactNative?: boolean;
  backendTechnologies?: string[];
  position?: string;
  companyName?: string;
  url?: string;
}

export enum MessageToContentType {
  GetJobInfo = "GetJobInfo"
}

export interface MessageToContent {
  type: MessageToContentType,
  payload?: any
}