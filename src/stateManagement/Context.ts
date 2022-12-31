type Callback = (...args: any[]) => void;

export class Context {
  events: {[key: string]: Callback[]} = {};

  register(eventName: string, callback: () => void) {
    if(!this.events[eventName]) {
      this.events[eventName] = [];
    }

    this.events[eventName].push(callback);
  }

  dispatch(name: string, ...args: any[]) {
    if(this.events[name]) {
      this.events[name].forEach(callback => {
        if(typeof callback === 'function') {
          callback(...args);
        }
      });
    }
  }
}