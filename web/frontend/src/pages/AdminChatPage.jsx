import React, { useState, useEffect, useRef } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminTopbar from '../components/AdminTopbar';
import { useStore } from '../context/StoreContext';
import { socket } from '../App';
import api from '../api/axios';
import { MessageCircle, Send, User } from 'lucide-react';

export default function AdminChatPage() {
  const { currentUser } = useStore();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadMessages();
  }, []);

  useEffect(() => {
    if (socket) {
      const handleNewMessage = (msg) => {
        setMessages((prev) => [...prev, msg]);
        scrollToBottom();
      };
      socket.on('new_chat_message', handleNewMessage);
      return () => socket.off('new_chat_message', handleNewMessage);
    }
  }, [socket]);

  const loadMessages = async () => {
    try {
      const res = await api.get('/chat');
      if (res.data?.success) {
        setMessages(res.data.chats);
        scrollToBottom();
      }
    } catch (e) {
      console.error('Failed to load chats:', e);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSend = () => {
    if (!input.trim() || !selectedUser) return;
    
    socket.emit('send_chat_message', {
      senderId: currentUser.id,
      senderRole: currentUser.role,
      message: input.trim(),
      receiverId: selectedUser // Send specifically to the user
    });
    
    setInput('');
  };

  // Group messages by customer
  const groupedChats = messages.reduce((acc, msg) => {
    const isCustomer = msg.sender?.role === 'CUSTOMER';
    const customerId = isCustomer ? msg.senderId : msg.receiverId;
    const customerName = isCustomer ? msg.sender.fullName : 'Customer';
    
    if (customerId) {
      if (!acc[customerId]) acc[customerId] = { id: customerId, name: customerName, msgs: [] };
      acc[customerId].msgs.push(msg);
      // Update name if we get a better one
      if (isCustomer) acc[customerId].name = msg.sender.fullName;
    }
    return acc;
  }, {});

  const activeChatList = selectedUser ? groupedChats[selectedUser]?.msgs || [] : [];

  return (
    <div className="min-h-screen bg-brand-bgLight dark:bg-obsidian-dark flex transition-colors">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopbar title="Customer Support" />
        
        <main className="p-6 md:p-8 flex-1 flex overflow-hidden h-[calc(100vh-4rem)]">
          
          {/* Sidebar Chat List */}
          <div className="w-1/3 border-r border-gray-200 dark:border-obsidian-border bg-white dark:bg-obsidian-card rounded-l-3xl overflow-y-auto">
            <div className="p-4 border-b border-gray-200 dark:border-obsidian-border">
              <h3 className="font-extrabold text-sm flex items-center gap-2"><MessageCircle className="w-4 h-4 text-gold" /> Daftar Percakapan</h3>
            </div>
            {Object.values(groupedChats).map(chat => (
              <button 
                key={chat.id}
                onClick={() => setSelectedUser(chat.id)}
                className={`w-full text-left p-4 border-b border-gray-100 dark:border-obsidian-surface hover:bg-gray-50 dark:hover:bg-obsidian-surface transition-colors ${selectedUser === chat.id ? 'bg-gold/10 border-l-4 border-l-gold' : ''}`}
              >
                <div className="font-bold text-xs">{chat.name}</div>
                <div className="text-[10px] text-gray-500 truncate mt-1">
                  {chat.msgs[chat.msgs.length - 1]?.message}
                </div>
              </button>
            ))}
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col bg-gray-50 dark:bg-obsidian-surface rounded-r-3xl relative">
            {selectedUser ? (
              <>
                <div className="p-4 bg-white dark:bg-obsidian-card border-b border-gray-200 dark:border-obsidian-border rounded-tr-3xl">
                  <h3 className="font-bold text-sm">Chat dengan {groupedChats[selectedUser]?.name}</h3>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {activeChatList.map((m, i) => {
                    const isMine = m.senderId === currentUser.id;
                    return (
                      <div key={i} className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                        <div className={`max-w-[70%] p-3 rounded-2xl text-xs ${isMine ? 'gold-gradient-btn text-obsidian font-medium rounded-tr-none shadow-gold-glow' : 'bg-white dark:bg-obsidian-card border border-gray-200 dark:border-obsidian-border text-gray-900 dark:text-white rounded-tl-none'}`}>
                          {!isMine && <span className="text-[9px] font-bold block mb-1 opacity-50">{m.sender?.fullName}</span>}
                          {m.message}
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
                <div className="p-4 bg-white dark:bg-obsidian-card rounded-br-3xl border-t border-gray-200 dark:border-obsidian-border flex gap-2">
                  <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Balas pesan customer..."
                    className="flex-1 bg-gray-100 dark:bg-obsidian-surface rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-gold"
                  />
                  <button onClick={handleSend} className="gold-gradient-btn text-obsidian px-4 rounded-xl hover:opacity-90 transition-opacity shadow-gold-glow">
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-400 text-xs">
                Pilih percakapan dari panel sebelah kiri
              </div>
            )}
          </div>

        </main>
      </div>
    </div>
  );
}
