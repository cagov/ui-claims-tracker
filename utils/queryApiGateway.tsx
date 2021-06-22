import path from 'path'
import fs from 'fs'
import https from 'https'
import fetch, { Response } from 'node-fetch'
import { IncomingMessage } from 'http'
import { Claim } from '../types/common'

export interface QueryParams {
  user_key: string
  uniqueNumber: string
}

export interface ApiEnvVars {
  idHeaderName: string
  apiUrl: string
  apiUserKey: string
  pfxPath: string
}

/**
 * Load environment variables to be used for authentication & API calls.
 * @TODO: Handle error case where env vars are null or undefined.
 */
export function getApiVars(): ApiEnvVars {
  const apiEnvVars: ApiEnvVars = { idHeaderName: '', apiUrl: '', apiUserKey: '', pfxPath: '' }

  // Request fields
  apiEnvVars.idHeaderName = process.env.ID_HEADER_NAME ?? ''

  // API fields
  apiEnvVars.apiUrl = process.env.API_URL ?? ''
  apiEnvVars.apiUserKey = process.env.API_USER_KEY ?? ''

  // TLS Certificate fields
  const certDir: string = process.env.CERTIFICATE_DIR ?? ''
  const pfxFilename: string = process.env.P12_FILE ?? ''
  apiEnvVars.pfxPath = path.join(certDir, pfxFilename)

  return apiEnvVars
}

/**
 * Construct the url request to the API gateway.
 *
 * @param {string} url - base url for the API gateway
 * @param {QueryParams} queryParams - query params to append to the API gateway url
 * @returns {string}
 */
export function buildApiUrl(url: string, queryParams: QueryParams): string {
  const apiUrl = new URL(url)

  for (const key in queryParams) {
    apiUrl.searchParams.append(key, queryParams[key as 'user_key' | 'uniqueNumber'])
  }

  return apiUrl.toString()
}

/**
 * Extract JSON body from API gateway response
 * See https://github.com/typescript-eslint/typescript-eslint/issues/2118#issuecomment-641464651
 * @TODO: Validate response. See #150
 */
export function extractJSON(responseBody: string): Claim {
  return JSON.parse(responseBody) as Claim
}

/**
 * Returns results from API Gateway
 *
 * @param {Qbject} request
 * @returns {Promise<string>}
 */
export default async function queryApiGateway(req: IncomingMessage): Promise<Claim> {
  const apiEnvVars: ApiEnvVars = getApiVars()
  let apiData: Claim = { ClaimType: undefined }

  const headers = {
    Accept: 'application/json',
  }

  // https://nodejs.org/api/tls.html#tls_tls_createsecurecontext_options
  const options = {
    pfx: fs.readFileSync(apiEnvVars.pfxPath),
  }

  // Instantiate agent to use with TLS Certificate.
  // Reference: https://github.com/node-fetch/node-fetch/issues/904#issuecomment-747828286
  const sslConfiguredAgent: https.Agent = new https.Agent(options)

  const apiUrlParams: QueryParams = {
    user_key: apiEnvVars.apiUserKey,
    uniqueNumber: req.headers[apiEnvVars.idHeaderName] as string,
  }

  const apiUrl: RequestInfo = buildApiUrl(apiEnvVars.apiUrl, apiUrlParams)

  try {
    const response: Response = await fetch(apiUrl, {
      headers: headers,
      agent: sslConfiguredAgent,
    })

    if (response.ok) {
      const responseBody: string = await response.text()
      apiData = extractJSON(responseBody)
    } else {
      throw new Error('API Gateway error')
    }
  } catch (error) {
    console.log(error)
  }

  // Although we are using an https.Agent with keepAlive false (default behaviour),
  // we are explicitly destroying it because:
  // > It is good practice, to destroy() an Agent instance when it is no longer in use,
  // > because unused sockets consume OS resources.
  // https://nodejs.org/api/http.html#http_class_http_agent
  sslConfiguredAgent.destroy()

  return apiData
}
