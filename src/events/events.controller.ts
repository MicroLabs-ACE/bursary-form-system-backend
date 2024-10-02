import { Controller, Param, Sse } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { EventsService } from './events.service';

@ApiTags('Events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventService: EventsService) {}

  @ApiOperation({ summary: 'Server-Sent Events for notifications' })
  @Sse('/:eventId')
  getEvent(@Param('eventId') eventId: string): Observable<any> {
    return this.eventService.getEvent(eventId);
  }
}
