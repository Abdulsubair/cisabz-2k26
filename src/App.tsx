import { useState, useEffect } from 'react';
import { CinematicIntro } from './components/CinematicIntro';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { QuickOverview } from './components/QuickOverview';
import { AboutSection } from './components/AboutSection';
import { DignitariesSection } from './components/DignitariesSection';
import { TechnicalEventsSection } from './components/TechnicalEventsSection';
import { NonTechnicalEventsSection } from './components/NonTechnicalEventsSection';

import { RegistrationPassesSection } from './components/RegistrationPassesSection';
import { RegistrationSection } from './components/RegistrationSection';
import { ScheduleSection } from './components/ScheduleSection';
import { CampusSection } from './components/CampusSection';
import { GallerySection } from './components/GallerySection';
import { CoordinatorsSection } from './components/CoordinatorsSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { EventGuidelineModal } from './components/EventGuidelineModal';
import { CinematicEventVideoModal } from './components/CinematicEventVideoModal';
import { RegistrationModal } from './components/RegistrationModal';
import { AdminPortal } from './components/AdminPortal';
import { CseTerminalWidget } from './components/CseTerminalWidget';
import { CseAiAssistantModal } from './components/CseAiAssistantModal';
import { BackgroundBuildingFlythrough } from './components/BackgroundBuildingFlythrough';
import { CursorFluidEffect } from './components/CursorFluidEffect';
import { ALL_EVENTS } from './data/symposiumData';
import type { EventItem } from './types';

export function App() {
  const [introCompleted, setIntroCompleted] = useState<boolean>(false);
  const [replayIntro, setReplayIntro] = useState<boolean>(false);
  const [selectedGuidelineEvent, setSelectedGuidelineEvent] = useState<EventItem | null>(null);
  const [selectedCinematicDemoEvent, setSelectedCinematicDemoEvent] = useState<EventItem | null>(null);
  const [registrationModalOpen, setRegistrationModalOpen] = useState<boolean>(false);
  const [selectedRegistrationEventId, setSelectedRegistrationEventId] = useState<string | undefined>();

  // Route check for /admin or #admin
  const [isAdminRoute, setIsAdminRoute] = useState<boolean>(() => {
    return (
      window.location.pathname.toLowerCase().includes('/admin') ||
      window.location.hash.toLowerCase().includes('admin')
    );
  });

  useEffect(() => {
    const checkRoute = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path.includes('/admin') || hash.includes('admin')) {
        setIsAdminRoute(true);
      } else {
        setIsAdminRoute(false);
      }
    };

    checkRoute();
    window.addEventListener('popstate', checkRoute);
    window.addEventListener('hashchange', checkRoute);
    return () => {
      window.removeEventListener('popstate', checkRoute);
      window.removeEventListener('hashchange', checkRoute);
    };
  }, []);

  const handleOpenRegistration = (eventId?: string) => {
    setSelectedRegistrationEventId(eventId);
    setRegistrationModalOpen(true);
  };

  const handleOpenGuidelineById = (eventId: string) => {
    const match = ALL_EVENTS.find((e) => e.id === eventId);
    if (match) {
      setSelectedGuidelineEvent(match);
    }
  };

  useEffect(() => {
    // Disable browser scroll restoration so page always starts at top
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  const handleReplayIntro = () => {
    setReplayIntro(true);
    setIntroCompleted(false);
  };

  const handleIntroComplete = () => {
    setIntroCompleted(true);
    setReplayIntro(false);
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    const homeEl = document.getElementById('home');
    if (homeEl) {
      homeEl.scrollIntoView({ behavior: 'instant' });
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // IF ACCESSED VIA /admin ROUTE OR #admin HASH
  if (isAdminRoute) {
    return (
      <AdminPortal
        onBackToWebsite={() => {
          window.history.pushState({}, '', '/');
          window.location.hash = '';
          setIsAdminRoute(false);
        }}
      />
    );
  }

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-black">
      {/* INTERACTIVE ELECTRIC PARTICLE FLUID CURSOR TRAIL */}
      <CursorFluidEffect />

      {/* BACKGROUND MOVING CAMPUS BUILDING ANIMATION */}
      <BackgroundBuildingFlythrough />

      {/* CINEMATIC COLLEGE ENTRY EXPERIENCE */}
      {(!introCompleted || replayIntro) && (
        <CinematicIntro onComplete={handleIntroComplete} forcePlay={replayIntro} />
      )}

      {/* MAIN WEBSITE APP */}
      <Navbar
        onRegisterClick={() => handleOpenRegistration()}
        onReplayIntro={handleReplayIntro}
      />

      <main className="relative z-10">
        {/* HERO SECTION */}
        <HeroSection
          onRegisterClick={() => handleOpenRegistration()}
          onExploreClick={() => scrollToSection('technical-events')}
        />

        {/* QUICK EVENT OVERVIEW */}
        <QuickOverview />

        {/* ABOUT CISABZ-2K26 */}
        <AboutSection />

        {/* DEDICATED TECHNICAL EVENTS */}
        <TechnicalEventsSection
          onViewGuidelines={(event) => setSelectedGuidelineEvent(event)}
          onRegister={(eventId) => handleOpenRegistration(eventId)}
          onViewCinematicDemo={(event) => setSelectedCinematicDemoEvent(event)}
        />

        {/* DEDICATED NON-TECHNICAL EVENTS */}
        <NonTechnicalEventsSection
          onViewGuidelines={(event) => setSelectedGuidelineEvent(event)}
          onRegister={(eventId) => handleOpenRegistration(eventId)}
          onViewCinematicDemo={(event) => setSelectedCinematicDemoEvent(event)}
        />

        {/* OFFICIAL SYMPOSIUM ENTRY TICKET PASSES */}
        <RegistrationPassesSection onRegisterClick={(eventId) => handleOpenRegistration(eventId)} />

        {/* REGISTRATION SECTION */}
        <RegistrationSection onRegisterClick={() => handleOpenRegistration()} />

        {/* SCHEDULE / EVENT TIMELINE */}
        <ScheduleSection />

        {/* COLLEGE / CAMPUS SECTION */}
        <CampusSection />

        {/* GALLERY */}
        <GallerySection />

        {/* CHIEF PATRONS & DIGNITARIES */}
        <DignitariesSection />

        {/* COORDINATORS */}
        <CoordinatorsSection />

        {/* CONTACT SECTION */}
        <ContactSection onRegisterClick={() => handleOpenRegistration()} />
      </main>

      {/* FOOTER */}
      <Footer onReplayIntro={handleReplayIntro} />

      {/* EVENT GUIDELINE MODAL */}
      <EventGuidelineModal
        event={selectedGuidelineEvent}
        onClose={() => setSelectedGuidelineEvent(null)}
        onRegister={(eventId) => handleOpenRegistration(eventId)}
        onOpenCinematicDemo={(event) => setSelectedCinematicDemoEvent(event)}
      />

      {/* FULL-SCREEN CINEMATIC EVENT VIDEO REEL MODAL */}
      <CinematicEventVideoModal
        event={selectedCinematicDemoEvent}
        onClose={() => setSelectedCinematicDemoEvent(null)}
        onRegister={(eventId) => handleOpenRegistration(eventId)}
      />

      {/* REGISTRATION MODAL */}
      <RegistrationModal
        isOpen={registrationModalOpen}
        onClose={() => setRegistrationModalOpen(false)}
        initialSelectedEventId={selectedRegistrationEventId}
      />

      {/* INTERACTIVE CSE CLI TERMINAL WIDGET */}
      <CseTerminalWidget
        onOpenRegister={(eventId) => handleOpenRegistration(eventId)}
        onOpenGuideline={(eventId) => handleOpenGuidelineById(eventId)}
      />

      {/* INTERACTIVE CISABZ AI ASSISTANT CHATBOT */}
      <CseAiAssistantModal />
    </div>
  );
}

export default App;
