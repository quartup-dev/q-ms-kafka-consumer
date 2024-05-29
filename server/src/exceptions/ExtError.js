export default class ExtError extends Error {
  constructor(message, code = 500) {
    super(message);
    this.name = "ExtError";
    this.code = code;
  }
}
// 