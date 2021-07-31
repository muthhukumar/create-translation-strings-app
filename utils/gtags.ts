export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID

declare global {
  interface Window {
    gtag: any
  }
}

export const pageview = (url: string): void => {
  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
  })
}

export const event = ({ action, category, label, value }: Record<string, unknown>): void => {
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  })
}
