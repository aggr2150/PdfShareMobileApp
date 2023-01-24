declare interface response<T = undefined> {
  code: number;
  status: string;
  data: T;
}

declare interface CsrfTokenResponse extends response {
  data: {
    _csrf: string;
  };
}

declare type Nullable<T> = T | null;
