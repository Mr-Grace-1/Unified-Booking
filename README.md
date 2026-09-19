# UnifiedBook - Cross-Platform Booking Ecosystem

A comprehensive, production-ready booking management system built with React, TypeScript, Tailwind CSS, and Framer Motion.

## 🚀 Features

### Core Functionality
- **Multi-Service Booking**: Support for appointments, field services, hospitality, classes, and tours
- **Multi-Location Management**: Manage multiple business locations with separate staff and resources
- **Real-Time Calendar**: Interactive day and month views with booking visualization
- **Customer CRM**: Complete customer profiles with booking history and notes
- **Staff Management**: Team scheduling and performance tracking
- **Integration Hub**: Connect with payment processors, calendar services, and more

### Advanced Features
- **Toast Notifications**: Real-time feedback for all user actions
- **Command Palette (⌘K)**: Quick navigation and search with keyboard shortcuts
- **Animated Background**: Beautiful floating particles and gradient orbs
- **Animated Charts**: Dynamic bar charts, line charts, and donut charts in analytics
- **Page Transitions**: Smooth animations between all views using Framer Motion
- **Responsive Design**: Fully responsive across desktop, tablet, and mobile

## 🎨 UI/UX Enhancements

### Animations
- **Page Transitions**: Fade and slide animations between views
- **Staggered Lists**: Items animate in sequence for visual appeal
- **Hover Effects**: Scale and slide interactions on cards and buttons
- **Spring Physics**: Natural motion for modals and notifications
- **Layout Animations**: Smooth reordering when filtering or sorting

### Visual Polish
- **Dark Theme**: Modern dark UI with gradient accents
- **Glassmorphism**: Frosted glass effects on overlays and modals
- **Gradient Orbs**: Animated background elements
- **Floating Particles**: Subtle ambient animation
- **Progress Indicators**: Animated loading states and progress bars

## 🛠️ Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Animation library
- **Lucide React** - Icon library
- **date-fns** - Date utilities
- **Vite** - Build tool

## 📦 Installation

```bash
npm install
```

## 🏃 Development

```bash
npm run dev
```

## 🏗️ Build

```bash
npm run build
```

## 📁 Project Structure

```
src/
├── components/
│   ├── Analytics.tsx          # Analytics dashboard with charts
│   ├── AnimatedBackground.tsx # Floating particles background
│   ├── Bookings.tsx           # Booking list with filters
│   ├── Calendar.tsx           # Calendar views (day/month)
│   ├── Charts.tsx             # Animated chart components
│   ├── CommandPalette.tsx     # ⌘K command palette
│   ├── Customers.tsx          # Customer CRM
│   ├── Dashboard.tsx          # Main dashboard
│   ├── Header.tsx             # Top navigation
│   ├── Integrations.tsx       # Third-party integrations
│   ├── Locations.tsx          # Location management
│   ├── NewBooking.tsx         # Multi-step booking wizard
│   ├── Services.tsx           # Service catalog
│   ├── Sidebar.tsx            # Side navigation
│   ├── Staff.tsx              # Staff management
│   └── Toast.tsx              # Toast notification system
├── data/
│   └── mockData.ts            # Sample data
├── store/
│   └── AppContext.tsx         # Global state management
├── types/
│   └── index.ts               # TypeScript definitions
└── App.tsx                    # Main app component
```

## ⌨️ Keyboard Shortcuts

- **⌘K / Ctrl+K** - Open command palette
- **↑↓** - Navigate command palette
- **Enter** - Execute command
- **Esc** - Close modals

## 🎯 Key Components

### Toast Notifications
Real-time feedback system with success, error, warning, and info variants. Automatically dismisses after 4 seconds with progress indicator.

### Command Palette
Quick access to all views and actions. Type to search, use arrow keys to navigate, Enter to execute.

### Animated Background
Floating particles and gradient orbs create a dynamic, modern aesthetic without impacting performance.

### Charts
Custom animated chart components:
- **AnimatedBarChart**: Staggered bar animations with hover tooltips
- **AnimatedLineChart**: Smooth path drawing with gradient fill
- **AnimatedDonutChart**: Rotating segments with center total

## 🎨 Design System

### Colors
- Primary: Indigo/Purple gradients
- Success: Emerald/Green
- Warning: Amber/Yellow
- Error: Red
- Info: Blue/Cyan

### Typography
- Headers: Bold, gradient text
- Body: Slate-300 for readability
- Captions: Slate-500 for secondary info

### Spacing
- Consistent 4px grid system
- Responsive padding and margins
- Card-based layout with rounded corners

## 📱 Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## 🔧 Configuration

The app uses a context-based state management system. All data is currently mocked but can be easily replaced with API calls.

### Adding a New View
1. Create component in `src/components/`
2. Add to `ViewType` in `src/types/index.ts`
3. Add route in `src/App.tsx`
4. Add navigation item in `src/components/Sidebar.tsx`
5. Add to command palette in `src/components/CommandPalette.tsx`

### Customizing Animations
All animations use Framer Motion. Modify variants in individual components or create shared variants in a central file.

## 🚀 Performance

- Lazy loading for routes (future enhancement)
- Optimized animations with GPU acceleration
- Efficient re-renders with React.memo
- Minimal bundle size with tree-shaking

## 📝 License

MIT

## 🤝 Contributing

Contributions welcome! Please read the code of conduct first.

## 🐛 Known Issues

None at this time. Please report any bugs via GitHub issues.

## 🔮 Future Enhancements

- [ ] Real API integration
- [ ] User authentication
- [ ] Role-based access control
- [ ] Email/SMS notifications
- [ ] Payment gateway integration
- [ ] Mobile app (React Native)
- [ ] Offline support (PWA)
- [ ] Drag-and-drop calendar
- [ ] Recurring bookings
- [ ] Waitlist management
- [ ] Multi-language support
- [ ] Dark/Light theme toggle
- [ ] Export reports (PDF/CSV)
- [ ] Webhook integrations
- [ ] API documentation

---

Built with ❤️ using React, TypeScript, and Framer Motion
