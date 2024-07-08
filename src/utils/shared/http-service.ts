import axios, { Axios, AxiosResponse } from "axios";
import { transformSnakeCaseToCamelCase } from "src/utils";
import { apiBaseUrl } from "src/constants";

interface Config {
  transformToCamelCase?: boolean;
  withAuthorization?: boolean;
}

function getCookie(name: string) {
  let cookieArr = document.cookie.split(";");

  for (let i = 0; i < cookieArr.length; i++) {
    let cookiePair = cookieArr[i].split("=");

    /* Removing whitespace at the beginning of the cookie name
      and compare it with the given string */
    if (name == cookiePair[0].trim()) {
      // Decode the cookie value and return
      return decodeURIComponent(cookiePair[1]);
    }
  }

  // Return null if not found
  return null;
}

export class HttpService {
  private axiosInstance;

  constructor(private readonly config?: Config) {
    this.axiosInstance = axios.create({
      baseURL: apiBaseUrl,
      headers: {
        ...(config?.withAuthorization !== false
          ? { Authorization: `Bearer ${getCookie("token")}` }
          : {}),
      },
    });
  }

  public async get<T>(
    ...args: Parameters<Axios["get"]>
  ): Promise<AxiosResponse<T>> {
    try {
      return this.transformResponse(await this.axiosInstance.get<T>(...args));
    } catch (error) {
      // TODO: Add sentry logging
      throw error;
    }
  }

  public async post<T>(
    ...args: Parameters<Axios["post"]>
  ): Promise<AxiosResponse<T>> {
    try {
      return this.transformResponse(await this.axiosInstance.post<T>(...args));
    } catch (error) {
      // TODO: Add sentry logging
      throw error;
    }
  }

  public async put<T>(
    ...args: Parameters<Axios["put"]>
  ): Promise<AxiosResponse<T>> {
    try {
      return this.transformResponse(await this.axiosInstance.put<T>(...args));
    } catch (error) {
      throw error;
    }
  }

  public async delete<T>(
    ...args: Parameters<Axios["delete"]>
  ): Promise<AxiosResponse<T>> {
    try {
      return this.transformResponse(
        await this.axiosInstance.delete<T>(...args),
      );
    } catch (error) {
      // TODO: Add sentry logging
      throw error;
    }
  }

  private transformResponse<T>(response: AxiosResponse<T>) {
    if (this.config?.transformToCamelCase) {
      return {
        ...response,
        data: transformSnakeCaseToCamelCase(response.data),
      };
    }
    return response;
  }
}
