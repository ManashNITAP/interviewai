import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext.jsx';
import { authApi } from '../api/auth.api.js';

const SocketCtx = createContext(null);

export function SocketProvider({ children }) {
  const { user } = useAuth();
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!user) {
      socketRef.current?.disconnect();
      socketRef.current = null;
      setConnected(false);
      return;
    }
    let cancelled = false;
    let s;
    (async () => {
      try {
        const { data } = await authApi.socketTicket(); // proxied REST -> cookie works
        if (cancelled) return;
        const url = import.meta.env.VITE_SOCKET_URL || window.location.origin;
        s = io(url, {
          withCredentials: true,
          auth: { token: data.data.ticket },
          transports: ['websocket', 'polling'],
        });
        s.on('connect', () => setConnected(true));
        s.on('disconnect', () => setConnected(false));
        s.on('connect_error', (e) => console.warn('socket error', e.message));
        socketRef.current = s;
      } catch (e) {
        console.warn('socket ticket failed', e.message);
      }
    })();
    return () => { cancelled = true; s?.disconnect(); socketRef.current = null; };
  }, [user]);

  return (
    <SocketCtx.Provider value={{ socket: socketRef.current, connected }}>
      {children}
    </SocketCtx.Provider>
  );
}

export const useSocket = () => useContext(SocketCtx);
