import React, { createContext, useContext, useState, ReactNode, useEffect, useRef } from "react";
import io from 'socket.io-client';
import { api } from "../../../shared/utils/api";

interface UnreadMessagesContextType {
  unreadMessages: Record<string, number>;
  messageCounts: Record<string, number>;
  incrementUnread: (ticketId: string) => void;
  clearUnread: (ticketId: string) => void;
  updateMessageCount: (ticketId: string, count: number) => void;
  checkForNewMessages: (tickets: any[]) => void;
  openChatTicketId: string | null;
  setOpenChatTicketId: (ticketId: string | null) => void;
  joinTickets: (ticketIds: string[]) => void;
}

const UnreadMessagesContext = createContext<UnreadMessagesContextType | undefined>(undefined);

export const UnreadMessagesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [unreadMessages, setUnreadMessages] = useState<Record<string, number>>({});
  const [messageCounts, setMessageCounts] = useState<Record<string, number>>({});
  const [openChatTicketId, setOpenChatTicketId] = useState<string | null>(null);
  const socketRef = useRef<any>(null);

  // Load message counts from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('ticketMessageCounts');
    if (stored) {
      try {
        setMessageCounts(JSON.parse(stored));
      } catch (error) {
        console.error('Failed to parse stored message counts:', error);
      }
    }
  }, []);

  // Save message counts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('ticketMessageCounts', JSON.stringify(messageCounts));
  }, [messageCounts]);

  const incrementUnread = (ticketId: string) => {
    setUnreadMessages((prev) => {
      const newCount = (prev[ticketId] || 0) + 1;
      console.log('incrementUnread:', ticketId, 'from', prev[ticketId] || 0, 'to', newCount);
      return {
        ...prev,
        [ticketId]: newCount,
      };
    });
  };

  const clearUnread = (ticketId: string) => {
    setUnreadMessages((prev) => {
      console.log('clearUnread for ticket:', ticketId, 'current unread:', prev);
      const updated = { ...prev };
      delete updated[ticketId];
      console.log('after clear:', updated);
      return updated;
    });
  };

  const updateMessageCount = (ticketId: string, count: number) => {
    setMessageCounts((prev) => ({
      ...prev,
      [ticketId]: count,
    }));
  };

  const checkForNewMessages = (tickets: any[]) => {
    tickets.forEach((ticket) => {
      const currentCount = ticket.messages?.length || 0;
      const storedCount = messageCounts[ticket._id] || 0;

      if (currentCount > storedCount) {
        // New messages detected
        const newMessages = currentCount - storedCount;
        setUnreadMessages((prev) => ({
          ...prev,
          [ticket._id]: (prev[ticket._id] || 0) + newMessages,
        }));
        console.log(`New messages detected for ticket ${ticket._id}: ${newMessages}`);
      }

      // Update stored count
      updateMessageCount(ticket._id, currentCount);
    });
  };

  const joinTickets = (ticketIds: string[]) => {
    console.log('joinTickets called with:', ticketIds);
    if (!socketRef.current) {
      socketRef.current = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');
      socketRef.current.on('connect', () => {
        console.log('Global socket connected for unread messages');
        socketRef.current.emit('join_tickets', ticketIds);
      });

      socketRef.current.on('receive_message', (data: { ticketId: string; message: string; sender: string; timestamp: string }) => {
        console.log('Global socket received message:', data);
        // Increment unread count if the chat for this ticket is not open
        if (openChatTicketId !== data.ticketId) {
          console.log('Incrementing unread for ticket:', data.ticketId);
          incrementUnread(data.ticketId);
        } else {
          console.log('Chat is open for ticket:', data.ticketId, 'not incrementing');
        }
      });

      socketRef.current.on('disconnect', () => {
        console.log('Global socket disconnected');
      });
    } else {
      // If already connected, join additional tickets
      console.log('Already connected, joining additional tickets:', ticketIds);
      socketRef.current.emit('join_tickets', ticketIds);
    }
  };

  // New effect to fetch user's tickets and join rooms on mount if authenticated
  useEffect(() => {
    const userData = localStorage.getItem("user");
    console.log('UnreadMessagesContext useEffect, userData:', !!userData);
    if (userData) {
      const fetchUserTickets = async () => {
        try {
          const { data } = await api.get("/tickets");
          console.log('Fetched tickets:', data);
          if (data.success) {
            const ticketIds = data.tickets.map((ticket: any) => ticket._id);
            console.log('Ticket IDs to join:', ticketIds);
            joinTickets(ticketIds);
          }
        } catch (error) {
          console.error("Failed to fetch user tickets for socket join:", error);
        }
      };
      fetchUserTickets();
    }
  }, []);

  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  return (
    <UnreadMessagesContext.Provider value={{
      unreadMessages,
      messageCounts,
      incrementUnread,
      clearUnread,
      updateMessageCount,
      checkForNewMessages,
      openChatTicketId,
      setOpenChatTicketId,
      joinTickets
    }}>
      {children}
    </UnreadMessagesContext.Provider>
  );
};

export const useUnreadMessages = (): UnreadMessagesContextType => {
  const context = useContext(UnreadMessagesContext);
  if (!context) {
    throw new Error("useUnreadMessages must be used within an UnreadMessagesProvider");
  }
  return context;
};
