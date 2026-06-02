import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ExternalLink, MessageSquare } from "lucide-react";
import { useContent } from "../context/ContentContext";
import { safeSessionStorage } from "../utils/safeStorage";

export default function PromoPopup() {
  const { promoPopupConfig } = useContent();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // If the admin has disabled showing the promotion popup, don't show it at all
    if (!promoPopupConfig || !promoPopupConfig.show || !promoPopupConfig.imageUrl) {
      return;
    }

    // Check if the user has already dismissed or viewed the promo in this session
    const hasViewedInSession = safeSessionStorage.getItem("avexon_promo_popup_viewed") === "true";
    if (hasViewedInSession) {
      return;
    }

    // Wait exactly 2 seconds after mounting to trigger the popup
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, [promoPopupConfig]);

  const handleClose = () => {
    setIsOpen(false);
    // Persist session-level closure so it doesn't keep popping up on every internal click/state refresh
    safeSessionStorage.setItem("avexon_promo_popup_viewed", "true");
  };

  if (!isOpen || !promoPopupConfig || !promoPopupConfig.imageUrl) return null;

  const handleActionClick = () => {
    handleClose();
    if (promoPopupConfig.linkUrl) {
      window.open(promoPopupConfig.linkUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="absolute inset-0 bg-black/75 backdrop-blur-sm cursor-pointer"
        />

        {/* Modal body */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          transition={{ type: "spring", damping: 25, stiffness: 350 }}
          className="relative bg-[#130E26]/95 border border-purple-500/30 rounded-2xl overflow-hidden w-full max-w-lg shadow-[0_0_50px_rgba(147,51,234,0.25)] flex flex-col z-10"
        >
          {/* Close trigger top-right icon */}
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 z-20 bg-black/40 hover:bg-black/70 text-slate-100 hover:text-red-400 p-2 rounded-full transition-colors duration-200 border border-white/10"
            aria-label="Close promotion modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Picture frame section */}
          <div 
            onClick={handleActionClick}
            className="relative cursor-pointer overflow-hidden group aspect-[3/2] flex items-center justify-center bg-[#07040E]"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#130E26] via-transparent to-black/30 z-10 opacity-70 group-hover:opacity-40 transition-opacity duration-300" />
            <img
              src={promoPopupConfig.imageUrl}
              alt="Special Promotion"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              referrerPolicy="no-referrer"
            />
            
            {promoPopupConfig.linkUrl && (
              <div className="absolute bottom-3 right-3 z-20 bg-purple-600/90 hover:bg-purple-500 text-white p-2 rounded-full text-xs flex items-center gap-1 shadow-md opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                <ExternalLink className="w-4 h-4" />
              </div>
            )}
          </div>

          {/* Detail card interactions footer segment */}
          <div className="p-5 md:p-6 flex flex-col gap-4 text-center">
            <div className="flex flex-col gap-1 items-center">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20">
                💥 Special Announcement
              </span>
            </div>

            {promoPopupConfig.buttonText && (
              <button
                onClick={handleActionClick}
                className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-medium shadow-[0_4px_20px_rgba(168,85,247,0.35)] hover:shadow-[0_4px_25px_rgba(168,85,247,0.5)] transition-all duration-300 scale-100 hover:scale-[1.01] active:scale-[0.99] group"
              >
                <MessageSquare className="w-5 h-5 group-hover:animate-bounce" />
                <span>{promoPopupConfig.buttonText}</span>
              </button>
            )}

            <button
              onClick={handleClose}
              className="text-xs text-slate-400 hover:text-slate-100 transition-colors duration-200 mt-1 font-medium underline underline-offset-4"
            >
              এখন বন্ধ করুন
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
