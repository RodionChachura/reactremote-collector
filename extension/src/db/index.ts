// @ts-ignore
import { getModule } from 'awsdynamoutils'
import { JobDBView } from 'src/types'

const config = {
  region: process.env.REACT_APP_AWS_REGION,
  credentials: {
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY
  }
}

export const dynamoUtils = getModule(config)

const JOBS_TABLE_NAME = 'reactremote_jobs'

// const defaultParams = (id: string) => ({
//   TableName: JOBS_TABLE_NAME,
//   Key: { id }
// })

export const putJob = (job: JobDBView) => dynamoUtils.put(JOBS_TABLE_NAME, job)