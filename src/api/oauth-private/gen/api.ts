/// <reference path="./custom.d.ts" />
// tslint:disable
/**
 * Oauth Private API
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: v1
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */


import * as url from "url";
import * as portableFetch from "portable-fetch";
import { Configuration } from "./configuration";

const BASE_PATH = "http://localhost/api-private/v1/oauth".replace(/\/+$/, "");

/**
 *
 * @export
 */
export const COLLECTION_FORMATS = {
    csv: ",",
    ssv: " ",
    tsv: "\t",
    pipes: "|",
};

/**
 *
 * @export
 * @interface FetchAPI
 */
export interface FetchAPI {
    (url: string, init?: any): Promise<Response>;
}

/**
 *  
 * @export
 * @interface FetchArgs
 */
export interface FetchArgs {
    url: string;
    options: any;
}

/**
 * 
 * @export
 * @class BaseAPI
 */
export class BaseAPI {
    protected configuration: Configuration;

    constructor(configuration?: Configuration, protected basePath: string = BASE_PATH, protected fetch: FetchAPI = portableFetch) {
        if (configuration) {
            this.configuration = configuration;
            this.basePath = configuration.basePath || this.basePath;
        }
    }
};

/**
 * 
 * @export
 * @class RequiredError
 * @extends {Error}
 */
export class RequiredError extends Error {
    name: "RequiredError"
    constructor(public field: string, msg?: string) {
        super(msg);
    }
}

/**
 * 
 * @export
 * @interface AuthorizationCode
 */
export interface AuthorizationCode {
    /**
     * 
     * @type {string}
     * @memberof AuthorizationCode
     */
    code?: string;
    /**
     * 
     * @type {number}
     * @memberof AuthorizationCode
     */
    expiresSeconds?: number;
}


/**
 * DefaultApi - fetch parameter creator
 * @export
 */
export const DefaultApiFetchParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * 
         * @summary 
         * @param {string} accountJwt 
         * @param {string} responseType 
         * @param {string} clientId 
         * @param {string} redirectUri 
         * @param {string} scope 
         * @param {string} state 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        authorize(accountJwt: string, responseType: string, clientId: string, redirectUri: string, scope: string, state: string, options: any = {}): FetchArgs {
            // verify required parameter 'accountJwt' is not null or undefined
            if (accountJwt === null || accountJwt === undefined) {
                throw new RequiredError('accountJwt','Required parameter accountJwt was null or undefined when calling authorize.');
            }
            // verify required parameter 'responseType' is not null or undefined
            if (responseType === null || responseType === undefined) {
                throw new RequiredError('responseType','Required parameter responseType was null or undefined when calling authorize.');
            }
            // verify required parameter 'clientId' is not null or undefined
            if (clientId === null || clientId === undefined) {
                throw new RequiredError('clientId','Required parameter clientId was null or undefined when calling authorize.');
            }
            // verify required parameter 'redirectUri' is not null or undefined
            if (redirectUri === null || redirectUri === undefined) {
                throw new RequiredError('redirectUri','Required parameter redirectUri was null or undefined when calling authorize.');
            }
            // verify required parameter 'scope' is not null or undefined
            if (scope === null || scope === undefined) {
                throw new RequiredError('scope','Required parameter scope was null or undefined when calling authorize.');
            }
            // verify required parameter 'state' is not null or undefined
            if (state === null || state === undefined) {
                throw new RequiredError('state','Required parameter state was null or undefined when calling authorize.');
            }
            const localVarPath = `/authorize`;
            const localVarUrlObj = url.parse(localVarPath, true);
            const localVarRequestOptions = Object.assign({ method: 'POST' }, options);
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            if (accountJwt !== undefined) {
                localVarQueryParameter['accountJwt'] = accountJwt;
            }

            if (responseType !== undefined) {
                localVarQueryParameter['response_type'] = responseType;
            }

            if (clientId !== undefined) {
                localVarQueryParameter['client_id'] = clientId;
            }

            if (redirectUri !== undefined) {
                localVarQueryParameter['redirect_uri'] = redirectUri;
            }

            if (scope !== undefined) {
                localVarQueryParameter['scope'] = scope;
            }

            if (state !== undefined) {
                localVarQueryParameter['state'] = state;
            }

            localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
            // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
            delete localVarUrlObj.search;
            localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);

            return {
                url: url.format(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * DefaultApi - functional programming interface
 * @export
 */
export const DefaultApiFp = function(configuration?: Configuration) {
    return {
        /**
         * 
         * @summary 
         * @param {string} accountJwt 
         * @param {string} responseType 
         * @param {string} clientId 
         * @param {string} redirectUri 
         * @param {string} scope 
         * @param {string} state 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        authorize(accountJwt: string, responseType: string, clientId: string, redirectUri: string, scope: string, state: string, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<AuthorizationCode> {
            const localVarFetchArgs = DefaultApiFetchParamCreator(configuration).authorize(accountJwt, responseType, clientId, redirectUri, scope, state, options);
            return (fetch: FetchAPI = portableFetch, basePath: string = BASE_PATH) => {
                return fetch(basePath + localVarFetchArgs.url, localVarFetchArgs.options).then((response) => {
                    if (response.status >= 200 && response.status < 300) {
                        return response.json();
                    } else {
                        return response.json().then((data: {}) => {throw data; });
                    }
                });
            };
        },
    }
};

/**
 * DefaultApi - factory interface
 * @export
 */
export const DefaultApiFactory = function (configuration?: Configuration, fetch?: FetchAPI, basePath?: string) {
    return {
        /**
         * 
         * @summary 
         * @param {string} accountJwt 
         * @param {string} responseType 
         * @param {string} clientId 
         * @param {string} redirectUri 
         * @param {string} scope 
         * @param {string} state 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        authorize(accountJwt: string, responseType: string, clientId: string, redirectUri: string, scope: string, state: string, options?: any) {
            return DefaultApiFp(configuration).authorize(accountJwt, responseType, clientId, redirectUri, scope, state, options)(fetch, basePath);
        },
    };
};

/**
 * DefaultApi - object-oriented interface
 * @export
 * @class DefaultApi
 * @extends {BaseAPI}
 */
export class DefaultApi extends BaseAPI {
    /**
     * 
     * @summary 
     * @param {} accountJwt 
     * @param {} responseType 
     * @param {} clientId 
     * @param {} redirectUri 
     * @param {} scope 
     * @param {} state 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApi
     */
    public authorize(accountJwt: string, responseType: string, clientId: string, redirectUri: string, scope: string, state: string, options?: any) {
        return DefaultApiFp(this.configuration).authorize(accountJwt, responseType, clientId, redirectUri, scope, state, options)(this.fetch, this.basePath);
    }

}

export interface authorizeParams {
    accountJwt: string;
    responseType: string;
    clientId: string;
    redirectUri: string;
    scope: string;
    state: string;
}

export const authorize_REQUEST = "authorize_REQUEST";
export const authorize_FAILURE = "authorize_FAILURE";
export const authorize_SUCCESS = "authorize_SUCCESS";


