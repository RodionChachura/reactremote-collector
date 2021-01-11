import { MessageToContent, MessageToContentType, JobFormView } from "src/types"

type MessageResponse = (response?: any) => void

chrome.runtime.onMessage.addListener((message: MessageToContent, sender: any, sendResponse: MessageResponse) => {
  if (message.type === MessageToContentType.GetJobInfo) {
    const text = document.documentElement.textContent || document.documentElement.innerText

    const reactNativeMatch = text.match(/react native/i)
    const reactNative = Boolean(reactNativeMatch && reactNativeMatch.length > 0)

    const response: JobFormView = {
      reactNative
    }
  
    sendResponse(response)
  }
})
