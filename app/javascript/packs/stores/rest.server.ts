import axios from 'axios';

import { logger } from '../common/logger';

/**
 * Implements transport layer to fetch data from REST API.
 */
class RestServer {

  public MOCKED = false;
  public VERBOSE = true;

  private readonly restApiProto: string;
  private readonly restApiHost: string;
  private readonly restApiPort: number | null;
  private readonly restApiBaseUrl: string;

  private readonly csrf: string;
  private headers = {};

  constructor() {
    if (this.MOCKED) {
      this.restApiProto = 'http';
      this.restApiHost = 'localhost';
      this.restApiPort = 3030;
    } else {
      this.restApiProto = 'http';
      this.restApiHost = 'localhost';
      this.restApiPort = 3000;
    }

    this.restApiBaseUrl = `${this.restApiProto}://${this.restApiHost}`;

    if (this.restApiPort) {
      this.restApiBaseUrl += `:${this.restApiPort}`;
    }

    if (process.env.SHOPPU_API_URL) {
      this.restApiBaseUrl = process.env.SHOPPU_API_URL;
    }

    this.csrf = document.querySelector('meta[name=csrf-token]').getAttribute('content');
    this.headers = { 'X-CSRF-Token': this.csrf };
  }

  public async fetchAll(path: string): Promise<any> {
    return this.get(path);
  }

  public async fetchPaginated(path: string, page: number, per_page: number, query?: string): Promise<any> {
    return this.get(path + '?' + `page=${page}` + '&' + `per_page=${per_page}` + '&' + `query=${query}`);
  }

  public async fetchById(path: string, id: number): Promise<any> {
    return this.get(path + '/' + id);
  }

  public async get(path: string): Promise<any> {
    const url = `${path}`;
    logger.of('RestServer.get').data('url', url);

    return axios.get(url)
      .then(response => {
        if (this.VERBOSE) {
          logger.of('RestServer.get').data('response.data', response.data);
        }

        return response.data
      })
      .catch(error => this.handleError(error, 'get'));
  }

  public async delete(path: string, id: number): Promise<any> {
    const url = `${path}/${id}`;
    logger.of('RestServer.delete').data('url', url);

    if (this.MOCKED) {
      logger.of('RestServer.put').error('dummy operation: MOCK mode');
      return Promise.resolve(false);
    }

    return axios.delete(url, { headers: this.headers })
      .then(response => {
        if (this.VERBOSE) {
          logger.of('RestServer.delete').data('response', response);
        }

        return response.data
      })
      .catch(error => this.handleError(error, 'delete'));
  }

  public async put(path: string, id: number, json: {}): Promise<any> {
    const url = `${path}/${id}`;
    logger.of('RestServer.put').data('url', url);
    logger.of('RestServer.put').data('json', json);

    if (this.MOCKED) {
      logger.of('RestServer.put').error('dummy operation: MOCK mode');
      return Promise.resolve(false);
    }

    return axios.put(url, json, { headers: this.headers })
      .then(response => {
        if (this.VERBOSE) {
          logger.of('RestServer.put').data('response', response);
        }

        return response.data
      })
      .catch(error => this.handleError(error, 'put'));
  }

  public async post(path: string, json: {}): Promise<any> {
    const url = `${path}`;
    logger.of('RestServer.post').data('url', url);

    if (this.MOCKED) {
      logger.of('RestServer.put').error('dummy operation: MOCK mode');
      return Promise.resolve(false);
    }

    return axios.post(url, json, { headers: this.headers })
      .then(response => {
        if (this.VERBOSE) {
          logger.of('RestServer.post').data('response', response);
        }

        return response.data
      })
      .catch(error => this.handleError(error, 'post'));
  }

  private handleError = (error, verb: string): Promise<any> => {
    if (error.response) {
      logger.of(`RestServer.${verb}`, 'handleError').error(error.response);
    } else if (error.request) {
      logger.of(`RestServer.${verb}`, 'handleError').error(error.request);
    } else {
      logger.of(`RestServer.${verb}`, 'handleError').error(error.message);
    }

    return Promise.reject(error.response || error.request || error.message);
  }

}

export let restServer = new RestServer();
