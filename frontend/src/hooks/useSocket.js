import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

export default function useSocket(url) {
  const socketRef = useRef(null);
  const [announcements, setAnnouncements] = useState([]);
  const socketUrl = url ?? import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5050';

  useEffect(() => {
    const s = io(socketUrl, { withCredentials: true });
    socketRef.current = s;
    s.on('announcement', (payload) => setAnnouncements((a) => [payload, ...a].slice(0, 20)));
    return () => { s.close(); };
  }, [socketUrl]);

  const announce = (message) => socketRef.current?.emit('announce', message);
  return { announcements, announce };
}
