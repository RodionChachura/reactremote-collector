export interface Job {
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