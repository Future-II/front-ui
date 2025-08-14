import { MessageSquare, Phone, Mail } from "lucide-react";

export default function SupportContactMethods() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 ml-8">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">التواصل مع الدعم الفني</h2>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ContactCard
            bgColor="blue"
            Icon={MessageSquare}
            title="المحادثة المباشرة"
            description="تواصل مع فريق الدعم الفني مباشرة عبر المحادثة"
            button={
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                بدء محادثة
              </button>
            }
          />
          <ContactCard
            bgColor="green"
            Icon={Phone}
            title="الاتصال الهاتفي"
            description="اتصل بفريق الدعم الفني على الرقم المخصص"
            button={
              <a
                href="tel:+966123456789"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                920001234
              </a>
            }
          />
          <ContactCard
            bgColor="amber"
            Icon={Mail}
            title="البريد الإلكتروني"
            description="راسلنا عبر البريد الإلكتروني وسنرد عليك في أقرب وقت"
            button={
              <a
                href="mailto:support@example.com"
                className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
              >
                إرسال بريد إلكتروني
              </a>
            }
          />
        </div>
      </div>
    </div>
  );
}

interface ContactCardProps {
  bgColor: "blue" | "green" | "amber";
  Icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  button: React.ReactNode;
}

function ContactCard({ bgColor, Icon, title, description, button }: ContactCardProps) {
  const colors = {
    blue: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      iconBg: "bg-blue-100",
      iconText: "text-blue-600",
    },
    green: {
      bg: "bg-green-50",
      border: "border-green-200",
      iconBg: "bg-green-100",
      iconText: "text-green-600",
    },
    amber: {
      bg: "bg-amber-50",
      border: "border-amber-200",
      iconBg: "bg-amber-100",
      iconText: "text-amber-600",
    },
  };

  const color = colors[bgColor];

  return (
    <div className={`${color.bg} p-6 rounded-lg border ${color.border} flex flex-col items-center`}>
      <div className={`w-16 h-16 rounded-full ${color.iconBg} flex items-center justify-center mb-4`}>
        <Icon className={`h-8 w-8 ${color.iconText}`} />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 text-center mb-4">{description}</p>
      {button}
    </div>
  );
}
