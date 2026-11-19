import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, getThemeColors } from '../src/constants/theme';
import { getSocket } from '../src/api/socket';
import { useAuth } from '../src/context/AuthContext';
import { useApp } from '../src/context/AppContext';
import { ChatMessage } from '../src/types';
import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';

export default function ChatScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { currentUser } = useAuth();
  const { chatMessages, fetchChatMessages, darkMode } = useApp();
  const theme = getThemeColors(darkMode);

  const [message, setMessage] = useState('');
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    fetchChatMessages();

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: false });
    }, 400);

    const showSub = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 120);
    });
    const hideSub = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  useEffect(() => {
    if (chatMessages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [chatMessages]);

  const handleSend = async () => {
    if (!message.trim()) return;

    const msgText = message.trim();
    setMessage('');

    try {
      const socket = getSocket();
      socket.emit('send_chat_message', {
        senderId: currentUser?.id,
        message: msgText,
        senderRole: currentUser?.role || 'CUSTOMER',
      });
    } catch (e) {
      console.warn('Failed to send message:', e);
      setMessage(msgText);
    }
  };

  const renderItem = ({ item }: { item: ChatMessage }) => {
    const isMe = item.senderId === currentUser?.id;

    return (
      <View
        style={{
          alignSelf: isMe ? 'flex-end' : 'flex-start',
          maxWidth: '80%',
          marginBottom: 14,
        }}
      >
        {!isMe && (
          <Text
            style={{
              color: theme.gold,
              fontSize: 10,
              fontWeight: '800',
              marginBottom: 4,
              marginLeft: 4,
            }}
          >
            CUSTOMER SUPPORT
          </Text>
        )}
        <View
          style={{
            backgroundColor: isMe ? Colors.gold : theme.card,
            borderWidth: isMe ? 0 : 1,
            borderColor: theme.border,
            paddingHorizontal: 14,
            paddingVertical: 10,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            borderBottomLeftRadius: isMe ? 16 : 4,
            borderBottomRightRadius: isMe ? 4 : 16,
          }}
        >
          <Text
            style={{
              color: isMe ? Colors.obsidian : theme.text,
              fontSize: 14,
              lineHeight: 20,
              fontWeight: isMe ? '600' : '400',
            }}
          >
            {item.message}
          </Text>
        </View>
        <Text
          style={{
            color: theme.textMuted,
            fontSize: 10,
            marginTop: 4,
            alignSelf: isMe ? 'flex-end' : 'flex-start',
            marginRight: isMe ? 4 : 0,
            marginLeft: !isMe ? 4 : 0,
          }}
        >
          {dayjs(item.createdAt).format('HH:mm')}
        </Text>
      </View>
    );
  };

  const bottomPadding = keyboardVisible
    ? 12
    : Math.max(insets.bottom + 14, 24);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      {/* Header */}
      <View
        style={{
          paddingHorizontal: 20,
          paddingTop: Math.max(insets.top + 12, 48),
          paddingBottom: 16,
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: theme.card,
          borderBottomWidth: 1,
          borderBottomColor: theme.border,
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            padding: 8,
            backgroundColor: theme.iconBg,
            borderRadius: 12,
            marginRight: 14,
          }}
        >
          <Ionicons name="arrow-back" size={22} color={theme.text} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={{ color: theme.text, fontSize: 17, fontWeight: '800' }}>
            Bantuan VISCERAL
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 }}>
            <View
              style={{
                width: 7,
                height: 7,
                borderRadius: 4,
                backgroundColor: Colors.success,
              }}
            />
            <Text style={{ color: Colors.success, fontSize: 12, fontWeight: '700' }}>
              Online
            </Text>
          </View>
        </View>
      </View>

      {/* Message List */}
      <FlatList
        ref={flatListRef}
        data={chatMessages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 20,
          paddingBottom: 20,
          flexGrow: 1,
        }}
        ListEmptyComponent={
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 40 }}>
            <Ionicons
              name="chatbubbles-outline"
              size={48}
              color={theme.border}
              style={{ marginBottom: 14 }}
            />
            <Text style={{ color: theme.textMuted, fontSize: 14, textAlign: 'center', lineHeight: 20 }}>
              Punya pertanyaan seputar tiket atau event?{'\n'}Kirim pesan, tim kami siap membantu Anda.
            </Text>
          </View>
        }
      />

      {/* Input Bar (dengan Safe Area bottom agar tidak menabrak navigation bar Android/iOS) */}
      <View
        style={{
          paddingHorizontal: 16,
          paddingTop: 12,
          paddingBottom: bottomPadding,
          backgroundColor: theme.card,
          borderTopWidth: 1,
          borderTopColor: theme.border,
          flexDirection: 'row',
          alignItems: 'flex-end',
          gap: 10,
        }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: theme.bg,
            borderRadius: 22,
            borderWidth: 1,
            borderColor: theme.border,
            paddingHorizontal: 16,
            paddingVertical: Platform.OS === 'ios' ? 8 : 2,
            minHeight: 46,
            justifyContent: 'center',
          }}
        >
          <TextInput
            style={{
              color: theme.text,
              fontSize: 14,
              maxHeight: 110,
              paddingVertical: 8,
            }}
            placeholder="Tulis pesan..."
            placeholderTextColor={theme.textMuted}
            value={message}
            onChangeText={setMessage}
            multiline
            maxLength={500}
            textAlignVertical="center"
          />
        </View>
        <TouchableOpacity
          onPress={handleSend}
          disabled={!message.trim()}
          style={{
            width: 46,
            height: 46,
            borderRadius: 23,
            backgroundColor: message.trim() ? Colors.gold : theme.border,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons
            name="send"
            size={18}
            color={message.trim() ? Colors.obsidian : theme.textMuted}
            style={{ marginLeft: 2 }}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
