import NativeEventEmitter from 'events';

type Listener<T, Event extends keyof T> = (
  value: T[Event]
) => void | Promise<void>;

export class EventEmitter<T extends { [key: string]: any }> {
  private readonly eventemitter = new NativeEventEmitter();

  listenerCount<Event extends keyof T>(event: Event): number {
    return this.eventemitter.listenerCount(event as string);
  }

  emit<Event extends keyof T>(event: Event, value: T[Event]) {
    this.eventemitter.emit(event as string, value);
  }

  addListener<Event extends keyof T>(
    event: Event,
    onChange: Listener<T, Event>
  ) {
    this.eventemitter.addListener(event as string, onChange);
    return () => this.removeListener(event, onChange);
  }

  removeListener<Event extends keyof T>(
    event: Event,
    onChange: Listener<T, Event>
  ) {
    this.eventemitter.removeListener(event as string, onChange);
  }

  once<Event extends keyof T>(event: Event, fn: Listener<T, Event>) {
    this.eventemitter.once(event as string, fn);
  }

  waitFor<Event extends keyof T>(event: Event) {
    return new Promise<T[Event]>(resolve => this.once(event, resolve));
  }
}
