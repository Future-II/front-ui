import { t } from 'i18next';
import { useState } from 'react';
import { useLanguage } from '../../../../hooks/useLanguage';

interface ChatInputProps {
  onSend: (text: string) => void;
}

const ChatInput = ({ onSend }: ChatInputProps) => {
    const { isRTL } = useLanguage();
    const [inputValue, setInputValue] = useState('');

    const handleChange = (event: any) => {
        setInputValue(event.target.value);
    };

    const handleSubmit = () => {
        const text = inputValue.trim();
        if (!text) return;
        onSend(text);
        setInputValue('');
    };

    return (
        <div className="flex flex-col w-full p-4 font-inter">
            <div className="w-full bg-white border-t border-gray-200 p-6 flex flex-col space-y-4">
                <div className="flex justify-start text-gray-800">
                    {t('chat.addReply')}
                </div>

                <div className="relative">
                    <textarea
                        className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-32 text-gray-800 placeholder-gray-400"
                        placeholder={t('chat.addReply')}
                        value={inputValue}
                        onChange={handleChange}
                        dir={isRTL ? "rtl" : "ltr"}
                    ></textarea>
                </div>

                <div className="flex justify-between items-center mt-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-gray-500 cursor-pointer hover:text-gray-700"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                    </svg>
                    <button
                        onClick={handleSubmit}
                        className="bg-gray-100 text-gray-800 font-medium py-1 px-6 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 transition duration-200"
                        dir="rtl"
                    >
                        {t('common.send')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatInput;
