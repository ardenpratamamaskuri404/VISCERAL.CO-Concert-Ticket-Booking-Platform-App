import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, User } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { socket } from '../App';
import api from '../api/axios';

export default function ChatWidget() {
  const { currentUser } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && currentUser) {
      loadMessages();
    }
  }, [isOpen, currentUser]);

  useEffect(() => {
    if (socket) {
      const handleNewMessage = (msg) => {
        if (
          msg.receiverId === currentUser?.id || 
          msg.senderId === currentUser?.id
        ) {
          setMessages((prev) => [...prev, msg]);
          scrollToBottom();
        }
      };
      socket.on('new_chat_message', handleNewMessage);
      return () => socket.off('new_chat_message', handleNewMessage);
    }
  }, [socket, currentUser]);

  const loadMessages = async () => {
    try {
      const res = await api.get('/chat');
      if (res.data && res.data.success) {
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
    if (!input.trim() || !currentUser) return;
    
    socket.emit('send_chat_message', {
      senderId: currentUser.id,
      senderRole: currentUser.role,
      message: input.trim(),
      receiverId: null // Support chat goes to all admins
    });
    
    setInput('');
  };

  if (!currentUser || currentUser.role !== 'CUSTOMER') return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="bg-white dark:bg-obsidian-card w-80 h-96 mb-4 rounded-2xl shadow-2xl border border-gray-200 dark:border-obsidian-border flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
          <div className="bg-obsidian border-b border-gold/30 text-gold p-4 flex justify-between items-center">
            <h3 className="font-bold flex items-center gap-2">
              <MessageCircle className="w-4 h-4" /> Customer Support
            </h3>
            <button onClick={() => setIsOpen(false)} className="hover:bg-gold/20 p-1 rounded-md transition-colors text-gray-300">
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-obsidian-surface">
            <div className="text-center text-[10px] text-gray-400 mb-4 px-4 leading-relaxed">
              Selamat datang di Layanan Bantuan Visceral. Tim dukungan kami siap membantu menjawab pertanyaan Anda terkait tiket dan pemesanan.
            </div>
            {messages.map((m, i) => {
              const isMine = m.senderId === currentUser.id;
              return (
                <div key={i} className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[85%] p-2.5 rounded-2xl text-xs ${isMine ? 'gold-gradient-btn text-obsidian font-medium rounded-tr-none shadow-gold-glow' : 'bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-tl-none border border-gray-300 dark:border-gray-700'}`}>
                    {!isMine && <span className="text-[9px] font-bold block mb-1 opacity-70">{m.sender?.role === 'SUPERADMIN' ? 'Superadmin' : 'Admin'}</span>}
                    {m.message}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 bg-white dark:bg-obsidian-card border-t border-gray-100 dark:border-obsidian-border flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Tulis pesan..."
              className="flex-1 bg-gray-100 dark:bg-obsidian-surface rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-gold"
            />
            <button onClick={handleSend} className="gold-gradient-btn text-obsidian p-2 rounded-xl hover:opacity-90 transition-opacity shadow-gold-glow">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 gold-gradient-btn text-obsidian rounded-full flex items-center justify-center shadow-gold-glow transition-all hover:scale-105"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>
    </div>
  );
}
