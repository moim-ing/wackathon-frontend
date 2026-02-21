export interface User {
  name: string;
  email: string;
}

export interface Class {
  id: string;
  title: string;
}

export interface ApiErrorResponse {
  httpStatusCode: string;
  title: string;
  message: string;
}
