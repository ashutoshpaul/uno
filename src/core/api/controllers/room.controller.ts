import { IRoom } from "src/core/interfaces/room.interface";

const Redis = require("ioredis");

const redis = new Redis();

export class RoomController {

  static async getRooms(req: Request, res: any) {
    const rawData: any = await redis.hgetall('rooms');
    const list: Array<any> = [];
    for(let key in rawData) { 
      if(rawData.hasOwnProperty(key)) { 
        list.push(JSON.parse(rawData[key])); 
      } 
    }
    const mappedList: {key: string, value: IRoom}[] = list;
    res.json(mappedList);
  }

}