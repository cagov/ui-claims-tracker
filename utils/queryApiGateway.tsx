/**
 * Utility file for connecting to and querying the API gateway.
 *
 * Prerequisites for a successful connection:
 * - unique number in the received request header
 * - the following environment variables:
 *   - ID_HEADER_NAME: string for the unique number header key
 *   - API_URL: url for the API gateway
 *   - API_USER_KEY: key for authenticating with the API gateway
 *   - CERTIFICATE_DIR: path to the PKCS#12 certificate
 *   - PFX_FILE: filename of the PKCS#12 certificate for authenticating with the API gateway
 */

import path from 'path'
import fs from 'fs'
import https from 'https'
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
  pfxPassphrase?: string
}

export interface AgentOptions {
  pfx: Buffer
  passphrase?: string
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
  const pfxFilename: string = process.env.PFX_FILE ?? ''
  apiEnvVars.pfxPath = path.join(certDir, pfxFilename)

  // Some certificates have an import password
  apiEnvVars.pfxPassphrase = process.env.PFX_PASSPHRASE || ''

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
 * Return the unique number.
 */
export function getUniqueNumber(req: IncomingMessage, idHeaderName: string): string {
  // Request converts all headers to lowercase, so we need to convert the key to lowercase too.
  return req.headers[idHeaderName.toLowerCase()] as string
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
  const options: AgentOptions = {
    pfx: fs.readFileSync(apiEnvVars.pfxPath),
  }

  if (apiEnvVars.pfxPassphrase) {
    options.passphrase = apiEnvVars.pfxPassphrase
  }

  // Instantiate agent to use with TLS Certificate.
  // Reference: https://github.com/node-fetch/node-fetch/issues/904#issuecomment-747828286
  const sslConfiguredAgent: https.Agent = new https.Agent(options)

  const apiUrlParams: QueryParams = {
    user_key: apiEnvVars.apiUserKey,
    uniqueNumber: getUniqueNumber(req, apiEnvVars.idHeaderName),
  }

  const apiUrl: RequestInfo = buildApiUrl(apiEnvVars.apiUrl, apiUrlParams)

  try {
    // For typing, we break out the requestInit object separately.
    // https://github.com/node-fetch/node-fetch/blob/ffef5e3c2322e8493dd75120b1123b01b106ab23/%40types/index.d.ts#L180
    const requestInit = {
      headers: headers,
      agent: sslConfiguredAgent,
    }
    // Next.js includes polyfills for fetch(). It essentially just binds node-fetch to
    // global variables, so we don't need to do explicit imports, including for typing.
    // - https://nextjs.org/docs/basic-features/supported-browsers-features#server-side-polyfills
    // - https://nextjs.org/blog/next-9-4#improved-built-in-fetch-support
    const response = await fetch(apiUrl, requestInit)

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
