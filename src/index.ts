type Listener<T, Event extends keyof T> = (
  value: T[Event]
) => void | Promise<void>;

export class EventEmitter<T extends object> {
  private readonly listeners: Partial<
    {
      [key in keyof T]: (Listener<T, key>)[];
    }
  > = {};

  countListeners(): number {
    let sum = 0;
    for (const value of Object.values(this.listeners) as unknown[][]) {
      sum += value.length;
    }
    return sum;
  }

  emit<Event extends keyof T>(event: Event, value: T[Event]) {
    const listeners = this.listeners[event];

    if (listeners) {
      listeners.forEach(listener => listener(value));
    }
  }

  addListener<Event extends keyof T>(
    event: Event,
    onChange: Listener<T, Event>
  ) {
    let listeners = this.listeners[event];

    if (!listeners) {
      listeners = [];
      this.listeners[event] = listeners;
    }

    listeners.push(onChange) - 1;

    return () => this.removeListener(event, onChange);
  }

  removeListener<Event extends keyof T>(
    event: Event,
    onChange: Listener<T, Event>
  ) {
    let listeners = this.listeners[event];
    if (listeners) {
      const index = listeners.indexOf(onChange);
      if (index < 0) return;
      listeners.splice(index, 1);
    }
  }

  once<Event extends keyof T>(event: Event, fn: Listener<T, Event>) {
    const onChange: Listener<T, Event> = value => {
      fn(value);
      this.removeListener(event, onChange);
    };
    this.addListener(event, onChange);
  }

  waitFor<Event extends keyof T>(event: Event) {
    return new Promise<T[Event]>(resolve => this.once(event, resolve));
  }
}
