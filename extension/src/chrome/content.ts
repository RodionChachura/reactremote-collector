import { MessageToContent, MessageToContentType } from "src/types"

type MessageResponse = (response?: any) => void

chrome.runtime.onMessage.addListener((message: MessageToContent, sender: any, sendResponse: MessageResponse) => {
  if (message.type === MessageToContentType.GetJobInfo) {
    sendResponse({ position: 'Full Stack', backendTechnologies: ['Python', 'Django']})
  }
})
