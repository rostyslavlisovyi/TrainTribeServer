export class BaseResponse<T = unknown> {
  data: T;

  constructor(data: T) {
    this.data = data;
  }

  toJSON() {
    return { data: this.data };
  }
}
