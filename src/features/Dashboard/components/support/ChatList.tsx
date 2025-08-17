import { useTranslation } from "react-i18next";
import { useLanguage } from "../../../../hooks/useLanguage";

import ChatItem from "./ChatItem";
import { formatDateTime } from "../../../../shared/utils/formatTime";
import ChatInput from "./ChatInput";

const ChatList = () => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  const dummyChats = [
    {
      sender: "سارة سارة الأحمد",
      role: "الأحد",
      message:
        "نواجه مشكلة في سحب التقارير بشكل تلقائي منذ الصباح. هل يمكن المساعدة في حل المشكلة؟",
      timestamp: new Date("2023-11-23T10:30:00"),
      isSupport: false,
    },
    {
      sender: "محمد الدعم",
      role: "الدعم",
      message:
        "شكرًا للتواصل معنا. هل يمكن مشاركة رسائل الخطأ التي تظهر لديكم أثناء محاولة سحب التقارير؟",
      timestamp: new Date("2023-11-23T10:45:00"),
      isSupport: true,
    },
    {
      sender: "سارة سارة الأحمد",
      role: "الأحد",
      message:
        "نعم، تظهر رسالة 'فشل في الاتصال بالخادم' عند محاولة سحب التقارير. سأرفق لكم لقطة.",
      timestamp: new Date("2023-11-23T11:00:00"),
      isSupport: false,
    },
  ];

  const supportName = "محمد الدعم"; // Example: first support user in the chat

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex justify-between text-sm text-gray-500 mb-6">
        <div>
          {t('chat.ticketCreated')}: {formatDateTime(dummyChats[0].timestamp, isRTL)}
        </div>
        <div>
          {t('chat.assignedTo')}: <span className="text-black">{supportName}</span>
        </div>
      </div>

      {/* Chat messages */}
      <div className="space-y-4">
        {dummyChats.map((chat, idx) => (
          <ChatItem key={idx} {...chat} />
        ))}
      </div>
      <ChatInput />
    </div>
  );
};

export default ChatList;
