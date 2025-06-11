"use client";

import React, { useEffect, useState, useRef } from "react";
import { Message, Ticket } from "@/types/chat";
import { chatService } from "@/services/chat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Send, Bot, User, Plus, Smile, Paperclip, Image as ImageIcon, Video, X } from "lucide-react";
import { fetchApi } from "@/lib/fetchApi";
import { formatPhoneNumber } from "@/lib/utils";
import Image from "next/image";
import "../app/globals.css";

interface ChatProps {
  ticket: Ticket;
  handleChangeStatus: () => Promise<void>;
}

export function Chat({ ticket, handleChangeStatus }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoadingInitial, setIsLoadingInitial] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [activeEmojiCategory, setActiveEmojiCategory] = useState<keyof typeof emojiCategories>('faces');

  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // Emojis organizados por categorias
  const emojiCategories = {
    faces: {
      name: 'Rostos',
      icon: '😀',
      emojis: [
        "😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇",
        "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "😚",
        "😋", "😛", "😝", "😜", "🤪", "🤨", "🧐", "🤓", "😎", "🤩",
        "🥳", "😏", "😒", "😞", "😔", "😟", "😕", "🙁", "☹️", "😣",
        "😖", "😫", "😩", "🥺", "😢", "😭", "😤", "😠", "😡", "🤬",
        "🤯", "😳", "🥵", "🥶", "😱", "😨", "😰", "😥", "😓", "🤗"
      ]
    },
    gestures: {
      name: 'Gestos',
      icon: '👍',
      emojis: [
        "👍", "👎", "👌", "🤌", "🤏", "✌️", "🤞", "🤟", "🤘", "🤙",
        "👈", "👉", "👆", "🖕", "👇", "☝️", "👋", "🤚", "🖐️", "✋",
        "🖖", "👏", "🙌", "🤝", "🙏", "✍️", "💪", "🦾", "🦿", "🦵",
        "🦶", "👂", "🦻", "👃", "🧠", "🫀", "🫁", "🦷", "🦴", "👀",
        "👁️", "👅", "👄", "💋", "🩸", "👶", "🧒", "👦", "👧", "🧑"
      ]
    },
    animals: {
      name: 'Animais',
      icon: '🐶',
      emojis: [
        "🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯",
        "🦁", "🐮", "🐷", "🐽", "🐸", "🐵", "🙈", "🙉", "🙊", "🐒",
        "🐔", "🐧", "🐦", "🐤", "🐣", "🐥", "🦆", "🦅", "🦉", "🦇",
        "🐺", "🐗", "🐴", "🦄", "🐝", "🐛", "🦋", "🐌", "🐞", "🐜",
        "🦟", "🦗", "🕷️", "🦂", "🐢", "🐍", "🦎", "🦖", "🦕", "🐙"
      ]
    },
    food: {
      name: 'Comida',
      icon: '🍕',
      emojis: [
        "🍎", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🫐", "🍈", "🍒",
        "🍑", "🥭", "🍍", "🥥", "🥝", "🍅", "🍆", "🥑", "🥦", "🥬",
        "🥒", "🌶️", "🫑", "🌽", "🥕", "🫒", "🧄", "🧅", "🥔", "🍠",
        "🥐", "🍞", "🥖", "🥨", "🧀", "🥚", "🍳", "🧈", "🥞", "🧇",
        "🥓", "🥩", "🍗", "🍖", "🦴", "🌭", "🍔", "🍟", "🍕", "🥪"
      ]
    },
    activities: {
      name: 'Atividades',
      icon: '⚽',
      emojis: [
        "⚽", "🏀", "🏈", "⚾", "🥎", "🎾", "🏐", "🏉", "🥏", "🎱",
        "🪀", "🏓", "🏸", "🏒", "🏑", "🥍", "🏏", "🪃", "🥅", "⛳",
        "🪁", "🏹", "🎣", "🤿", "🥊", "🥋", "🎽", "🛹", "🛷", "⛸️",
        "🥌", "🎿", "⛷️", "🏂", "🪂", "🏋️", "🤼", "🤸", "⛹️", "🤺",
        "🏇", "🧘", "🏄", "🏊", "🤽", "🚣", "🧗", "🚵", "🚴", "🏆"
      ]
    },
    objects: {
      name: 'Objetos',
      icon: '💎',
      emojis: [
        "⌚", "📱", "📲", "💻", "⌨️", "🖥️", "🖨️", "🖱️", "🖲️", "🕹️",
        "🗜️", "💽", "💾", "💿", "📀", "📼", "📷", "📸", "📹", "🎥",
        "📽️", "🎞️", "📞", "☎️", "📟", "📠", "📺", "📻", "🎙️", "🎚️",
        "🎛️", "🧭", "⏱️", "⏲️", "⏰", "🕰️", "⌛", "⏳", "📡", "🔋",
        "🪫", "🔌", "💡", "🔦", "🕯️", "🪔", "🧯", "🛢️", "💸", "💵"
      ]
    },
    symbols: {
      name: 'Símbolos',
      icon: '❤️',
      emojis: [
        "❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔",
        "❣️", "💕", "💞", "💓", "💗", "💖", "💘", "💝", "💟", "☮️",
        "✝️", "☪️", "🕉️", "☸️", "✡️", "🔯", "🕎", "☯️", "☦️", "🛐",
        "⭐", "🌟", "✨", "⚡", "☄️", "💫", "🔥", "💯", "✅", "❌",
        "❎", "➕", "➖", "➗", "✖️", "🟰", "💲", "💱", "™️", "©️"
      ]
    }
  };

  useEffect(() => {
    const loadMessages = async () => {
      try {
        setIsLoadingInitial(true);
        setError(null);
        const response = await fetchApi(`/api/tickets/${ticket.id}/messages`);
        const loadedMessages = await response.json();
        setMessages(loadedMessages);
        chatService.markAsRead(ticket.id);
      } catch (error) {
        console.error("Chat: Erro ao carregar mensagens:", error);
        setError("Não foi possível carregar as mensagens. Tente novamente.");
      } finally {
        setIsLoadingInitial(false);
      }
    };

    // Conectar ao chat e carregar mensagens
    chatService.connect();
    loadMessages();

    // Configurar listener para novas mensagens
    const unsubscribe = chatService.onNewMessage((message) => {
      if (message.ticketId === ticket.id) {
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => {
      unsubscribe();
      chatService.disconnect();
    };
  }, [ticket.id]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.options-menu')) {
        setShowOptions(false);
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      setIsSendingMessage(true);
      setError(null);
      const response = await fetchApi(`/api/tickets/${ticket.id}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: newMessage,
          sender: "USER",
        }),
      });
      const newMessageData = await response.json();
      setMessages((prev) => [...prev, newMessageData]);
      chatService.sendMessage(ticket.id, newMessageData);
      chatService.markAsRead(ticket.id);
      setNewMessage("");
    } catch (error) {
      console.error("Chat: Erro ao enviar mensagem:", error);
      setError("Não foi possível enviar a mensagem. Tente novamente.");
    } finally {
      setIsSendingMessage(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleEmojiClick = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleFileUpload = (type: 'file' | 'image' | 'video') => {
    setShowOptions(false);
    if (type === 'file' && fileInputRef.current) {
      fileInputRef.current.click();
    } else if (type === 'image' && imageInputRef.current) {
      imageInputRef.current.click();
    } else if (type === 'video' && videoInputRef.current) {
      videoInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const file = event.target.files?.[0];
    if (file) {
      // Aqui você pode implementar a lógica de upload do arquivo
      console.log(`Uploading ${type}:`, file.name);
      // Por enquanto, vamos apenas mostrar o nome do arquivo na mensagem
      setNewMessage(prev => prev + `📎 ${file.name}`);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white-warm">
      {/* Nível 1: Header */}
      <div className="flex border-b border-white-warm pl-4 bg-white-pure shadow-white-soft">
        <div className="flex items-center gap-3 p-4">
          <div className="relative">
            <Image
              src={ticket.customer.avatar || "/default-avatar.svg"}
              alt={ticket.customer.name}
              width={40}
              height={40}
              className="rounded-full border-2 border-white-warm"
            />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white-pure"></div>
          </div>
          <div>
            <h2 className="text-lg font-semibold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              {ticket.customer.name}
            </h2>
            <p className="text-sm text-muted-foreground">
              {formatPhoneNumber(ticket.customer.phone)}
            </p>
          </div>
        </div>
        {chatService.getUnreadCount(ticket.id) > 0 && (
          <div className="ml-auto p-4 flex items-center">
            <span className="bg-gradient-to-r from-primary to-secondary text-white rounded-full px-3 py-1 text-xs font-medium elevated-1">
              {chatService.getUnreadCount(ticket.id)} nova(s)
            </span>
          </div>
        )}
      </div>

      {/* Nível 3: Área de mensagens */}
      <ScrollArea className="flex-1 p-4 bg-white-warm">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 elevated-1">
            {error}
            <Button
              variant="link"
              className="ml-2 text-red-700 hover:text-red-800"
              onClick={() => setError(null)}
            >
              Fechar
            </Button>
          </div>
        )}

        {isLoadingInitial ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-cool-teal flex items-center justify-center mb-4">
              <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
            <p className="text-muted-foreground">Carregando mensagens...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                ref={scrollRef}
                key={index}
                className={`flex ${
                  message.sender === "AI" || message.sender === "USER"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div className={`flex items-end gap-2 max-w-[70%] ${
                  message.sender === "AI" || message.sender === "USER"
                    ? "flex-row-reverse"
                    : "flex-row"
                }`}>
                  {/* Avatar do remetente */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold ${
                    message.sender === "AI" 
                      ? "bg-gradient-to-r from-purple-500 to-purple-600" 
                      : message.sender === "USER"
                      ? "bg-gradient-to-r from-primary to-secondary"
                      : "bg-gradient-to-r from-gray-400 to-gray-500"
                  }`}>
                    {message.sender === "AI" ? (
                      <Bot className="w-4 h-4" />
                    ) : message.sender === "USER" ? (
                      <User className="w-4 h-4" />
                    ) : (
                      ticket.customer.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  
                  {/* Mensagem */}
                  <div
                    className={`break-words whitespace-pre-wrap rounded-2xl p-4 elevated-1 ${
                      message.sender === "AI"
                        ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white"
                        : message.sender === "USER"
                        ? "bg-gradient-to-r from-primary to-purple-600 text-white"
                        : "bg-white-pure border border-white-warm"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.message}</p>
                    <p className={`text-xs mt-2 ${
                      message.sender === "AI" || message.sender === "USER"
                        ? "text-white/70"
                        : "text-muted-foreground"
                    }`}>
                      {formatDate(message.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Nível 1: Footer */}
      <div className="p-4 border-t border-white-warm bg-white-pure shadow-white-soft">
        {/* Inputs de arquivo ocultos */}
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={(e) => handleFileChange(e, 'file')}
        />
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFileChange(e, 'image')}
        />
        <input
          ref={videoInputRef}
          type="file"
          accept="video/*"
          className="hidden"
          onChange={(e) => handleFileChange(e, 'video')}
        />

        <div className="flex gap-3">
          {ticket.status === "AI" ? (
            <div className="flex w-full items-center justify-center gap-6">
              <p className="text-muted-foreground font-medium">Atualizar status:</p>
              <div className="flex gap-3">
                <Button 
                  onClick={handleChangeStatus}
                  className="bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 elevated-1"
                >
                  Atender Cliente
                </Button>
                <Button 
                  variant="destructive"
                  className="elevated-1"
                >
                  Finalizar Atendimento
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex w-full gap-2">
              {/* Botão de opções */}
              <div className="relative options-menu">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowOptions(!showOptions)}
                  className="hover-brand-orange elevated-1"
                >
                  <Plus className="h-4 w-4" />
                </Button>
                
                {/* Menu de opções */}
                {showOptions && (
                  <div className="absolute bottom-full left-0 mb-2 bg-white-pure border border-white-warm rounded-lg shadow-white-soft p-2 min-w-[200px] elevated-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="w-full justify-start gap-2 hover-brand-orange"
                    >
                      <Smile className="h-4 w-4" />
                      Emoji
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleFileUpload('file')}
                      className="w-full justify-start gap-2 hover-brand-orange"
                    >
                      <Paperclip className="h-4 w-4" />
                      Arquivo
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleFileUpload('image')}
                      className="w-full justify-start gap-2 hover-brand-orange"
                    >
                      <ImageIcon className="h-4 w-4" />
                      Imagem
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleFileUpload('video')}
                      className="w-full justify-start gap-2 hover-brand-orange"
                    >
                      <Video className="h-4 w-4" />
                      Vídeo
                    </Button>
                  </div>
                )}

                {/* Picker de emoji */}
                {showEmojiPicker && (
                  <div className="absolute bottom-full left-0 mb-2 bg-white-pure border border-white-warm rounded-lg shadow-white-soft p-3 elevated-2">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-medium text-foreground">Emojis</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowEmojiPicker(false)}
                        className="h-6 w-6"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    {/* Navegação por categorias */}
                    <div className="flex gap-1 mb-3 overflow-x-auto">
                      {Object.entries(emojiCategories).map(([key, category]) => (
                        <button
                          key={key}
                          onClick={() => setActiveEmojiCategory(key as keyof typeof emojiCategories)}
                          className={`flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center transition-colors ${
                            activeEmojiCategory === key
                              ? 'bg-primary text-white'
                              : 'hover:bg-white-soft'
                          }`}
                          title={category.name}
                        >
                          {category.icon}
                        </button>
                      ))}
                    </div>
                    
                    {/* Nome da categoria ativa */}
                    <div className="text-xs text-muted-foreground mb-2 font-medium">
                      {emojiCategories[activeEmojiCategory].name}
                    </div>
                    
                    <div className="grid grid-cols-10 gap-1 w-[350px] max-h-[200px] overflow-y-auto">
                      {emojiCategories[activeEmojiCategory].emojis.map((emoji: string, index: number) => (
                        <button
                          key={index}
                          onClick={() => handleEmojiClick(emoji)}
                          className="w-7 h-7 flex items-center justify-center hover:bg-white-soft rounded-md transition-colors text-lg"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Digite sua mensagem..."
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage(e)}
                className="bg-white-soft border-white-warm focus:border-primary"
              />
              <Button
                onClick={handleSendMessage}
                disabled={isSendingMessage || !newMessage.trim()}
                className="bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 elevated-1"
              >
                {isSendingMessage ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
