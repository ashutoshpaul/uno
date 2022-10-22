const {v4 : uuidv4 } = require('uuid');

export class Uuid {
  static generateUuid(): string {
    return uuidv4();
  }
}
