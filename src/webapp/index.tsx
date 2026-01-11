import type { JSX } from 'react'

const WebApps: Record<string, JSX.Element|null> = {}

export function registerWebApp(name: string, webApp: JSX.Element) {
  WebApps[name] = webApp
}

export function getWebApp(name: string): JSX.Element|null {
  return WebApps[name] || null
}