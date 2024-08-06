import axios, { AxiosError } from 'axios';
import axiosRetry from 'axios-retry';
import { IAxiosHelperResponse } from '../interfaces';
import configuration from 'src/config/configuration';

const config = configuration();

export class AxiosHelper {
  /**
   * helps send a get request with the help of axios
   * @param  {Record<string, unknown>} path
   * @param  {Record<string, unknown>} headers
   */

  static async sendGetRequest(
    path: string,
  ): Promise<IAxiosHelperResponse> {
    const response = await axios.get(path);

    return {
      data: response.data,
      status: response.status,
    };
  }
}
