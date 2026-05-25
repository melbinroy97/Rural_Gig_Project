import React, { useState, useEffect, useContext, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/ui/Navbar';
import api from '../services/api';
import { io } from 'socket.io-client';
import { Send, Image, MoreVertical, Shield, Smile, Sparkles } from 'lucide-react';
import { toast } from 'react-toastify';

const ENDPOINT = "http://localhost:2000";

const MessagingPage = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socketConnected, setSocketConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);

  const socketRef = useRef();
  const messagesEndRef = useRef(null);

  // Scroll to bottom on new messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, otherUserTyping]);

  useEffect(() => {
    socketRef.current = io(ENDPOINT);
    
    if (user) {
      socketRef.current.emit("setup", user);
      socketRef.current.on("connected", () => setSocketConnected(true));
      
      socketRef.current.on("user status update", (onlineUserIds) => {
        setOnlineUsers(onlineUserIds);
      });

      socketRef.current.on("typing", (room) => {
        if (activeConversation?.conversationId === room) {
          setOtherUserTyping(true);
        }
      });

      socketRef.current.on("stop typing", (room) => {
        if (activeConversation?.conversationId === room) {
          setOtherUserTyping(false);
        }
      });

      socketRef.current.on("message received", (newMessageReceived) => {
        if (activeConversation && activeConversation.conversationId === newMessageReceived.conversationId) {
          setMessages(prev => [...prev, newMessageReceived]);
        }
        // Refresh conversations list to update lastMessage
        fetchConversations();
      });
    }
    
    return () => {
      socketRef.current.disconnect();
    };
  }, [user, activeConversation]);

  const fetchConversations = async () => {
    try {
      const res = await api.get('/messages/conversations');
      setConversations(res.data);
      
      // If we came from WorkerProfile page requesting a chat
      if (location.state?.startChatWith) {
        const other = location.state.startChatWith;
        // Check if conversation already exists in active list
        const existingConv = res.data.find(c => c.otherUser._id === other._id);
        if (existingConv) {
          fetchMessages(existingConv);
        } else {
          // Setup a temporary conversation node
          const tempConv = {
            conversationId: null, // will create on first message
            otherUser: other,
            lastMessage: 'Start a new conversation...',
            updatedAt: new Date()
          };
          setActiveConversation(tempConv);
          setMessages([]);
        }
        // Clear history state to avoid loops
        location.state.startChatWith = null;
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchMessages = async (conv) => {
    setActiveConversation(conv);
    setOtherUserTyping(false);
    if (!conv.conversationId) {
      setMessages([]);
      return;
    }
    try {
      const res = await api.get(`/messages/${conv.conversationId}/messages`);
      setMessages(res.data);
      socketRef.current.emit("join chat", conv.conversationId);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load messages');
    }
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected || !activeConversation?.conversationId) return;

    if (!isTyping) {
      setIsTyping(true);
      socketRef.current.emit("typing", activeConversation.conversationId);
    }

    let lastTypingTime = new Date().getTime();
    const timerLength = 3000;
    setTimeout(() => {
      let timeNow = new Date().getTime();
      let timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && isTyping) {
        socketRef.current.emit("stop typing", activeConversation.conversationId);
        setIsTyping(false);
      }
    }, timerLength);
  };

  const handleSendMessage = async (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      if (!newMessage.trim()) return;

      try {
        socketRef.current.emit("stop typing", activeConversation.conversationId);
        setIsTyping(false);

        const res = await api.post('/messages/send', {
          receiverId: activeConversation.otherUser._id,
          content: newMessage,
          conversationId: activeConversation.conversationId
        });

        setNewMessage('');
        
        // If it was a new temp conversation, set the real conversationId returned
        if (!activeConversation.conversationId) {
          const updatedActive = { ...activeConversation, conversationId: res.data.conversationId };
          setActiveConversation(updatedActive);
          socketRef.current.emit("join chat", res.data.conversationId);
        }

        setMessages(prev => [...prev, res.data]);
        socketRef.current.emit("new message", res.data);
        fetchConversations();
      } catch (err) {
        console.error(err);
        toast.error('Could not deliver message');
      }
    }
  };

  const isOtherUserOnline = activeConversation && onlineUsers.includes(activeConversation.otherUser._id.toString());

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <div className="flex-grow flex max-w-7xl mx-auto w-full p-4 h-[calc(100vh-80px)]">
        <div className="flex w-full bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          
          {/* Sidebar Conversations */}
          <div className="w-1/3 border-r border-gray-100 flex flex-col bg-white">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-extrabold text-2xl text-text-main">Conversations</h2>
              <span className="bg-green-50 text-primary text-xs px-2.5 py-1 rounded-full font-black flex items-center gap-1">
                <Sparkles size={12} /> Secure
              </span>
            </div>
            
            <div className="flex-grow overflow-y-auto divide-y divide-gray-50">
              {conversations.map(conv => {
                const isOnline = onlineUsers.includes(conv.otherUser._id.toString());
                return (
                  <div 
                    key={conv.conversationId || conv.otherUser._id} 
                    className={`p-6 cursor-pointer flex items-center hover:bg-gray-50/50 transition-all duration-200 
                      ${activeConversation?.otherUser._id === conv.otherUser._id ? 'bg-green-50/40 border-l-4 border-l-primary' : ''}`}
                    onClick={() => fetchMessages(conv)}
                  >
                    <div className="relative flex-shrink-0 mr-4">
                      <img 
                        src={conv.otherUser?.avatar || `https://ui-avatars.com/api/?name=${conv.otherUser?.name}`} 
                        className="w-12 h-12 rounded-2xl object-cover bg-gray-100 border" 
                        alt="" 
                      />
                      {isOnline && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-secondary border-2 border-white rounded-full animate-pulse"></span>
                      )}
                    </div>
                    
                    <div className="flex-grow min-w-0">
                      <div className="flex justify-between items-baseline mb-1">
                        <p className="font-bold text-text-main text-base truncate">{conv.otherUser?.name}</p>
                        <span className="text-[10px] text-text-muted font-bold uppercase">
                          {conv.updatedAt ? new Date(conv.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                        </span>
                      </div>
                      <p className="text-sm text-text-muted truncate font-medium">{conv.lastMessage}</p>
                    </div>
                  </div>
                );
              })}
              
              {conversations.length === 0 && (
                <div className="p-8 text-center text-text-muted font-semibold">No active chat dialogues yet.</div>
              )}
            </div>
          </div>

          {/* Active Chat Panel */}
          <div className="w-2/3 flex flex-col bg-gray-50/55">
            {activeConversation ? (
              <>
                {/* Header */}
                <div className="p-6 border-b border-gray-100 bg-white flex items-center justify-between shadow-sm">
                  <div className="flex items-center">
                    <div className="relative mr-4">
                      <img src={activeConversation.otherUser?.avatar || `https://ui-avatars.com/api/?name=${activeConversation.otherUser?.name}`} className="w-11 h-11 rounded-2xl object-cover border" alt="" />
                      {isOtherUserOnline && (
                        <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-secondary border-2 border-white rounded-full"></span>
                      )}
                    </div>
                    <div>
                      <h2 className="font-extrabold text-text-main text-lg">{activeConversation.otherUser?.name}</h2>
                      <p className="text-xs text-text-muted font-semibold">
                        {isOtherUserOnline ? 'Active Now' : 'Offline'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="bg-green-50 text-primary text-[10px] px-3 py-1.5 rounded-full font-extrabold flex items-center gap-1">
                      <Shield size={12} /> Direct Escrow Chat
                    </div>
                    <button className="text-gray-400 hover:text-text-main p-2 rounded-xl hover:bg-gray-50 transition-colors"><MoreVertical size={18} /></button>
                  </div>
                </div>

                {/* Messages Bubble Stream */}
                <div className="flex-grow p-6 overflow-y-auto space-y-6 bg-slate-50/30">
                  {messages.map((m, i) => {
                    const isOwn = m.sender._id === user._id;
                    return (
                      <div key={i} className={`flex ${isOwn ? 'justify-end' : 'justify-start'} items-end space-x-2`}>
                        {!isOwn && (
                          <img src={m.sender.avatar || `https://ui-avatars.com/api/?name=${m.sender.name}`} className="w-8 h-8 rounded-xl object-cover border flex-shrink-0" alt="" />
                        )}
                        <div className={`max-w-[65%] p-4 rounded-2xl shadow-sm leading-relaxed text-sm font-semibold
                          ${isOwn 
                            ? 'bg-primary text-white rounded-br-none shadow-primary/5' 
                            : 'bg-white text-text-main rounded-bl-none border border-gray-100'}`}
                        >
                          <p>{m.content}</p>
                          <span className={`block text-[9px] mt-1.5 text-right font-medium
                            ${isOwn ? 'text-green-150' : 'text-text-muted'}`}
                          >
                            {new Date(m.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  
                  {otherUserTyping && (
                    <div className="flex justify-start items-center space-x-2">
                      <div className="bg-white p-3 rounded-2xl rounded-bl-none border border-gray-100 flex items-center space-x-1 shadow-sm">
                        <span className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100"></span>
                        <span className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200"></span>
                        <span className="w-2 h-2 bg-primary rounded-full animate-bounce delay-300"></span>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Bar */}
                <div className="p-6 border-t border-gray-100 bg-white shadow-lg">
                  <div className="flex items-center space-x-4 bg-gray-50 rounded-2xl p-2 border border-gray-100 focus-within:border-primary/30 transition-colors">
                    <button className="text-gray-400 hover:text-primary p-2 rounded-xl transition-colors"><Image size={20} /></button>
                    <button className="text-gray-400 hover:text-primary p-2 rounded-xl transition-colors"><Smile size={20} /></button>
                    
                    <input 
                      type="text" 
                      className="bg-transparent border-0 outline-none flex-grow text-sm font-semibold text-text-main placeholder-text-muted px-2"
                      placeholder="Type a message secure over RuralConnect..." 
                      value={newMessage}
                      onChange={handleTyping}
                      onKeyDown={handleSendMessage}
                    />
                    
                    <button 
                      onClick={handleSendMessage}
                      className="bg-primary hover:bg-primary-dark text-white p-3 rounded-xl shadow-md shadow-primary/20 hover:shadow-primary/35 transition-all flex items-center justify-center flex-shrink-0"
                    >
                      <Send size={16} />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-grow flex flex-col items-center justify-center text-text-muted bg-gray-50/50 p-8 text-center">
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6 text-primary border border-green-150">
                  <Shield size={32} />
                </div>
                <h4 className="font-extrabold text-xl text-text-main mb-2">End-to-End Encrypted Escrow Dialogues</h4>
                <p className="text-sm text-text-muted max-w-sm">Select any conversation on the left to review proposal parameters, negotiate rates, and verify task deliveries safely.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default MessagingPage;
