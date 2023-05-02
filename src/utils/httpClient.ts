import { EnvVars } from "../const/envVars";
import { IPaginationParams } from "../models/paginationParams";

export class HttpClient {
  static async getUserData() {
    return this.httpGETRequest("user");
  }

  static async signIn(body: Object) {
    return this.httpPOSTRequest("signin", JSON.stringify(body));
  }

  static async signUp(body: Object) {
    return this.httpPOSTRequest("signup", JSON.stringify(body));
  }

  static async getNewsById(id: string) {
    return this.httpGETRequest(`news?id=${id}`);
  }

  static async getNews({ limit, page }: IPaginationParams) {
    return this.httpGETRequest(`news?limit=${limit}&page=${page}`);
  }

  static async createNews(body: Object) {
    return this.httpPOSTRequest("news", JSON.stringify(body));
  }

  static async editNews(body: Object) {
    return this.httpPUTRequest("news", JSON.stringify(body));
  }
  static async deleteNews(id: string) {
    return this.httpDELETERequest("news", JSON.stringify({ _id: id }));
  }

  static async uploadFile(body: BodyInit) {
    return this.httpPOSTRequest("file", body, {});
  }

  private static httpGETRequest(path: string) {
    return fetch(`${EnvVars.apiPath}/api/${path}`, {
      method: "GET",
      credentials: "include",
      mode: "cors"
    });
  }

  private static httpPOSTRequest(path: string, body: BodyInit, headers: HeadersInit = {"Content-Type": "application/json"}) {
    return fetch(`${EnvVars.apiPath}/api/${path}`, {
      method: "POST",
      credentials: "include",
      mode: "cors",
      headers,
      body,
    });
  }

  private static httpPUTRequest(path: string, body: BodyInit) {
    return fetch(`${EnvVars.apiPath}/api/${path}`, {
      method: "PUT",
      credentials: "include",
      headers: {"Content-Type": "application/json"},
      mode: "cors",
      body,
    })
  }
  private static httpDELETERequest(path: string, body: BodyInit) {
    return fetch(`${EnvVars.apiPath}/api/${path}`, {
      method: "DELETE",
      credentials: "include",
      headers: {"Content-Type": "application/json"},
      mode: "cors",
      body,
    })
  }
}
