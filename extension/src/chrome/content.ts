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
    
    const bodySibling = document.getElementsByClassName('breakpoint__desktop-up ')[0]
    if (bodySibling) {
      const body = (bodySibling as HTMLElement).previousSibling
      if (body) {
        job.backendTechnologies = getBETechnologies((body as HTMLElement).innerText)
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
      job.backendTechnologies = getBETechnologies((listing as HTMLElement).innerText)
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
  }

  if (job.locationRestriction) {
    job.locationRestriction = job.locationRestriction.map(location => {
      if (['United States', 'USA'].includes(location)) {
        return 'US'
      }
      return location
    })
  }

  const markdown = document.getElementsByClassName('markdown')[0]
  if (markdown) {
    job.backendTechnologies = getBETechnologies((markdown as HTMLElement).innerText)
  }

  return job
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
