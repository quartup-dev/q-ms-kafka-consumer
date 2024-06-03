export default class ExtError extends Error {
  constructor(message, name, code = 500) {
    super(message);
    this.name = name;
    this.code = code;
  }
}
// 