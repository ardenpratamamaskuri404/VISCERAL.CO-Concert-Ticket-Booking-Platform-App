import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../src/constants/theme';
import api from '../src/api/axios';
import { getSocket } from '../src/api/socket';
import { useAuth } from '../src/context/AuthContext';
import { useApp } from '../src/context/AppContext';
import { ChatMessage } from '../src/types';
import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';

export default function ChatScreen() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const { chatMessages, fetchChatMessages } = useApp();
  const [message, setMessage] = useState('');
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    fetchChatMessages();
    
    // Auto scroll to bottom on load
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: false });
    }, 500);
  }, []);

  useEffect(() => {
    // Auto scroll when new message arrives
    if (chatMessages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [chatMessages]);

  const handleSend = async () => {
    if (!message.trim()) return;

    const msgText = message.trim();
    setMessage(''); // Optimistic clear

    try {
      const res = await api.post('/chat', { message: msgText });
      // We rely on the socket event to actually update the list
      // which is handled in AppContext
    } catch (e) {
      console.error('Failed to send message:', e);
      // Put message back if failed
      setMessage(msgText);
    }
  };

  const renderItem = ({ item }: { item: ChatMessage }) => {
    const isMe = item.senderId === currentUser?.id;
    
    return (
      <View style={{ 
        alignSelf: isMe ? 'flex-end' : 'flex-start',
        maxWidth: '80%',
        marginBottom: 16
      }}>
        {!isMe && (
          <Text style={{ color: Colors.gold, fontSize: 10, fontWeight: '800', marginBottom: 4, marginLeft: 4 }}>
            CUSTOMER SUPPORT
          </Text>
        )}
        <View style={{
          backgroundColor: isMe ? Colors.gold : Colors.darkSurface,
          padding: 12,
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          borderBottomLeftRadius: isMe ? 16 : 4,
          borderBottomRightRadius: isMe ? 4 : 16,
        }}>
          <Text style={{ 
            color: isMe ? Colors.obsidian : Colors.white, 
            fontSize: 14,
            fontWeight: isMe ? '600' : '400'
          }}>
            {item.message}
          </Text>
        </View>
        <Text style={{ 
          color: Colors.textMuted, 
          fontSize: 10, 
          marginTop: 4, 
          alignSelf: isMe ? 'flex-end' : 'flex-start',
          marginRight: isMe ? 4 : 0,
          marginLeft: !isMe ? 4 : 0
        }}>
          {dayjs(item.createdAt).format('HH:mm')}
        </Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1, backgroundColor: Colors.obsidian }} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={{ paddingHorizontal: 24, paddingTop: 60, paddingBottom: 20, flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.darkSurface, borderBottomWidth: 1, borderBottomColor: Colors.darkBorder }}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 8, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12, marginRight: 16 }}>
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <View>
          <Text style={{ color: Colors.white, fontSize: 18, fontWeight: '800' }}>Bantuan VISCERAL</Text>
          <Text style={{ color: Colors.success, fontSize: 12, fontWeight: '700', marginTop: 2 }}>Online</Text>
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        data={chatMessages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 40 }}>
            <Ionicons name="chatbubbles-outline" size={48} color={Colors.darkBorder} style={{ marginBottom: 16 }} />
            <Text style={{ color: Colors.textMuted, fontSize: 14, textAlign: 'center' }}>
              Punya pertanyaan seputar tiket atau event?{'\n'}Kirim pesan, tim kami siap membantu Anda.
            </Text>
          </View>
        }
      />

      <View style={{ padding: 16, backgroundColor: Colors.darkSurface, borderTopWidth: 1, borderTopColor: Colors.darkBorder, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <View style={{ flex: 1, backgroundColor: Colors.obsidian, borderRadius: 20, borderWidth: 1, borderColor: Colors.darkBorder, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16 }}>
          <TextInput
            style={{ flex: 1, color: Colors.white, paddingVertical: 12, fontSize: 14 }}
            placeholder="Tulis pesan..."
            placeholderTextColor={Colors.textMuted}
            value={message}
            onChangeText={setMessage}
            multiline
            maxLength={500}
          />
        </View>
        <TouchableOpacity 
          onPress={handleSend}
          disabled={!message.trim()}
          style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: message.trim() ? Colors.gold : Colors.darkBorder, alignItems: 'center', justifyContent: 'center' }}
        >
          <Ionicons name="send" size={18} color={message.trim() ? Colors.obsidian : Colors.textMuted} style={{ marginLeft: 4 }} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
