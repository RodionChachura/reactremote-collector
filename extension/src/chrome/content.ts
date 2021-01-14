import { MessageToContent, MessageToContentType, JobFormView } from "src/types"

type MessageResponse = (response?: any) => void

const scrape = (domain: string) => {
  let job: Partial<JobFormView> = {}
  if (domain.includes('angel.co')) {
    const h1 = document.getElementsByTagName('h1')[0]
    if (h1) {
      job.companyName = h1.innerText
    }
  
    const h2 = document.getElementsByTagName('h2')[1]
    if (h2) {
      job.position = h2.innerText
    }
  
    const salaryElement = h2.nextSibling
    if (salaryElement) {
      job.salary = (salaryElement as HTMLSpanElement).innerText.split(' • ')[0]
    }
  
  
    const xpath = "//dt[contains(text(),'Hires remotely')]";
    const dt = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    if (dt) {
      const hiresInElement = (dt as HTMLElement).nextSibling
      if (hiresInElement)  {
        const hiresIn = (hiresInElement as HTMLElement).innerText
        if (hiresIn && hiresIn !== 'Everywhere') {
          job.locationRestriction = hiresIn.split(' • ')
        }
      }
    }
  } else if (domain.includes('weworkremotely.com')) {
    const h1 = document.getElementsByTagName('h1')[0]
    if (h1) {
      job.position = h1.innerText
    }

    const h2 = document.getElementsByTagName('h2')[1]
    if (h2) {
      job.companyName = h2.innerText
    }
  } else if (domain.includes('remoteok.io')) {
    job.companyName = (document.getElementsByClassName('companyLink')[0] as HTMLElement).innerText
    job.position = document.getElementsByTagName('h2')[2].innerText
  }

  return job
}

const doesTextContain = (text: string, regex: any) => {
  const match = text.match(regex)
  return Boolean(match && match.length > 0)
}

chrome.runtime.onMessage.addListener((message: MessageToContent, sender: any, sendResponse: MessageResponse) => {
  if (message.type === MessageToContentType.GetJobInfo) {
    const text = document.documentElement.textContent || document.documentElement.innerText

    const reactNative = doesTextContain(text, /react native/i)
    const domain = window.location.hostname
    let job: JobFormView = {
      reactNative,
      ...scrape(domain)
    }
    
    const isReactJob = doesTextContain(text, /react/i)
    sendResponse({
      isReactJob,
      job
    })
  }
})
