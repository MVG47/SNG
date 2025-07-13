# Stakeholder Globe 🌍

A sophisticated 3D interactive globe visualization application built with Next.js and three-globe, designed to display and explore stakeholder relationships across the world.

## ✨ Features

### 🌍 Advanced Globe Visualization
- **Real Earth Textures**: NASA's Blue Marble imagery with topographical bump maps
- **Atmospheric Effects**: Beautiful atmosphere glow around the globe
- **Multiple Visualization Modes**:
  - **Enhanced Globe**: Premium three-globe experience with realistic Earth textures
  - **Heat Map Mode**: Stakeholder density visualization with colored heat zones
  - **Simple Points**: Fallback mode for basic device compatibility

### 🎯 Interactive Features
- **Stakeholder Navigator**: Comprehensive sidebar with search, filtering, and browseable stakeholder list
- **Click-to-Select**: Direct stakeholder selection with three-globe's native click handling
- **Animated Arcs**: Smooth, curved connection lines between stakeholders
- **Smart Labels**: Context-aware labels for selected stakeholders
- **Dynamic Points**: Stakeholder markers with size and color variations

### 🌟 Advanced Capabilities
- **Country Polygons**: Beautiful country boundary overlays
- **Satellite View**: Real satellite imagery mode
- **Day/Night Cycle**: Animated transition between day and night Earth textures
- **Smooth Transitions**: Beautiful animations for all interactions
- **Auto-rotation**: Toggle globe rotation with intuitive controls

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm**, **yarn**, **pnpm**, or **bun**
- Modern web browser with WebGL support
- **Mapbox Access Token** (required for certain features)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd stakeholder-globe
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Environment Setup**
   
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_access_token_here
   ```
   
   **Get your Mapbox token:**
   - Sign up at [mapbox.com](https://www.mapbox.com/)
   - Go to your account dashboard
   - Create a new access token
   - Copy the token to your `.env.local` file

### Running the Application

1. **Development Mode**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

2. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

3. **Build for Production**
   ```bash
   npm run build
   npm run start
   ```

## 📁 Project Structure

```
stakeholder-globe/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page
│   │   └── globals.css        # Global styles
│   ├── components/
│   │   ├── globe/             # Globe visualization components
│   │   │   ├── enhanced-globe.tsx
│   │   │   ├── heat-map-globe.tsx
│   │   │   ├── satellite-globe.tsx
│   │   │   └── simple-globe.tsx
│   │   ├── navigation/        # Navigation components
│   │   ├── onboarding/        # Onboarding flow
│   │   ├── profile/           # User profile components
│   │   └── ui/                # Reusable UI components
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utility functions
│   ├── stores/                # Zustand state management
│   └── types/                 # TypeScript type definitions
├── public/                    # Static assets
└── config files...
```

## 🎮 Usage Guide

### Globe Controls

| Control | Function | Description |
|---------|----------|-------------|
| 📋 Menu | Navigator | Open/close stakeholder browser |
| ⏸️/▶️ | Auto-rotate | Toggle globe rotation |
| 👁️ | Connections | Show/hide connection lines |
| 🌍 | Countries | Toggle country boundaries |
| ☀️ | Day/Night | Enable/disable day/night cycle |
| 🔍 | Filter | Filter by stakeholder type |
| 📋 | View Mode | Switch visualization modes |

### Interacting with the Globe

- **Click** stakeholder points to select and view details
- **Drag** to rotate the globe
- **Scroll** to zoom in/out
- **Auto-rotation** can be toggled with the play/pause button
- **Search** for specific stakeholders using the navigator
- **Filter** by stakeholder type for focused exploration

### Visualization Modes

1. **Enhanced Globe** (Default)
   - Full three-globe experience with realistic Earth textures
   - Atmospheric effects and professional appearance
   - Best performance on modern devices

2. **Heat Map Mode**
   - Shows stakeholder density as colored heat zones
   - Gaussian KDE-based density visualization
   - Ideal for understanding geographic distribution

3. **Simple Points**
   - Fallback mode for basic device compatibility
   - Lightweight rendering for older browsers
   - Maintains core functionality

## 🛠️ Technologies Used

- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://react.dev/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[three-globe](https://github.com/vasturiano/three-globe)** - 3D globe visualization
- **[Three.js](https://threejs.org/)** - 3D graphics library
- **[@react-three/fiber](https://docs.pmnd.rs/react-three-fiber)** - React renderer for Three.js
- **[@react-three/drei](https://docs.pmnd.rs/drei)** - Three.js helpers
- **[Tailwind CSS](https://tailwindcss.com/)** - Styling framework
- **[Framer Motion](https://www.framer.com/motion/)** - Animation library
- **[Zustand](https://zustand-demo.pmnd.rs/)** - State management
- **[Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/)** - Maps and geolocation
- **[Radix UI](https://www.radix-ui.com/)** - Accessible UI components

## 🌐 Browser Compatibility

The Stakeholder Globe works in all modern browsers:

- ✅ **Chrome/Edge** (Recommended)
- ✅ **Firefox**
- ✅ **Safari**
- ✅ **Mobile browsers**

**Requirements:**
- WebGL support (available in all modern browsers)
- JavaScript enabled
- Minimum 1GB RAM for optimal performance

**Fallback Support:**
- Graceful degradation to simple mode if WebGL is unavailable
- Progressive enhancement approach ensures basic functionality

## ⚡ Performance Notes

- **Initial Load**: 1-2 seconds while three-globe initializes
- **Texture Loading**: Earth textures loaded from CDN for optimal performance
- **Heat Map**: Calculations performed on-demand for responsive experience
- **Rendering**: Smooth 60fps on modern hardware
- **Memory Usage**: Optimized for efficient resource utilization

## 🔧 Development

### Development Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Environment Variables

```env
# Required
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_token

# Optional (for development)
NODE_ENV=development
NEXT_PUBLIC_DEBUG=true
```

## 🐛 Troubleshooting

### Common Issues

1. **Globe not loading**
   - Check if WebGL is enabled in your browser
   - Verify Mapbox token is correctly configured
   - Try refreshing the page

2. **Performance issues**
   - Switch to Simple Points mode for better performance
   - Close other browser tabs to free up memory
   - Update your graphics drivers

3. **Blank screen**
   - Check browser console for JavaScript errors
   - Verify all dependencies are installed
   - Ensure Node.js version is 18 or higher

4. **Build errors**
   - Clear `node_modules` and reinstall dependencies
   - Check TypeScript configuration
   - Verify all environment variables are set

### Getting Help

- Check the [Issues](../../issues) section
- Review the [GLOBE-ENHANCEMENTS.md](./GLOBE-ENHANCEMENTS.md) for detailed feature documentation
- Ensure your browser supports WebGL 2.0

## 📚 Documentation

- [Globe Enhancements Guide](./GLOBE-ENHANCEMENTS.md) - Detailed feature documentation
- [Texture Guide](./README-TEXTURE-GUIDE.md) - Globe texture customization
- [Integration Example](./INTEGRATION-EXAMPLE.md) - Implementation examples

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **[three-globe](https://github.com/vasturiano/three-globe)** - For the incredible 3D globe library
- **NASA** - For the Blue Marble Earth imagery
- **Mapbox** - For geolocation services
- **Next.js Team** - For the amazing React framework

---

**Built with ❤️ using Next.js and three-globe**
