import { MessageToContent, MessageToContentType, JobFormView } from "src/types"
import { BACK_END_TECH } from './constants'

type MessageResponse = (response?: any) => void

const doesTextContain = (text: string, regex: any) => {
  const match = text.match(regex)
  return Boolean(match && match.length > 0)
}

const getBETechnologies = (text: string): string[] => {
  return BACK_END_TECH.filter(tech => {
    const isPresent = doesTextContain(text, new RegExp(tech, 'i'))
    return isPresent
  })
}

interface ScrapeResult {
  job: Partial<JobFormView>,
  isReactJob: boolean
}

const scrape = (domain: string): ScrapeResult => {
  let job: Partial<JobFormView> = {}
  let body = ''
  let isReactJob = false

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
    
    const bodySibling = document.getElementsByClassName('breakpoint__desktop-up ')[0]
    if (bodySibling) {
      const bodyElement = (bodySibling as HTMLElement).previousSibling
      if (bodyElement) {
        body = (bodyElement as HTMLElement).innerText
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

    const listing = document.getElementsByClassName('listing-container')[0]
    if (listing) {
      body = (listing as HTMLElement).innerText
    }
  } else if (domain.includes('remoteok.io')) {
    job.companyName = (document.getElementsByClassName('companyLink')[0] as HTMLElement).innerText
    job.position = document.getElementsByTagName('h2')[2].innerText
    const locationHeadline = document.getElementById('location')
    if (locationHeadline) {
      const location = (locationHeadline.nextSibling?.nextSibling as HTMLElement).innerText
      if (!location.includes('Worldwide')) {
        job.locationRestriction = location.split(', ')
      }
    }
    const salaryHeadline = document.getElementById('salary')
    if (salaryHeadline) {
      job.salary = (salaryHeadline.nextSibling?.nextSibling as HTMLElement).innerText
    }

    const markdown = document.getElementsByClassName('markdown')[0]
    if (markdown) {
      body = (markdown as HTMLElement).innerText
    }
  }

  if (job.locationRestriction) {
    job.locationRestriction = job.locationRestriction.map(location => {
      if (['United States', 'USA'].includes(location)) {
        return 'US'
      }
      return location
    })
  }
  if (body) {
    job.reactNative = doesTextContain(body, /react native/i)
    job.backendTechnologies = getBETechnologies(body)
    isReactJob = doesTextContain(body, /react/i)
  }

  return {
    job,
    isReactJob
  }
}

chrome.runtime.onMessage.addListener((message: MessageToContent, sender: any, sendResponse: MessageResponse) => {
  if (message.type === MessageToContentType.GetJobInfo) {
    const domain = window.location.hostname
    
    sendResponse(scrape(domain))
  }
})
