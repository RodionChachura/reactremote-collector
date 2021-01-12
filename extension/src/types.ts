export interface JobDBView {
  id: string,
  timestamp: number,
  reactNative: boolean,
  position: string,
  url: string,
  salary?: string,
  timezoneRestriction?: string,
  locationRestriction?: string[],
  backendTechnologies?: string[],
  companyName?: string,
}

export interface JobFormView {
  timestamp?: number;
  reactNative?: boolean;
  backendTechnologies?: string[];
  position?: string;
  companyName?: string;
  url?: string;
  salary?: string;
  timezoneRestriction?: string,
  locationRestriction?: string[],
}

export enum MessageToContentType {
  GetJobInfo = "GetJobInfo"
}

export interface MessageToContent {
  type: MessageToContentType,
  payload?: any
}