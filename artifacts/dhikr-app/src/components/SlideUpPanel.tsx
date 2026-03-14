import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, AnimatePresence, useDragControls } from "framer-motion";
import { X, ChevronLeft } from "lucide-react";

interface SlideUpPanelProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  showBack?: boolean;
}

export function SlideUpPanel({ isOpen, onClose, title, children, showBack = false }: SlideUpPanelProps) {
  const [dragY, setDragY] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-[60]"
            onClick={onClose}
          />

          <motion.div
            ref={panelRef}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300, mass: 0.8 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 120 || info.velocity.y > 400) {
                onClose();
              }
            }}
            className="fixed bottom-0 left-0 right-0 z-[60] bg-card rounded-t-[28px] shadow-xl flex flex-col"
            style={{ maxHeight: "92vh", touchAction: "none" }}
          >
            <div className="flex flex-col items-center pt-3 pb-2 px-5 shrink-0">
              <div className="w-10 h-1 rounded-full bg-muted-foreground/20 mb-3" />

              <div className="w-full flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {showBack && (
                    <button
                      onClick={onClose}
                      className="w-8 h-8 rounded-full bg-muted flex items-center justify-center"
                    >
                      <ChevronLeft className="w-4 h-4 text-foreground" />
                    </button>
                  )}
                  {title && (
                    <h2 className="text-lg font-bold text-foreground">{title}</h2>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-muted flex items-center justify-center"
                >
                  <X className="w-4 h-4 text-foreground" />
                </button>
              </div>
            </div>

            <div
              className="flex-1 overflow-y-auto px-5 pb-16 overscroll-contain"
              style={{ touchAction: "pan-y" }}
              onPointerDown={(e) => e.stopPropagation()}
            >
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
