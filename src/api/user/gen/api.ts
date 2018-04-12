/// <reference path="./custom.d.ts" />
// tslint:disable
/**
 * User API
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

const BASE_PATH = "http://localhost/api/v1/users".replace(/\/+$/, "");

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
    protected configuration?: Configuration;

    constructor(configuration?: Configuration, protected basePath: string = BASE_PATH, protected fetch: FetchAPI = portableFetch) {
        if (configuration) {
            this.configuration = configuration;
            this.basePath = configuration.basePath || this.basePath;
        }
    }
}

/**
 * 
 * @export
 * @class RequiredError
 * @extends {Error}
 */
export class RequiredError extends Error {
    name: string = "RequiredError";

    constructor(public field: string, msg?: string) {
        super(msg);
    }
}

/**
 * 
 * @export
 * @interface UserInfo
 */
export interface UserInfo {
    /**
     * 
     * @type {string}
     * @memberof UserInfo
     */
    userId?: string;
    /**
     * 
     * @type {string}
     * @memberof UserInfo
     */
    name?: string;
    /**
     * 
     * @type {string}
     * @memberof UserInfo
     */
    icon?: string;
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
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getUserInfo(options: any = {}): FetchArgs {
            const localVarPath = `/userInfo`;
            const localVarUrlObj = url.parse(localVarPath, true);
            const localVarRequestOptions = Object.assign({ method: 'GET' }, options);
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication Bearer required
            if (configuration && configuration.apiKey) {
                const localVarApiKeyValue = typeof configuration.apiKey === 'function'
					? configuration.apiKey("Authorization")
					: configuration.apiKey;
                localVarHeaderParameter["Authorization"] = localVarApiKeyValue;
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
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getUserInfo(options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<UserInfo> {
            const localVarFetchArgs = DefaultApiFetchParamCreator(configuration).getUserInfo(options);
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
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getUserInfo(options?: any) {
            return DefaultApiFp(configuration).getUserInfo(options)(fetch, basePath);
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
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApi
     */
    public getUserInfo(options?: any) {
        return DefaultApiFp(this.configuration).getUserInfo(options)(this.fetch, this.basePath);
    }

}



