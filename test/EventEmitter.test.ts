import { EventEmitter } from '../src/index';
import { getTypes } from 'infer-types';
import * as path from 'path';

test('wait for one', async () => {
  const ee = new EventEmitter<{ hello: string }>();
  const waiter = ee.waitFor('hello');
  ee.emit('hello', 'world');
  expect(await waiter).toBe('world');
  expect(ee.countListeners()).toBe(0);
});

test('accepts async functions', done => {
  const ee = new EventEmitter<{ hello: string }>();
  ee.once('hello', async value => {
    expect(value).toBe('world');
    done();
  });
  ee.emit('hello', 'world');
});

test('assures types', async () => {
  const filepath = path.join(__dirname, 'sample.ts');
  const types = getTypes(filepath);
  expect(types).toMatchSnapshot('sample.ts exports');
});
