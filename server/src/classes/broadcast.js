class Broadcast {
    // constructor() {
    //     this.socket = null;
    // }

    // async connect() {
    //     if (!this.socket) {
    //         this.socket = require('socket.io-client')(process.env.BROADCAST_SERVER);
            
    //         this.socket.on('connect', () => {
    //             console.log('Conectado con éxito al servidor Socket.io');
    //         });

    //         this.socket.on('connect_error', (error) => {
    //             console.error('Error al conectar:', error);
    //             this.socket.close();
    //         });

    //         this.socket.on('error', (error) => {
    //             console.error('Error de socket:', error);
    //             this.socket.close();
    //         });
    //     }

    //     return new Promise((resolve, reject) => {
    //         if (this.socket.connected) {
    //             resolve();
    //         } else {
    //             this.socket.on('connect', resolve);
    //             this.socket.on('connect_error', reject);
    //             this.socket.on('error', reject);
    //         }
    //     });
    // }

    // async run(event, data) {
    //     try {
    //         await this.connect();
    //         this.socket.emit(event, data);
    //         console.log(`Evento '${event}' emitido con éxito`);
    //     } catch (error) {
    //         console.error(`Error al emitir el evento '${event}':`, error);
    //     } finally {
    //         if (this.socket) {
    //             this.socket.close();
    //             this.socket = null;
    //         }
    //     }
    // }
}

module.exports = Broadcast;
