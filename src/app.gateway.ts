import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'

@WebSocketGateway(3003)
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect{
    @WebSocketServer()
    wss;
    
    handleConnection(client){
        console.log('Client discconected');
    }

    handleDisconnect(){
        console.log('Client discconected');
    }
}