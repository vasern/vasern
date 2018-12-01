//  ObjectID use to create unique id for large distributed system
//  Inspired by MongoDB ObjectID technique
//
//  Generated ID is 24 length, which contains timestamp,
//  count, a int circle count within a second
//  machine id (8 chars if random value),
//  5 random string
//
//  This ObjectID is uniquely designed for Vasern

// @flow
import { MACHINE_ID_LEN, CHARS } from "./config";

export default class ObjectID {
  // same section id generated
  count: number;

  // previous timestamp
  lastTimestamp: number;

  // machine id
  mid: string;

  constructor(prop: { mid: ?string }) {
    this.count = 0;
    this.lastTimestamp = 0;

    if (prop && prop.mid && prop.mid.length === MACHINE_ID_LEN) {
      this.mid = prop.mid;
    } else {
      console.warn("Machine length should be ", MACHINE_ID_LEN);
      this.mid = ObjectID.RandStr(MACHINE_ID_LEN);
    }
  }

  // Create new object with a unique id
  // Each ID contain 24 chars
  //  + (8 chars) timestamp in UNIX epoch ms
  //  + (6 chars) machine id (random of MACHINE_ID_LEN length id)
  //  + (3 chars) count (incremeted int) number of same id created in the same timestamp value
  //  + (5 chars) random chars
  new(props: ?Object) {
    const timeStamp = Date.now();

    this.count = timeStamp === this.lastTimestamp ? this.count + 1 : 0;
    this.lastTimestamp = timeStamp;

    let countRepeated = this.count > 9 ? "0" : "00";
    if (this.count > 99) {
      countRepeated = "";
    }

    return {
      id:
        Math.floor(timeStamp / 1000).toString(16) +
        this.mid +
        countRepeated +
        this.count +
        ObjectID.RandStr(5),
      ...props,
    };
  }

  // ID for device, length of 8
  setMID(id: string) {
    this.mid = id;
  }

  // Generate a random string with `length` size
  static RandStr(length: number): string {
    let randS = "";
    let i = 0;

    while (i < length) {
      randS += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
      i += 1;
    }
    return randS;
  }

  // Get date time from generated id
  static GetDate(args: { _id: string }) {
    return new Date(parseInt(args._id.substring(0, 8), 16) * 1000);
  }
}

// type Props = {
//   // machine id
//   mid: ?string,
// };
