import NativeEventEmitter from 'events';

type Listener<T, Event extends keyof T> = (
  value: T[Event]
) => void | Promise<void>;

/**
 * A type-safe event emitter.
 *
 * The EventTypes generics is in the form of `{ eventName: EventType }`.
 *
 * @example
 * ```ts
 * const ee = new EventEmitter<{ str: string; num: number }>();
 * ee.emit('str', 'this can only send strings');
 * ee.emit('num', 'this will fail, because it expects a number');
 *
 * ee.once('str', str => {
 *   // typescript infers that str is a string
 * });
 * ```
 */
export class EventEmitter<EventTypes extends { [eventName: string]: any }> {
  private readonly eventemitter = new NativeEventEmitter();

  /**
   * Check the listener count of a specific event
   *
   * @param event The event name
   */
  listenerCount<Event extends keyof EventTypes>(event: Event): number {
    return this.eventemitter.listenerCount(event as string);
  }

  /**
   * Emit a value to a specific event
   *
   * @param event The event name
   * @param value The value to emit
   */
  emit<Event extends keyof EventTypes>(
    event: Event,
    value: EventTypes[Event]
  ): void {
    this.eventemitter.emit(event as string, value);
  }

  /**
   * Add a listener to a specific event. Don't forget to unsubscribe from it!
   *
   * @param event The event name
   * @param listener A listener functino
   */
  addListener<Event extends keyof EventTypes>(
    event: Event,
    listener: Listener<EventTypes, Event>
  ): () => void {
    this.eventemitter.addListener(event as string, listener);
    return () => this.removeListener(event, listener);
  }

  /**
   * Removes the provided listener from the provided event
   *
   * @param event The event name
   * @param listener A listener function
   */
  removeListener<Event extends keyof EventTypes>(
    event: Event,
    listener: Listener<EventTypes, Event>
  ): void {
    this.eventemitter.removeListener(event as string, listener);
  }

  /**
   * Apply a function once for the next value
   *
   * @param event The event name
   * @param fn The function to apply once
   */
  once<Event extends keyof EventTypes>(
    event: Event,
    fn: Listener<EventTypes, Event>
  ): void {
    this.eventemitter.once(event as string, fn);
  }

  /**
   * Wait for the next value of the provided event
   *
   * @param event The event name
   */
  waitFor<Event extends keyof EventTypes>(
    event: Event
  ): Promise<EventTypes[Event]> {
    return new Promise<EventTypes[Event]>(resolve => this.once(event, resolve));
  }
}
