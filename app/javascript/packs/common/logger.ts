enum Level {
  ALL = 0,
  TRACE = 1,
  DATA = 2,
  DEBUG = 3,
  INFO = 4,
  ERROR = 5,
}

class Logger {

  private output = console;
  private verbosity = process.env.SHOPPU_API_URL ? Level.ERROR : Level.ALL;

  private level: Level;
  private component: string;
  private block: string;

  constructor() {
    this.resetPrefix();
  }

  public of(name: string, block?: string): Logger {
    this.component = name;

    if (block) {
      this.block = `#${block}`;
    }

    return this;
  }

  public trace(msg = '') {
    this.level = Level.TRACE;
    this.printToLog(`${this.prefix} ${msg}`);
  }

  public data(name: string, value: any) {
    this.level = Level.DATA;
    this.printToLog(`${this.prefix} ${name} = `, value);
  }

  public debug(msg: string) {
    this.level = Level.DEBUG;
    this.printToLog(`${this.prefix} ${msg}`);
  }

  public info(msg: string) {
    this.level = Level.INFO;
    this.printToLog(`${this.prefix} ${msg}`);
  }

  public error(obj: any) {
    this.level = Level.ERROR;
    this.printToLog(`${this.prefix}`, obj);
  }

  private get prefix() {
    let code: string;

    switch (this.level) {
      case Level.TRACE:
        code = 'TRACE';
        break;
      case Level.DATA:
        code = 'DATA';
        break;
      case Level.DEBUG:
        code = 'DEBUG';
        break;
      case Level.INFO:
        code = 'INFO';
        break;
      case Level.ERROR:
        code = 'ERROR';
        break;
      default:
        code = 'UNDEFINED';
    }

    return `[${code}] <${this.component}${this.block}>`;
  }

  private resetPrefix() {
    this.level = Level.DEBUG;
    this.component = 'Logger';
    this.block = '';
  }

  private printToLog(...args: any[]) {
    if (this.output && (this.level.valueOf() > this.verbosity.valueOf())) {
      this.output.log(...args);
      this.resetPrefix();
    }
  }
}

export let logger = new Logger();
