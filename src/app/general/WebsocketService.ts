import { IMessage, RxStomp } from '@stomp/rx-stomp';
import { Observable, Subscription, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { JuegoService } from '../juego-service.service';
import { GeneralComponent } from './general.component';

@Injectable({
    providedIn: 'root',
})
export class WebSocketService {

    private rxStomp: RxStomp;
    public wsSessionId: number;
    public subscriptions: { topic: string, subscription: Subscription }[] = [];
    constructor(private juegoService: JuegoService, private generalComponent: GeneralComponent) {
        this.initialLoad();
    }
    private initialLoad() {
        this.juegoService.csrf().subscribe((csrf) => {
            this.rxStomp = new RxStomp();
            this.rxStomp.configure({
                webSocketFactory: () => new WebSocket("ws://localhost:8080/ws"),
                connectHeaders: {
                    'X-CSRF-TOKEN': csrf.token
                },
                reconnectDelay: 5000,
            });
            this.rxStomp.activate();

            this.handleReconnection();
        });
    }
    private handleReconnection() {
        this.rxStomp.connected$.subscribe(() => {
            this.juegoService.getSubscriptionsFromServer(this.wsSessionId).subscribe(topics => {
                if (topics.length === 0 && this.subscriptions.length > 0) {
                    topics = this.subscriptions.map(sub => sub.topic);
                    this.subscriptions.forEach(sub => sub.subscription.unsubscribe());
                }
                this.subscriptions = [];
                topics.forEach(topic => {
                    const sub = this.rxStomp.watch(topic).subscribe((message: IMessage) => {
                        this.generalComponent.handleWebsocketSub(message);
                    });
                    this.subscriptions.push({ topic: topic, subscription: sub });
                });
            });
        });
    }


    connectToSocket(topic: string): Observable<IMessage> {

        return this.rxStomp.watch(topic)
    }

    disconnect() {
        this.subscriptions.forEach(sub => sub.subscription.unsubscribe());
        this.rxStomp.deactivate().then(() => {
        });
    }
}