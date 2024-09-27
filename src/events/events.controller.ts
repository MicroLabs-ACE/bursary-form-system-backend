import { Controller, Param, Sse } from '@nestjs/common';
import { Observable } from 'rxjs';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
  constructor(private readonly eventService: EventsService) {}

  @Sse('/:eventId')
  getEvent(@Param('eventId') eventId: string): Observable<any> {
    console.log('Event ID:', eventId);
    return this.eventService.getEvent(eventId);
  }
}
