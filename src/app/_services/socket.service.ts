import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

// models
import { User } from '../_models/user';
import { Message } from '../_models/message';
import { Group } from './../_models/group';
// import { Event } from '../_models/event';

import * as io from 'socket.io-client';

const SERVER_URL = 'http://localhost:3080';
const JWT_TOKEN = localStorage.getItem('currentUser');

@Injectable()
export class SocketService {

    private socket;

    public initSocket(): void {
        this.socket = io.connect(SERVER_URL ,
            {'extraHeaders': { Authorization: 'Bearer ' + JWT_TOKEN }}
        );
    }

    public disconnect(): void {
        this.socket.disconnect();
    }

    // region socket on
    public onSuccsess(): Observable<Group> {
        return new Observable<Group>(observer => {
            this.socket.on('success', ({groups, users}) => observer.next(groups));
        });
    }

    public onMessage(): Observable<Message> {
        return new Observable<Message>(observer => {
            this.socket.on('receiveMessage', (data: Message) => observer.next(data));
        });
    }
    // endregion

    // region socket emit
        public createChat(group: Group): void {
            this.socket.emit('createChat', ({name: group.name, users: group.users}));
        }

        public sendMessage(msg: Message): void {
            this.socket.emit('sendMessage', ({
                from: msg.sender,
                msg : msg.msg,
                group: msg.receiver
            }));
        }

        public leaveGroup(group: Group): void {
            this.socket.emit('leaveGroup', ({
                group: group
            }));
        }
    // endregion

    /*public onEvent(event: Event): Observable: any {
        return new Observable<Event>(observer => {
            this.socket.on(event, () => observer.next());
        });
    }*/
}
