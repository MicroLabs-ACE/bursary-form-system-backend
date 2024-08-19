import { Injectable } from '@nestjs/common';

@Injectable()
export class SessionService {
  async setSessionData(request: any, reply: any, key: string, value: any) {
    request.session.set(key, value);
    reply.send({ message: 'Session data set successfully' });
  }

  async getSessionData(request: any, key: string) {
    const value = request.session.get(key);
    return value ? value : null;
  }

  async clearSession(request: any, reply: any) {
    request.session.delete();
    reply.send({ message: 'Session cleared successfully' });
  }
}
