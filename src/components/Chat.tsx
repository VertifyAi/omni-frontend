"use client";

import React, { useEffect, useState, useRef } from "react";
import { Ticket, TicketMessage, TicketStatus } from "@/types/ticket";
import { chatService } from "@/services/chat";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Loader2,
  Send,
  Bot,
  User,
  Plus,
  Smile,
  Paperclip,
  Image as ImageIcon,
  Video,
  X,
  Mic,
  Square,
  Trash2,
} from "lucide-react";
import { fetchApi } from "@/lib/fetchApi";
import { formatPhoneNumber } from "@/lib/utils";
import Image from "next/image";
import "../app/globals.css";
import { CustomerDetailsPanel } from "./CustomerDetailsPanel";
import { AudioWaveform } from "./AudioWaveform";
import { Skeleton } from "@/components/ui/skeleton";
import { TransferTicketModal } from "./TransferTicketModal";
import { AudioMessage } from "./AudioMessage";
import { Team } from "@/app/dashboard/teams/page";

interface ChatProps {
  ticket: Ticket;
  handleTransferTicket: (status: TicketStatus) => Promise<void>;
  onTicketUpdated?: () => void;
}

export function Chat({
  ticket,
  handleTransferTicket,
  onTicketUpdated,
}: ChatProps) {
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoadingInitial, setIsLoadingInitial] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [activeEmojiCategory, setActiveEmojiCategory] =
    useState<keyof typeof emojiCategories>("faces");
  const [isCustomerPanelOpen, setIsCustomerPanelOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [recordingTime, setRecordingTime] = useState(0);
  const [isSendingAudio, setIsSendingAudio] = useState(false);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [teamData, setTeamData] = useState<Team | null>(null);

  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // Emojis organizados por categorias
  const emojiCategories = {
    faces: {
      name: "Rostos",
      icon: "😀",
      emojis: [
        "😀",
        "😃",
        "😄",
        "😁",
        "😆",
        "😅",
        "😂",
        "🤣",
        "😊",
        "😇",
        "🙂",
        "🙃",
        "😉",
        "😌",
        "😍",
        "🥰",
        "😘",
        "😗",
        "😙",
        "😚",
        "😋",
        "😛",
        "😝",
        "😜",
        "🤪",
        "🤨",
        "🧐",
        "🤓",
        "😎",
        "🤩",
        "🥳",
        "😏",
        "😒",
        "😞",
        "😔",
        "😟",
        "😕",
        "🙁",
        "☹️",
        "😣",
        "😖",
        "😫",
        "😩",
        "🥺",
        "😢",
        "😭",
        "😤",
        "😠",
        "😡",
        "🤬",
        "🤯",
        "😳",
        "🥵",
        "🥶",
        "😱",
        "😨",
        "😰",
        "😥",
        "😓",
        "🤗",
      ],
    },
    gestures: {
      name: "Gestos",
      icon: "👍",
      emojis: [
        "👍",
        "👎",
        "👌",
        "🤌",
        "🤏",
        "✌️",
        "🤞",
        "🤟",
        "🤘",
        "🤙",
        "👈",
        "👉",
        "👆",
        "🖕",
        "👇",
        "☝️",
        "👋",
        "🤚",
        "🖐️",
        "✋",
        "🖖",
        "👏",
        "🙌",
        "🤝",
        "🙏",
        "✍️",
        "💪",
        "🦾",
        "🦿",
        "🦵",
        "🦶",
        "👂",
        "🦻",
        "👃",
        "🧠",
        "🫀",
        "🫁",
        "🦷",
        "🦴",
        "👀",
        "👁️",
        "👅",
        "👄",
        "💋",
        "🩸",
        "👶",
        "🧒",
        "👦",
        "👧",
        "🧑",
      ],
    },
    animals: {
      name: "Animais",
      icon: "🐶",
      emojis: [
        "🐶",
        "🐱",
        "🐭",
        "🐹",
        "🐰",
        "🦊",
        "🐻",
        "🐼",
        "🐨",
        "🐯",
        "🦁",
        "🐮",
        "🐷",
        "🐽",
        "🐸",
        "🐵",
        "🙈",
        "🙉",
        "🙊",
        "🐒",
        "🐔",
        "🐧",
        "🐦",
        "🐤",
        "🐣",
        "🐥",
        "🦆",
        "🦅",
        "🦉",
        "🦇",
        "🐺",
        "🐗",
        "🐴",
        "🦄",
        "🐝",
        "🐛",
        "🦋",
        "🐌",
        "🐞",
        "🐜",
        "🦟",
        "🦗",
        "🕷️",
        "🦂",
        "🐢",
        "🐍",
        "🦎",
        "🦖",
        "🦕",
        "🐙",
      ],
    },
    food: {
      name: "Comida",
      icon: "🍕",
      emojis: [
        "🍎",
        "🍊",
        "🍋",
        "🍌",
        "🍉",
        "🍇",
        "🍓",
        "🫐",
        "🍈",
        "🍒",
        "🍑",
        "🥭",
        "🍍",
        "🥥",
        "🥝",
        "🍅",
        "🍆",
        "🥑",
        "🥦",
        "🥬",
        "🥒",
        "🌶️",
        "🫑",
        "🌽",
        "🥕",
        "🫒",
        "🧄",
        "🧅",
        "🥔",
        "🍠",
        "🥐",
        "🍞",
        "🥖",
        "🥨",
        "🧀",
        "🥚",
        "🍳",
        "🧈",
        "🥞",
        "🧇",
        "🥓",
        "🥩",
        "🍗",
        "🍖",
        "🦴",
        "🌭",
        "🍔",
        "🍟",
        "🍕",
        "🥪",
      ],
    },
    activities: {
      name: "Atividades",
      icon: "⚽",
      emojis: [
        "⚽",
        "🏀",
        "🏈",
        "⚾",
        "🥎",
        "🎾",
        "🏐",
        "🏉",
        "🥏",
        "🎱",
        "🪀",
        "🏓",
        "🏸",
        "🏒",
        "🏑",
        "🥍",
        "🏏",
        "🪃",
        "🥅",
        "⛳",
        "🪁",
        "🏹",
        "🎣",
        "🤿",
        "🥊",
        "🥋",
        "🎽",
        "🛹",
        "🛷",
        "⛸️",
        "🥌",
        "🎿",
        "⛷️",
        "🏂",
        "🪂",
        "🏋️",
        "🤼",
        "🤸",
        "⛹️",
        "🤺",
        "🏇",
        "🧘",
        "🏄",
        "🏊",
        "🤽",
        "🚣",
        "🧗",
        "🚵",
        "🚴",
        "🏆",
      ],
    },
    objects: {
      name: "Objetos",
      icon: "💎",
      emojis: [
        "⌚",
        "📱",
        "📲",
        "💻",
        "⌨️",
        "🖥️",
        "🖨️",
        "🖱️",
        "🖲️",
        "🕹️",
        "🗜️",
        "💽",
        "💾",
        "💿",
        "📀",
        "📼",
        "📷",
        "📸",
        "📹",
        "🎥",
        "📽️",
        "🎞️",
        "📞",
        "☎️",
        "📟",
        "📠",
        "📺",
        "📻",
        "🎙️",
        "🎚️",
        "🎛️",
        "🧭",
        "⏱️",
        "⏲️",
        "⏰",
        "🕰️",
        "⌛",
        "⏳",
        "📡",
        "🔋",
        "🪫",
        "🔌",
        "💡",
        "🔦",
        "🕯️",
        "🪔",
        "🧯",
        "🛢️",
        "💸",
        "💵",
      ],
    },
    symbols: {
      name: "Símbolos",
      icon: "❤️",
      emojis: [
        "❤️",
        "🧡",
        "💛",
        "💚",
        "💙",
        "💜",
        "🖤",
        "🤍",
        "🤎",
        "💔",
        "❣️",
        "💕",
        "💞",
        "💓",
        "💗",
        "💖",
        "💘",
        "💝",
        "💟",
        "☮️",
        "✝️",
        "☪️",
        "🕉️",
        "☸️",
        "✡️",
        "🔯",
        "🕎",
        "☯️",
        "☦️",
        "🛐",
        "⭐",
        "🌟",
        "✨",
        "⚡",
        "☄️",
        "💫",
        "🔥",
        "💯",
        "✅",
        "❌",
        "❎",
        "➕",
        "➖",
        "➗",
        "✖️",
        "🟰",
        "💲",
        "💱",
        "™️",
        "©️",
      ],
    },
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
      console.log("Chat: Nova mensagem recebida:", message);
      if (message.ticketId === ticket.id) {
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => {
      unsubscribe();
      chatService.disconnect();
    };
  }, [ticket.id]);

  // Buscar dados da equipe quando o ticket tiver areaId
  useEffect(() => {
    const loadTeamData = async () => {
      if (ticket.areaId) {
        try {
          const response = await fetchApi(`/api/teams/${ticket.areaId}`);
          if (response.ok) {
            const team = await response.json();
            setTeamData(team);
          }
        } catch (error) {
          console.error("Erro ao carregar dados da equipe:", error);
        }
      }
    };

    loadTeamData();
  }, [ticket.areaId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest(".options-menu")) {
        setShowOptions(false);
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
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
    setNewMessage((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleFileUpload = (type: "file" | "image" | "video") => {
    setShowOptions(false);
    if (type === "file" && fileInputRef.current) {
      fileInputRef.current.click();
    } else if (type === "image" && imageInputRef.current) {
      imageInputRef.current.click();
    } else if (type === "video" && videoInputRef.current) {
      videoInputRef.current.click();
    }
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: string
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      // Aqui você pode implementar a lógica de upload do arquivo
      console.log(`Uploading ${type}:`, file.name);
      // Por enquanto, vamos apenas mostrar o nome do arquivo na mensagem
      setNewMessage((prev) => prev + `📎 ${file.name}`);
    }
  };

  const openCustomerPanel = () => {
    setIsCustomerPanelOpen(true);
  };

  const closeCustomerPanel = () => {
    setIsCustomerPanelOpen(false);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: "audio/webm" });
        setAudioBlob(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      setRecordingTime(0);
      setAudioStream(stream);

      // Timer para o tempo de gravação
      const timer = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

      recorder.onstop = () => {
        clearInterval(timer);
        const audioBlob = new Blob(chunks, { type: "audio/webm" });
        setAudioBlob(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };
    } catch (error) {
      console.error("Erro ao acessar microfone:", error);
      setError(
        "Não foi possível acessar o microfone. Verifique as permissões."
      );
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      setMediaRecorder(null);
      if (audioStream) {
        audioStream.getTracks().forEach((track) => track.stop());
        setAudioStream(null);
      }
    }
  };

  const cancelRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      setMediaRecorder(null);
      setAudioBlob(null);
      setRecordingTime(0);
      if (audioStream) {
        audioStream.getTracks().forEach((track) => track.stop());
        setAudioStream(null);
      }
    }
  };

  const sendAudio = async () => {
    if (!audioBlob) return;

    try {
      setIsSendingAudio(true);
      setError(null);

      const formData = new FormData();
      formData.append("audio", audioBlob, "audio.webm");

      const response = await fetchApi(
        `/api/tickets/${ticket.id}/messages/upload-audio`,
        {
          method: "POST",
          body: formData,
        }
      );

      const newMessageData = await response.json();
      setMessages((prev) => [...prev, newMessageData]);
      chatService.sendMessage(ticket.id, newMessageData);
      chatService.markAsRead(ticket.id);

      // Limpar estado de gravação
      setAudioBlob(null);
      setRecordingTime(0);
    } catch (error) {
      console.error("Erro ao enviar áudio:", error);
      setError("Não foi possível enviar o áudio. Tente novamente.");
    } finally {
      setIsSendingAudio(false);
    }
  };

  const formatRecordingTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const MessageSkeleton = ({
    isFromUser,
    variant = "medium",
  }: {
    isFromUser: boolean;
    variant?: "short" | "medium" | "long";
  }) => {
    const getTextLines = () => {
      switch (variant) {
        case "short":
          return [<Skeleton key="1" className="h-3.5 w-24" />];
        case "long":
          return [
            <Skeleton key="1" className="h-3.5 w-56 mb-1" />,
            <Skeleton key="2" className="h-3.5 w-48 mb-1" />,
            <Skeleton key="3" className="h-3.5 w-40 mb-1" />,
            <Skeleton key="4" className="h-3.5 w-32" />,
          ];
        default: // medium
          return [
            <Skeleton key="1" className="h-3.5 w-48 mb-1" />,
            <Skeleton key="2" className="h-3.5 w-32" />,
          ];
      }
    };

    return (
      <div className={`flex ${isFromUser ? "justify-end" : "justify-start"}`}>
        <div
          className={`flex items-end gap-2 max-w-[70%] ${
            isFromUser ? "flex-row-reverse" : "flex-row"
          }`}
        >
          {/* Avatar skeleton */}
          <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />

          {/* Message skeleton */}
          <div
            className={`rounded-2xl p-4 elevated-1 bg-white-pure border border-white-warm`}
          >
            {/* Texto da mensagem - tamanho similar ao text-sm */}
            <div className="space-y-1">{getTextLines()}</div>
            {/* Data/hora - tamanho similar ao text-xs */}
            <Skeleton className="h-3 w-20 mt-2" />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-white-warm">
      {/* Nível 1: Header */}
      <div className="flex border-b border-white-warm px-4 bg-white-pure shadow-white-soft justify-between items-center">
        <div
          className="flex items-center gap-3 p-4 cursor-pointer hover:bg-white-soft transition-colors rounded-lg"
          onClick={openCustomerPanel}
        >
          <div className="relative">
            <Image
              src={
                ticket.customer.profilePicture ||
                `https://avatar.vercel.sh/${ticket.customer.name || "User"}.png`
              }
              alt={ticket.customer.name}
              width={40}
              height={40}
              className="rounded-full border-2 border-white-warm"
            />
            {/* <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white-pure"></div> */}
          </div>
          <div>
            <h2 className="text-lg font-semibold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              {ticket.customer.name}
            </h2>
            <p className="text-sm text-muted-foreground">
              {formatPhoneNumber(ticket.customer.phone || "")}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setIsTransferModalOpen(true)}
            variant="outline"
          >
            Transferir Atendimento
          </Button>
          {((ticket.status === TicketStatus.IN_PROGRESS &&
            !ticket.userId &&
            ticket.areaId) ||
            ticket.status === TicketStatus.AI) && (
            <Button
              onClick={() => handleTransferTicket(TicketStatus.IN_PROGRESS)}
              className="bg-primary"
            >
              Atender Cliente
            </Button>
          )}
          {(ticket.status === TicketStatus.IN_PROGRESS ||
            ticket.status === TicketStatus.AI) && (
            <Button
              onClick={() => handleTransferTicket(TicketStatus.CLOSED)}
              className="gradient-brand"
            >
              Finalizar Atendimento
            </Button>
          )}
          {ticket.status === TicketStatus.CLOSED && (
            <Button
              onClick={() => handleTransferTicket(TicketStatus.IN_PROGRESS)}
              className="gradient-brand"
            >
              Abrir Atendimento
            </Button>
          )}
        </div>

        {chatService.getUnreadCount(ticket.id) > 0 && (
          <div className="ml-auto p-4 flex items-center">
            <span className="bg-primary text-white rounded-full px-3 py-1 text-xs font-medium elevated-1">
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
          <div className="space-y-4">
            <MessageSkeleton isFromUser={false} variant="medium" />
            <MessageSkeleton isFromUser={true} variant="short" />
            <MessageSkeleton isFromUser={false} variant="long" />
            <MessageSkeleton isFromUser={true} variant="medium" />
            <MessageSkeleton isFromUser={false} variant="short" />
            <MessageSkeleton isFromUser={true} variant="long" />
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                ref={scrollRef}
                key={index}
                className={`flex ${
                  message.senderType === "AI" ||
                  message.senderType === "USER" ||
                  message.senderType === "OMNIFY"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`flex items-end gap-2 max-w-[70%] ${
                    message.senderType === "AI" ||
                    message.senderType === "USER" ||
                    message.senderType === "OMNIFY"
                      ? "flex-row-reverse"
                      : "flex-row"
                  }`}
                >
                  {/* Avatar do remetente */}
                  <div
                    className={`w-8 h-8 min-w-8 rounded-full flex items-center justify-center text-white text-xs font-semibold ${
                      message.senderType === "AI" ||
                      message.senderType === "OMNIFY"
                        ? "bg-gradient-to-r from-purple-500 to-purple-600"
                        : message.senderType === "USER"
                        ? "bg-gradient-to-r from-primary to-secondary"
                        : "bg-gradient-to-r from-gray-400 to-gray-500"
                    }`}
                  >
                    {message.senderType === "AI" ||
                    message.senderType === "OMNIFY" ? (
                      <Bot className="w-4 h-4" />
                    ) : message.senderType === "USER" ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <Image
                        width={32}
                        height={32}
                        className="rounded-full"
                        src={
                          ticket.customer.profilePicture ||
                          `https://avatar.vercel.sh/${
                            ticket.customer.name || "User"
                          }.png`
                        }
                        alt={ticket.customer.name}
                      />
                    )}
                  </div>

                  {/* Mensagem */}
                  <div
                    className={`break-words whitespace-pre-wrap rounded-2xl elevated-1 ${
                      message.senderType === "AI" ||
                      message.senderType === "OMNIFY"
                        ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white"
                        : message.senderType === "USER"
                        ? "bg-gradient-to-r from-primary to-purple-600 text-white"
                        : "bg-white-pure border border-white-warm"
                    } ${message.messageType === "AUDIO" ? "p-2" : "p-4"}`}
                  >
                    {message.messageType === "AUDIO" ? (
                      <div className="space-y-2">
                        <AudioMessage
                          audioUrl={message.message}
                          variant={
                            message.senderType === "AI" ||
                            message.senderType === "OMNIFY"
                              ? "ai"
                              : message.senderType === "USER"
                              ? "user"
                              : "default"
                          }
                        />
                        <p
                          className={`text-xs ${
                            message.senderType === "AI" ||
                            message.senderType === "USER" ||
                            message.senderType === "OMNIFY"
                              ? "text-white/70"
                              : "text-muted-foreground"
                          }`}
                        >
                          {formatDate(message.createdAt)}
                        </p>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm leading-relaxed">
                          {message.message}
                        </p>
                        <p
                          className={`text-xs mt-2 ${
                            message.senderType === "AI" ||
                            message.senderType === "USER" ||
                            message.senderType === "OMNIFY"
                              ? "text-white/70"
                              : "text-muted-foreground"
                          }`}
                        >
                          {formatDate(message.createdAt)}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Nível 1: Footer */}
      <div className="min-h-[73px] border-t border-white-warm bg-white-pure shadow-white-soft flex items-center justify-center">
        {/* Inputs de arquivo ocultos */}
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={(e) => handleFileChange(e, "file")}
        />
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFileChange(e, "image")}
        />
        <input
          ref={videoInputRef}
          type="file"
          accept="video/*"
          className="hidden"
          onChange={(e) => handleFileChange(e, "video")}
        />

        <div className="flex gap-3 w-full p-4">
          {ticket.status === TicketStatus.AI ? (
            <div className="flex w-full items-center justify-center gap-6">
              <p className="text-muted-foreground font-medium flex justify-center items-center">
                O atendimento está sendo realizado por um agente de inteligência
                artificial.
                {messages.filter(
                  (m) => m.senderType === "AI" || m.senderType === "OMNIFY"
                ).length > 0 && (
                  <span className="ml-2 bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs">
                    {
                      messages.filter(
                        (m) =>
                          m.senderType === "AI" || m.senderType === "OMNIFY"
                      ).length
                    }{" "}
                    mensagem(s) da IA
                  </span>
                )}
              </p>
            </div>
          ) : ticket.status === TicketStatus.IN_PROGRESS &&
            !ticket.userId &&
            ticket.areaId ? (
            <div className="flex w-full items-center justify-center gap-6">
              <p className="text-muted-foreground font-medium flex justify-center items-center">
                Para atender o cliente, clique no botão &quot;Atender
                Cliente&quot;
                {ticket.areaId && (
                  <span className="ml-2 bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                    Equipe: {teamData?.name || `ID: ${ticket.areaId}`}
                  </span>
                )}
              </p>
            </div>
          ) : (
            <div className="flex w-full gap-2 items-end">
              {/* Botão de opções */}
              {!isRecording && !audioBlob && (
                <div className="relative options-menu flex-shrink-0">
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
                        onClick={() => handleFileUpload("file")}
                        className="w-full justify-start gap-2 hover-brand-orange"
                      >
                        <Paperclip className="h-4 w-4" />
                        Arquivo
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleFileUpload("image")}
                        className="w-full justify-start gap-2 hover-brand-orange"
                      >
                        <ImageIcon className="h-4 w-4" />
                        Imagem
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleFileUpload("video")}
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
                        <span className="text-sm font-medium text-foreground">
                          Emojis
                        </span>
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
                        {Object.entries(emojiCategories).map(
                          ([key, category]) => (
                            <button
                              key={key}
                              onClick={() =>
                                setActiveEmojiCategory(
                                  key as keyof typeof emojiCategories
                                )
                              }
                              className={`flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center transition-colors ${
                                activeEmojiCategory === key
                                  ? "bg-primary text-white"
                                  : "hover:bg-white-soft"
                              }`}
                              title={category.name}
                            >
                              {category.icon}
                            </button>
                          )
                        )}
                      </div>

                      {/* Nome da categoria ativa */}
                      <div className="text-xs text-muted-foreground mb-2 font-medium">
                        {emojiCategories[activeEmojiCategory].name}
                      </div>

                      <div className="grid grid-cols-10 gap-1 w-[350px] max-h-[200px] overflow-y-auto">
                        {emojiCategories[activeEmojiCategory].emojis.map(
                          (emoji: string, index: number) => (
                            <button
                              key={index}
                              onClick={() => handleEmojiClick(emoji)}
                              className="w-7 h-7 flex items-center justify-center hover:bg-white-soft rounded-md transition-colors text-lg"
                            >
                              {emoji}
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Interface de gravação */}
              {isRecording && (
                <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg flex-1">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-xs font-medium text-red-700">
                      Gravando
                    </span>
                    <span className="text-xs text-red-600 font-mono">
                      {formatRecordingTime(recordingTime)}
                    </span>
                  </div>

                  <div className="flex-1 flex justify-center">
                    <AudioWaveform
                      isRecording={isRecording}
                      stream={audioStream}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={cancelRecording}
                      className="text-red-600 hover:text-red-700 hover:bg-red-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={stopRecording}
                      className="bg-red-500 hover:bg-red-600 text-white"
                      size="sm"
                    >
                      <Square className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Interface de áudio gravado */}
              {audioBlob && !isRecording && (
                <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg flex-1">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-green-700">
                      Áudio gravado
                    </span>
                  </div>
                  <div className="flex-1 text-center">
                    <span className="text-sm text-green-600 font-mono">
                      {formatRecordingTime(recordingTime)}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setAudioBlob(null);
                      setRecordingTime(0);
                    }}
                    className="text-green-600 hover:text-green-700 hover:bg-green-100"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={sendAudio}
                    disabled={isSendingAudio}
                    className="bg-green-500 hover:bg-green-600 text-white"
                    size="sm"
                  >
                    {isSendingAudio ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              )}

              {!isRecording && !audioBlob && (
                <>
                  <textarea
                    value={newMessage}
                    onChange={(e) => {
                      setNewMessage(e.target.value);
                      // Ajustar altura automaticamente
                      const textarea = e.target as HTMLTextAreaElement;
                      textarea.style.height = "auto";
                      const newHeight = Math.min(textarea.scrollHeight, 150);
                      textarea.style.height = newHeight + "px";

                      // Ajustar overflow baseado na altura
                      if (newHeight >= 150) {
                        textarea.style.overflowY = "auto";
                      } else {
                        textarea.style.overflowY = "hidden";
                      }
                    }}
                    placeholder="Digite sua mensagem..."
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(e);
                      }
                    }}
                    className="bg-white-soft border-white-warm focus:border-primary resize-none min-h-[40px] max-h-[150px] w-full rounded-md border px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    style={{ overflowY: "hidden" }}
                    rows={1}
                  />
                  <Button
                    onClick={
                      newMessage.trim() ? handleSendMessage : startRecording
                    }
                    disabled={isSendingMessage}
                    className="gradient-brand text-white"
                    size="icon"
                  >
                    {isSendingMessage ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : newMessage.trim() ? (
                      <Send className="h-4 w-4" />
                    ) : (
                      <Mic className="h-4 w-4" />
                    )}
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Customer Details Panel */}
      <CustomerDetailsPanel
        customerId={ticket.customer.id}
        isOpen={isCustomerPanelOpen}
        onClose={closeCustomerPanel}
      />

      {/* Transfer Ticket Modal */}
      <TransferTicketModal
        ticketId={ticket.id}
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        onTransferSuccess={() => {
          // Atualizar a lista de tickets para refletir a transferência
          onTicketUpdated?.();
        }}
      />
    </div>
  );
}
