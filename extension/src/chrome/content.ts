import { MessageToContent, MessageToContentType, JobFormView } from "src/types"

type MessageResponse = (response?: any) => void

chrome.runtime.onMessage.addListener((message: MessageToContent, sender: any, sendResponse: MessageResponse) => {
  if (message.type === MessageToContentType.GetJobInfo) {
    const response: JobFormView = {
      position: 'Full Stack', backendTechnologies: ['Python', 'Django']
    }
    sendResponse(response)
  }
})
