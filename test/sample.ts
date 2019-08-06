import { EventEmitter } from '../src/index';

type User = { name: string; age: number };

const eventEmitter = new EventEmitter<{ hello: string, world: number, user: User }>();

eventEmitter.once('user', value => {
  /** @export user */
  const v = value;
});

eventEmitter.once('hello', value => {
  /** @export hello */
  const v = value;
});

eventEmitter.once('world', value => {
  /** @export world */
  const v = value;
});
