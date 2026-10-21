// SocketService.js
import io from 'socket.io-client';
import { SOCKET_URL } from './axios';

class SocketService {
  static instance = null;
  socket = null;
  socketUrl = SOCKET_URL;
  socketOptions = {};

  static getInstance() {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  configure({ url, options = {} }) {
    this.socketOptions = options;
  }

  initializeSocket = () => {
    return new Promise((resolve, reject) => {
      if (!this.socketUrl) return reject('Socket URL not configured');

      try {
        this.socket = io(this.socketUrl, {
          transports: ['websocket'],
          ...this.socketOptions,
        });

        this.socket.on('connect', () => {
          resolve(true);
        });

        this.socket.on('connect_error', (error) => {
          console.error('Connection error:', error);
          reject(error);
        });
      } catch (err) {
        reject(err);
      }
    });
  };

  emit(event, data, callback) {
    if (this.socket) {
      if (callback) {
        this.socket.emit(event, data, callback);
      } else {
        this.socket.emit(event, data);
      }
    }
  }

  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  disconnect() {
    console.log('Socket disconnected');
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export default SocketService.getInstance();
