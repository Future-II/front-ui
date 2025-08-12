# Real Estate Reports Management System

A comprehensive web application for managing, withdrawing, and sending real estate reports between different systems.

## 🌍 Internationalization (i18n) Support

This application now supports both **Arabic (RTL)** and **English (LTR)** languages with automatic language detection and smooth transitions.

### Features

- **Bilingual Support**: Arabic and English interfaces
- **RTL/LTR Layout**: Automatic text direction switching
- **Language Persistence**: Remembers user's language preference
- **Beautiful Toggle**: Modern, animated language switcher in the navbar
- **Automatic Detection**: Detects browser language on first visit

### Language Toggle

The language toggle is located in the top-right corner of the navbar, next to the notifications bell. It features:

- **Gradient Design**: Beautiful blue-to-purple gradient
- **Smooth Animations**: Hover effects and transitions
- **Visual Indicators**: Shows current language (ع for Arabic, EN for English)
- **Tooltip**: Hover to see the language you'll switch to
- **RTL/LTR Support**: Automatically adjusts layout direction

### How to Use

1. **Switch Languages**: Click the language toggle button in the navbar
2. **Automatic Detection**: The app will detect your browser language on first visit
3. **Persistent Preference**: Your language choice is saved in localStorage
4. **Layout Adjustment**: Text direction automatically switches between RTL (Arabic) and LTR (English)

### File Structure

```
src/
├── locales/
│   ├── en.json          # English translations
│   └── ar.json          # Arabic translations
├── i18n.ts              # i18n configuration
├── hooks/
│   └── useLanguage.ts   # Language management hook
└── shared/components/Common/
    └── LanguageToggle.tsx  # Language toggle component
```

### Adding New Translations

To add new text to the application:

1. **Add to English file** (`src/locales/en.json`):
```json
{
  "newSection": {
    "title": "New Title",
    "description": "New description"
  }
}
```

2. **Add to Arabic file** (`src/locales/ar.json`):
```json
{
  "newSection": {
    "title": "عنوان جديد",
    "description": "وصف جديد"
  }
}
```

3. **Use in components**:
```tsx
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation();
  
  return <h1>{t('newSection.title')}</h1>;
};
```

### Technical Details

- **Framework**: i18next with React integration
- **Detection**: Browser language detection with localStorage fallback
- **Direction**: Automatic RTL/LTR switching
- **Performance**: Lazy loading of translation files
- **Accessibility**: Proper ARIA labels and screen reader support

## 🚀 Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```

## 🎨 Styling

The application uses Tailwind CSS with custom animations and transitions for the language toggle and RTL/LTR support.

## 🔧 Customization

You can customize the language toggle appearance by modifying the `LanguageToggle.tsx` component and the associated CSS classes in `index.css`.

## 📱 Responsive Design

The language toggle and all components are fully responsive and work seamlessly on mobile, tablet, and desktop devices. 