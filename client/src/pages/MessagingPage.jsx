import React, { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/ui/Navbar';
import api from '../services/api';
import { io } from 'socket.io-client';

const ENDPOINT = "http://localhost:2000";

const MessagingPage = () => {
  const { user } = useContext(AuthContext);
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socketConnected, setSocketConnected] = useState(false);
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io(ENDPOINT);
    
    if (user) {
      socketRef.current.emit("setup", user);
      socketRef.current.on("connected", () => setSocketConnected(true));
      socketRef.current.on("message received", (newMessageReceived) => {
        if (!activeConversation || activeConversation.conversationId !== newMessageReceived.conversationId) {
          // just notify or update unread in real app
        } else {
          setMessages([...messages, newMessageReceived]);
        }
      });
    }
    
    return () => {
      socketRef.current.disconnect();
    };
  }, [user, activeConversation, messages]);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await api.get('/messages/conversations');
        setConversations(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchConversations();
  }, []);

  const fetchMessages = async (conv) => {
    setActiveConversation(conv);
    try {
      const res = await api.get(`/messages/${conv.conversationId}/messages`);
      setMessages(res.data);
      socketRef.current.emit("join chat", conv.conversationId);
    } catch (err) {
      console.error(err);
    }
  };

  const sendMessage = async (e) => {
    if (e.key === 'Enter' && newMessage) {
      try {
        const res = await api.post('/messages/send', {
          receiverId: activeConversation.otherUser._id,
          content: newMessage,
          conversationId: activeConversation.conversationId
        });
        setNewMessage('');
        setMessages([...messages, res.data]);
        socketRef.current.emit("new message", res.data);
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-grow flex max-w-7xl mx-auto w-full p-4 h-[calc(100vh-64px)]">
        <div className="flex w-full bg-white rounded-xl shadow-card overflow-hidden border border-gray-100">
           {/* Sidebar */}
           <div className="w-1/3 border-r border-gray-200 flex flex-col">
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                 <h2 className="font-bold text-lg">Messages</h2>
              </div>
              <div className="flex-grow overflow-y-auto">
                 {conversations.map(conv => (
                    <div 
                      key={conv.conversationId} 
                      className={`p-4 border-b border-gray-100 cursor-pointer flex items-center hover:bg-gray-50 ${activeConversation?.conversationId === conv.conversationId ? 'bg-green-50 border-l-4 border-l-primary' : ''}`}
                      onClick={() => fetchMessages(conv)}
                    >
                       <img src={conv.otherUser?.avatar || `https://ui-avatars.com/api/?name=${conv.otherUser?.name}`} className="w-12 h-12 rounded-full mr-3" alt="" />
                       <div>
                          <p className="font-bold text-text-main">{conv.otherUser?.name}</p>
                          <p className="text-sm text-text-muted truncate w-40">{conv.lastMessage}</p>
                       </div>
                       {conv.unread && <div className="ml-auto w-3 h-3 bg-primary rounded-full"></div>}
                    </div>
                 ))}
                 {conversations.length === 0 && (
                    <div className="p-4 text-center text-text-muted">No conversations yet.</div>
                 )}
              </div>
           </div>

           {/* Chat Window */}
           <div className="w-2/3 flex flex-col">
              {activeConversation ? (
                 <>
                    <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center">
                       <img src={activeConversation.otherUser?.avatar || `https://ui-avatars.com/api/?name=${activeConversation.otherUser?.name}`} className="w-10 h-10 rounded-full mr-3" alt="" />
                       <h2 className="font-bold">{activeConversation.otherUser?.name}</h2>
                    </div>
                    <div className="flex-grow p-4 overflow-y-auto bg-slate-50 space-y-4">
                       {messages.map((m, i) => (
                          <div key={i} className={`flex ${m.sender._id === user._id ? 'justify-end' : 'justify-start'}`}>
                             <div className={`max-w-[70%] p-3 rounded-lg ${m.sender._id === user._id ? 'bg-primary text-white rounded-br-none' : 'bg-white text-text-main rounded-bl-none shadow-sm'}`}>
                                {m.content}
                             </div>
                          </div>
                       ))}
                    </div>
                    <div className="p-4 border-t border-gray-200 bg-white">
                       <input 
                         type="text" 
                         className="input-field w-full" 
                         placeholder="Type a message and press Enter..." 
                         value={newMessage}
                         onChange={e => setNewMessage(e.target.value)}
                         onKeyDown={sendMessage}
                       />
                    </div>
                 </>
              ) : (
                 <div className="flex-grow flex items-center justify-center text-text-muted bg-gray-50">
                    Select a conversation to start chatting
                 </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default MessagingPage;
