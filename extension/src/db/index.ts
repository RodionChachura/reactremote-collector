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

export const isJobExists = async (position: string, companyName: string) => {
  const scan = dynamoUtils.paginationAware('scan')
  const jobs = await scan({
    TableName: JOBS_TABLE_NAME,
    FilterExpression: '#position = :position and #companyName = :companyName',
    ExpressionAttributeValues: {
      ':position': position,
      ':companyName': companyName
    },
    ExpressionAttributeNames: {
      '#position': 'position',
      '#companyName': 'companyName'
    }
  })

  return jobs.length > 0
}