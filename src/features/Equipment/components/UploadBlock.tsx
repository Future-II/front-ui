import { Upload } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function UploadBlock({
  labelKey,
  subLabelKey,
  accept,
  inputId,
  multiple,
  buttonTextKey,
  buttonColor,
}: {
  labelKey: string;
  subLabelKey?: string;
  accept: string;
  inputId: string;
  multiple?: boolean;
  buttonTextKey?: string;
  buttonColor?: string;
}) {
  const { t } = useTranslation();

  const triggerFile = () => {
    const el = document.getElementById(inputId) as HTMLInputElement | null;
    el?.click();
  };

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg mt-8 p-6 text-center">
      <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
      
      <p className="text-gray-600 mb-1">{t(labelKey)}</p>
      
      {subLabelKey && (
        <p className="text-gray-500 text-sm mb-2">
          {t(subLabelKey)}
        </p>
      )}

      {multiple && (
        <p className="text-gray-500 text-sm">
          {t("mekyas.manual.multiFilesHint")}
        </p>
      )}

      <input
        type="file"
        className="hidden"
        accept={accept}
        multiple={multiple}
        id={inputId}
      />

      <button
        className={`mt-4 px-4 py-2 rounded-lg transition-colors ${
          buttonColor || "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
        onClick={triggerFile}
        type="button"
      >
        {buttonTextKey ? t(buttonTextKey) : t("mekyas.manual.chooseFile")}
      </button>
    </div>
  );
}
