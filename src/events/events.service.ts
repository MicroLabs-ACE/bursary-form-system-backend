import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class EventsService {
  private events = new Map<string, Observable<any>>();

  registerEvent(eventId: string, events$: Observable<any>) {
    this.events.set(eventId, events$);
  }

  getEvent(eventId: string) {
    return this.events.get(eventId) || new Observable();
  }
}
