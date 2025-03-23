import { Observable } from '@babylonjs/core';
import { injectable } from 'inversify';

@injectable()
export class WorldManagerService {
  public readonly onInitObservable = new Observable();

  public notifyParallel() {
    const observerCallbacks = this.onInitObservable.observers.map((observer) =>
      observer.callback(undefined, undefined as never)
    );
    return Promise.all(observerCallbacks);
  }
}
