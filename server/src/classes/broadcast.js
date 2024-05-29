// Broadcast.js
const io = require('socket.io-client');

class Broadcast {
    constructor() {
        this.socket = null;
    }

    async connect() {
        if (!this.socket) {
            this.socket = io(process.env.BROADCAST_SERVER, {
                autoConnect: false,
                reconnectionAttempts: 3, // Intentos de reconexión, por ejemplo
            });

            this.socket.on('connect', () => {
                console.log('Conectado con éxito al servidor Socket.io');
            });

            this.socket.on('connect_error', (error) => {
                console.error('Error al conectar:', error);
            });

            this.socket.on('error', (error) => {
                console.error('Error de socket:', error);
            });

            this.socket.open(); // Manualmente abrir la conexión
        }

        return new Promise((resolve, reject) => {
            if (this.socket.connected) {
                resolve();
            } else {
                const onConnect = () => {
                    this.socket.off('connect_error', onError);
                    this.socket.off('error', onError);
                    resolve();
                };

                const onError = (error) => {
                    this.socket.off('connect', onConnect);
                    reject(error);
                };

                this.socket.once('connect', onConnect);
                this.socket.once('connect_error', onError);
                this.socket.once('error', onError);
            }
        });
    }

    async run(event, data) {
        try {
            await this.connect();
            this.socket.emit(event, data);
            console.log(`Evento '${event}' emitido con éxito`);
        } catch (error) {
            console.error(`Error al emitir el evento '${event}':`, error);
        }
    }

    disconnect() {
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
    }
}

module.exports = Broadcast;
