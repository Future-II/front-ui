import { Upload } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function UploadBlock({
  label,
  accept,
  inputId,
  multiple,
  type,
  onFileChange,
  disabled = false, 
}: {
  label: string;
  accept: string;
  inputId: string;
  multiple?: boolean;
  type: "excel" | "pdf";
  onFileChange: (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "excel" | "pdf"
  ) => void;
  disabled?: boolean; // Add disabled to the type definition
}) {
  const { t } = useTranslation();

  const triggerFile = () => {
    if (disabled) return; // Prevent action when disabled
    const el = document.getElementById(inputId) as HTMLInputElement | null;
    el?.click();
  };

  return (
    <div className={`
      border-2 border-dashed rounded-lg p-6 text-center
      ${disabled 
        ? 'border-gray-200 bg-gray-100 cursor-not-allowed' 
        : 'border-gray-300 hover:border-gray-400 cursor-pointer'
      }
    `}>
      <Upload className={`
        h-8 w-8 mx-auto mb-2
        ${disabled ? 'text-gray-300' : 'text-gray-400'}
      `} />
      <p className={`
        mb-2
        ${disabled ? 'text-gray-400' : 'text-gray-600'}
      `}>
        {label}
      </p>

      {multiple && (
        <p className={`
          text-sm
          ${disabled ? 'text-gray-300' : 'text-gray-500'}
        `}>
          {t("mekyas.manual.multiFilesHint")}
        </p>
      )}

      <input
        type="file"
        className="hidden"
        accept={accept}
        multiple={multiple}
        id={inputId}
        onChange={(e) => !disabled && onFileChange(e, type)} // Prevent onChange when disabled
        disabled={disabled} // Disable the actual input
      />

      <button
        className={`
          mt-4 px-4 py-2 rounded-lg transition-colors
          ${disabled 
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
            : 'bg-blue-600 text-white hover:bg-blue-700'
          }
        `}
        onClick={triggerFile}
        type="button"
        disabled={disabled} // Disable the button
      >
        {t("mekyas.manual.chooseFile")}
      </button>
    </div>
  );
}