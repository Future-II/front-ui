import { Upload } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function UploadBlock({
  label,
  accept,
  inputId,
  multiple,
}: {
  label: string;
  accept: string;
  inputId: string;
  multiple?: boolean;
}) {
  const { t } = useTranslation();

  const triggerFile = () => {
    const el = document.getElementById(inputId) as HTMLInputElement | null;
    el?.click();
  };

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
      <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
      <p className="text-gray-600 mb-2">{label}</p>

      {multiple && (
        <p className="text-gray-500 text-sm">{t("mekyas.manual.multiFilesHint")}</p>
      )}

      <input
        type="file"
        className="hidden"
        accept={accept}
        multiple={multiple}
        id={inputId}
      />

      <button
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        onClick={triggerFile}
        type="button"
      >
        {t("mekyas.manual.chooseFile")}
      </button>
    </div>
  );
}
