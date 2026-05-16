import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";

// =====================================================
// Zay. side hustle for your thumb.
// Bricolage Grotesque + JetBrains Mono. Purple accent on paper.
// =====================================================

const VOLT = "#A78BF5";
const VOLT_DEEP = "#6B21A8";
const PAPER = "#F5F1E8";
const PAPER_DEEP = "#EBE5D2";
const INK = "#141210";
const MUTED = "#6B6359";

const DROPS = [
  { id: 1, brand: "Aimé Leon Dore", bg: "#FFB84D", question: "new colourway. cop or drop?", visual: "👟" },
  { id: 2, brand: "Spotify", bg: "#7BC4A4", question: "wrapped, but in june?", visual: "🎧" },
  { id: 3, brand: "Glossier", bg: "#E89BB8", question: "this shade name: main character", visual: "💄" },
  { id: 4, brand: "Arc'teryx", bg: "#5B7FB8", question: "puffer in pastel pink. yes?", visual: "🧥" },
  { id: 5, brand: "Trader Joe's", bg: "#D4574E", question: "bring back the everything seasoning sticks?", visual: "🥯" },
];

// =====================================================
// SWIPE DEMO
// =====================================================
function SwipeCard({ drop, onSwipe, index, isTop, shouldNudge, onUserInteract }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-12, 12]);
  const yayOpacity = useTransform(x, [20, 100], [0, 1]);
  const nayOpacity = useTransform(x, [-100, -20], [1, 0]);
  const nudgeControlsRef = useRef(null);
  const interactedRef = useRef(false);

  // Demo nudge: tease left, tease right, settle. Only on the very first card.
  useEffect(() => {
    if (!isTop || !shouldNudge) return;
    let cancelled = false;
    const run = async () => {
      await new Promise((r) => setTimeout(r, 1400));
      if (cancelled || interactedRef.current) return;
      // right peek
      nudgeControlsRef.current = animate(x, 55, { duration: 0.55, ease: [0.32, 0.72, 0, 1] });
      await nudgeControlsRef.current;
      if (cancelled || interactedRef.current) return;
      // left peek
      nudgeControlsRef.current = animate(x, -55, { duration: 0.7, ease: [0.4, 0, 0.4, 1] });
      await nudgeControlsRef.current;
      if (cancelled || interactedRef.current) return;
      // settle
      nudgeControlsRef.current = animate(x, 0, { type: "spring", stiffness: 200, damping: 18 });
    };
    run();
    return () => {
      cancelled = true;
      nudgeControlsRef.current?.stop?.();
    };
  }, [isTop, shouldNudge, x]);

  const stopNudgeAndFlag = () => {
    interactedRef.current = true;
    nudgeControlsRef.current?.stop?.();
    onUserInteract?.();
  };

  const handleDragStart = () => {
    stopNudgeAndFlag();
  };

  const handleDragEnd = (e, info) => {
    if (Math.abs(info.offset.x) > 100 || Math.abs(info.velocity.x) > 500) {
      onSwipe(info.offset.x > 0 ? "yay" : "nay");
    }
  };

  return (
    <motion.div
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.6}
      onDragStart={handleDragStart}
      onPointerDown={isTop ? stopNudgeAndFlag : undefined}
      onDragEnd={handleDragEnd}
      style={{
        x: isTop ? x : 0,
        rotate: isTop ? rotate : 0,
        background: drop.bg,
        zIndex: 10 - index,
      }}
      initial={{ opacity: 0, scale: 0.92, y: 20 }}
      animate={{ opacity: 1, scale: 1 - index * 0.04, y: index * 8 }}
      transition={{ type: "spring", stiffness: 280, damping: 26 }}
      exit={{
        x: x.get() > 0 ? 600 : -600,
        opacity: 0,
        rotate: x.get() > 0 ? 25 : -25,
        transition: { duration: 0.35, ease: [0.32, 0.72, 0, 1] },
      }}
      className={`absolute inset-0 rounded-2xl overflow-hidden ${
        isTop ? "cursor-grab active:cursor-grabbing" : "pointer-events-none"
      }`}
    >
      <motion.div
        style={{ opacity: yayOpacity, border: `2.5px solid ${INK}` }}
        className="absolute top-8 right-6 z-20 px-3 py-1 rotate-12 rounded-md"
      >
        <div
          className="text-xl tracking-wider"
          style={{ color: INK, fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 900 }}
        >
          YAY
        </div>
      </motion.div>
      <motion.div
        style={{ opacity: nayOpacity, border: `2.5px solid ${INK}` }}
        className="absolute top-8 left-6 z-20 px-3 py-1 -rotate-12 rounded-md"
      >
        <div
          className="text-xl tracking-wider"
          style={{ color: INK, fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 900 }}
        >
          NAY
        </div>
      </motion.div>

      <div className="relative h-full flex flex-col p-5">
        <div className="flex items-center justify-between">
          <span
            className="text-[10px] uppercase tracking-[0.15em] px-2 py-1 rounded"
            style={{
              color: INK,
              background: "rgba(0,0,0,0.1)",
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 600,
            }}
          >
            {drop.brand}
          </span>
          <span
            className="text-[10px]"
            style={{
              color: INK,
              opacity: 0.65,
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 600,
            }}
          >
            +25 pts
          </span>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center text-center px-2">
          <div className="text-[72px] leading-none mb-4">{drop.visual}</div>
          <p
            className="leading-tight"
            style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              color: INK,
              fontWeight: 700,
              fontSize: "1.4rem",
              letterSpacing: "-0.01em",
            }}
          >
            {drop.question}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function SwipeDemo() {
  const [cards, setCards] = useState(DROPS);
  const [points, setPoints] = useState(0);
  const [lastSwipe, setLastSwipe] = useState(null);
  const [pulseKey, setPulseKey] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);

  const handleSwipe = (dir) => {
    setHasInteracted(true);
    setLastSwipe({ dir, key: Date.now() });
    setPoints((p) => p + 25);
    setPulseKey((k) => k + 1);
    setTimeout(() => setCards((prev) => prev.slice(1)), 320);
    setTimeout(() => setLastSwipe(null), 900);
  };

  const reset = () => {
    setCards(DROPS);
    setPoints(0);
    // Don't reset hasInteracted — they've already learned how it works
  };

  return (
    <div className="relative">
      <div className="relative mx-auto" style={{ width: "300px" }}>
        <div
          className="relative rounded-[2.5rem] p-2.5"
          style={{
            background: INK,
            boxShadow: "0 25px 60px -15px rgba(20,18,16,0.3)",
          }}
        >
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-5 rounded-full bg-black z-40" />

          <div
            className="rounded-[2rem] overflow-hidden relative flex flex-col"
            style={{ height: "560px", background: PAPER }}
          >
            <div
              className="flex items-center justify-between px-6 pt-3 pb-1 text-[11px]"
              style={{ color: INK, fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}
            >
              <span>9:41</span>
              <span style={{ opacity: 0.4, letterSpacing: 2 }}>●●●●●</span>
            </div>

            <div className="px-5 pt-5 pb-3 flex items-end justify-between">
              <div>
                <div
                  className="text-[10px] uppercase tracking-[0.2em] mb-1"
                  style={{ color: MUTED, fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}
                >
                  today
                </div>
                <div
                  className="text-3xl leading-none"
                  style={{
                    fontFamily: "'Bricolage Grotesque', sans-serif",
                    color: INK,
                    fontWeight: 900,
                    letterSpacing: "-0.03em",
                  }}
                >
                  zay
                </div>
              </div>
              <motion.div
                key={pulseKey}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                className="px-3 py-1 text-xs flex items-center gap-1"
                style={{
                  background: VOLT,
                  color: INK,
                  borderRadius: 999,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: 700,
                  border: `1.5px solid ${INK}`,
                }}
              >
                {points} pts
              </motion.div>
            </div>

            <div className="px-5 flex-1 flex items-center justify-center min-h-0">
              <div className="relative w-full" style={{ height: "340px" }}>
                <AnimatePresence>
                  {cards.length > 0 ? (
                    cards.slice(0, 3).map((drop, i) => (
                      <SwipeCard
                        key={drop.id}
                        drop={drop}
                        index={i}
                        isTop={i === 0}
                        shouldNudge={i === 0 && drop.id === DROPS[0].id && !hasInteracted}
                        onUserInteract={() => setHasInteracted(true)}
                        onSwipe={handleSwipe}
                      />
                    ))
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
                    >
                      <div
                        className="text-2xl mb-3 leading-tight"
                        style={{
                          fontFamily: "'Bricolage Grotesque', sans-serif",
                          color: INK,
                          fontWeight: 800,
                          letterSpacing: "-0.02em",
                        }}
                      >
                        that's it for today.
                      </div>
                      <div
                        className="text-xs mb-5"
                        style={{ color: MUTED, fontFamily: "'JetBrains Mono', monospace" }}
                      >
                        you made {points} pts
                      </div>
                      <button
                        onClick={reset}
                        className="px-4 py-2 text-sm"
                        style={{
                          background: INK,
                          color: PAPER,
                          borderRadius: 999,
                          fontFamily: "'Bricolage Grotesque', sans-serif",
                          fontWeight: 700,
                        }}
                      >
                        go again
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {cards.length > 0 && (
              <div
                className="text-center text-[10px] pt-2 pb-1"
                style={{ color: MUTED, fontFamily: "'JetBrains Mono', monospace" }}
              >
                swipe or tap
              </div>
            )}

            {cards.length > 0 && (
              <div className="flex items-center justify-center gap-4 px-5 pb-6 pt-2">
                <motion.button
                  whileTap={{ scale: 0.88 }}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => handleSwipe("nay")}
                  className="w-14 h-14 rounded-full flex items-center justify-center text-xl"
                  style={{
                    background: PAPER_DEEP,
                    color: INK,
                    border: `1.5px solid ${INK}`,
                  }}
                >
                  ✕
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.88 }}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => handleSwipe("yay")}
                  className="w-14 h-14 rounded-full flex items-center justify-center text-xl"
                  style={{
                    background: VOLT,
                    color: INK,
                    border: `1.5px solid ${INK}`,
                  }}
                >
                  ♥
                </motion.button>
              </div>
            )}
          </div>
        </div>

        <AnimatePresence>
          {lastSwipe && (
            <motion.div
              key={lastSwipe.key}
              initial={{ opacity: 0, y: 0, scale: 0.7 }}
              animate={{ opacity: 1, y: -60, scale: 1, rotate: lastSwipe.dir === "yay" ? 4 : -4 }}
              exit={{ opacity: 0, y: -120 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="absolute top-1/3 left-1/2 -translate-x-1/2 px-4 py-2 pointer-events-none z-50"
              style={{
                background: INK,
                color: VOLT,
                borderRadius: 999,
                fontFamily: "'Bricolage Grotesque', sans-serif",
                fontWeight: 900,
                fontSize: 14,
                letterSpacing: "0.02em",
              }}
            >
              +25
            </motion.div>
          )}
        </AnimatePresence>

        {/* First-time swipe hint */}
        <AnimatePresence>
          {!hasInteracted && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10, transition: { duration: 0.2 } }}
              transition={{ duration: 0.5, delay: 1.6 }}
              className="hidden md:flex absolute items-center gap-2 pointer-events-none"
              style={{
                top: "42%",
                left: "calc(100% + 16px)",
                whiteSpace: "nowrap",
              }}
            >
              {/* Hand-drawn arrow pointing left at the phone */}
              <svg width="60" height="32" viewBox="0 0 60 32" fill="none" style={{ transform: "rotate(8deg)" }}>
                <path
                  d="M 56 16 Q 36 6, 18 14 Q 10 17, 4 16 M 12 10 L 4 16 L 12 22"
                  stroke={INK}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
              <motion.span
                animate={{ rotate: [-2, 2, -2] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="px-3 py-1.5 inline-block"
                style={{
                  background: VOLT,
                  color: INK,
                  border: `1.5px solid ${INK}`,
                  borderRadius: 999,
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  fontWeight: 800,
                  fontSize: 14,
                  letterSpacing: "-0.01em",
                }}
              >
                swipe me →
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// =====================================================
// WAITLIST FORM
// =====================================================
function WaitlistForm() {
  const WELCOME_POINTS = 100;
  // These are the values you'll use server-side when reconciling real referral
  // counts from your Formspree export. Keep them in sync with what's in the UI copy.
  // eslint-disable-next-line no-unused-vars
  const REFERRAL_POINTS = 50;
  // eslint-disable-next-line no-unused-vars
  const REFERRAL_CAP = 20;

  // ============================================================
  // FORMSPREE — waitlist signups land in your Formspree dashboard
  // and email you on every submit. Form ID is set below.
  // To change destination: edit the form in your Formspree dashboard.
  // To swap to a different form: replace the FORM_ID below.
  // ============================================================
  const FORMSPREE_FORM_ID = "maqvrzyk";
  const FORMSPREE_ENDPOINT = `https://formspree.io/f/${FORMSPREE_FORM_ID}`;

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [referredBy, setReferredBy] = useState(null);
  const [me, setMe] = useState(null); // { email, refCode, pts, refCount }
  const [copied, setCopied] = useState(false);

  // On load: detect ?ref=, restore existing user from localStorage
  useEffect(() => {
    // Pick up ref code from URL
    try {
      const params = new URLSearchParams(window.location.search);
      const ref = params.get("ref");
      if (ref && /^[a-z0-9]{4,8}$/i.test(ref)) {
        setReferredBy(ref.toLowerCase());
      }
    } catch {}

    // Restore "me" if previously signed up on this device
    try {
      const stored = window.localStorage?.getItem("zay_me");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.email && parsed?.refCode) {
          setMe(parsed);
          setStatus("success");
        }
      }
    } catch {}
  }, []);

  // Persist "me" to localStorage whenever it changes
  useEffect(() => {
    if (me) {
      try {
        window.localStorage?.setItem("zay_me", JSON.stringify(me));
      } catch {}
    }
  }, [me]);

  const generateRefCode = () =>
    Math.random().toString(36).slice(2, 8).toLowerCase();

  const submit = async () => {
    // Proper email regex (not perfect, but catches obvious junk like "a@b")
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!email || !emailRegex.test(email.trim())) {
      setStatus("error");
      return;
    }

    // Guard: if the form ID hasn't been set, fail loudly so we catch this in testing
    if (!FORMSPREE_FORM_ID || FORMSPREE_FORM_ID === "YOUR_FORM_ID") {
      console.error(
        "Zay waitlist: Formspree form ID not configured. Edit src/App.jsx and set FORMSPREE_FORM_ID."
      );
      setStatus("error");
      return;
    }

    setStatus("loading");

    const refCode = generateRefCode();
    const record = {
      email: email.trim().toLowerCase(),
      refCode,
      referredBy: referredBy || "",
      signedUpAt: new Date().toISOString(),
    };

    try {
      // Send to Formspree (emails you + stores in your dashboard)
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(record),
      });

      if (!response.ok) {
        throw new Error("Form submission failed");
      }

      // Note on referrals:
      // Real attribution lives server-side in Formspree (the "referredBy" field
      // on every signup tells you who invited each user). On launch day, export
      // your Formspree submissions and credit points based on that data.
      //
      // We deliberately don't try to update the referrer's localStorage here,
      // because: (1) they're probably on a different device, and (2) even if
      // they were on the same device, this device's "me" is about to be
      // overwritten by the new signup. So the counter stays at the user's own
      // referral count on their own device.

      setMe({
        email: record.email,
        refCode,
        pts: WELCOME_POINTS,
        refCount: 0,
      });
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  const inviteLink =
    me && typeof window !== "undefined"
      ? `${window.location.origin}${window.location.pathname}?ref=${me.refCode}`
      : "";

  const copyLink = async () => {
    if (!inviteLink) return;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(inviteLink);
      } else {
        // Fallback for non-HTTPS and older browsers
        const textarea = document.createElement("textarea");
        textarea.value = inviteLink;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Last resort — just leave the field visible, user can manually copy
    }
  };

  const shareOnTwitter = () => {
    const text = `just joined the zay waitlist. side hustle for your thumb. tell brands what you actually think and get paid for it. use my link for bonus points:`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(inviteLink)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const shareOnWhatsApp = () => {
    const text = `yo. join the zay waitlist with my link, we both get bonus points. ${inviteLink}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  // ===== SUCCESS / REFERRAL STATE =====
  if (status === "success" && me) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-lg"
      >
        {/* Points stack */}
        <div
          className="p-6 mb-5"
          style={{
            background: VOLT,
            border: `2px solid ${INK}`,
            borderRadius: 12,
          }}
        >
          <div
            className="text-[10px] uppercase tracking-[0.25em] mb-2"
            style={{ color: INK, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, opacity: 0.7 }}
          >
            you've earned
          </div>
          <div className="flex items-baseline gap-3 mb-3">
            <motion.div
              key={me.pts}
              initial={{ scale: 1.15 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="leading-none"
              style={{
                fontFamily: "'Bricolage Grotesque', sans-serif",
                color: INK,
                fontSize: "3.5rem",
                fontWeight: 900,
                letterSpacing: "-0.04em",
              }}
            >
              {me.pts}
            </motion.div>
            <div
              className="leading-none"
              style={{
                fontFamily: "'Bricolage Grotesque', sans-serif",
                color: INK,
                fontSize: "1.4rem",
                fontWeight: 800,
                letterSpacing: "-0.02em",
              }}
            >
              zay points
            </div>
          </div>
          <div
            className="text-xs"
            style={{ color: INK, fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, opacity: 0.75 }}
          >
            100 pts welcome bonus. earn 50 more for every friend who joins with your link.
          </div>
        </div>

        {/* Invite link */}
        <div className="mb-4">
          <div
            className="text-[10px] uppercase tracking-[0.25em] mb-2"
            style={{ color: MUTED, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}
          >
            your invite link
          </div>
          <div className="flex gap-2 items-stretch">
            <div
              className="flex-1 px-3 py-3 text-xs truncate flex items-center"
              style={{
                background: PAPER_DEEP,
                border: `2px solid ${INK}`,
                borderRadius: 8,
                color: INK,
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 500,
              }}
            >
              {inviteLink.replace(/^https?:\/\//, "")}
            </div>
            <button
              onClick={copyLink}
              className="px-4 transition-transform hover:scale-[1.03] active:scale-95"
              style={{
                background: copied ? INK : PAPER,
                color: copied ? VOLT : INK,
                borderRadius: 8,
                fontFamily: "'Bricolage Grotesque', sans-serif",
                fontWeight: 800,
                fontSize: 14,
                border: `2px solid ${INK}`,
                letterSpacing: "-0.01em",
                minWidth: "75px",
              }}
            >
              {copied ? "copied" : "copy"}
            </button>
          </div>
        </div>

        {/* Share buttons */}
        <div className="flex gap-2">
          <button
            onClick={shareOnWhatsApp}
            className="flex-1 px-4 py-2.5 transition-transform hover:scale-[1.02] active:scale-95"
            style={{
              background: PAPER,
              color: INK,
              borderRadius: 8,
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontWeight: 700,
              fontSize: 14,
              border: `2px solid ${INK}`,
              letterSpacing: "-0.01em",
            }}
          >
            share on whatsapp
          </button>
          <button
            onClick={shareOnTwitter}
            className="flex-1 px-4 py-2.5 transition-transform hover:scale-[1.02] active:scale-95"
            style={{
              background: PAPER,
              color: INK,
              borderRadius: 8,
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontWeight: 700,
              fontSize: 14,
              border: `2px solid ${INK}`,
              letterSpacing: "-0.01em",
            }}
          >
            share on x
          </button>
        </div>

        <div
          className="mt-4 text-xs"
          style={{ color: MUTED, fontFamily: "'JetBrains Mono', monospace", fontWeight: 500 }}
        >
          points land in your account on launch day. cash them out for real money, gift cards or exclusive drops.
        </div>
      </motion.div>
    );
  }

  // ===== SIGNUP STATE =====
  return (
    <div className="w-full max-w-md">
      {/* Referral banner — only shown if they arrived via someone's link */}
      {referredBy && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 px-3 py-2"
          style={{
            background: VOLT,
            border: `1.5px solid ${INK}`,
            borderRadius: 8,
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 600,
            fontSize: 12,
            color: INK,
          }}
        >
          a friend sent you. join now, you both get bonus points.
        </motion.div>
      )}

      <div className="flex gap-2 items-stretch">
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status === "error") setStatus("idle");
          }}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="you@school.edu"
          className="flex-1 px-4 py-3 text-base outline-none"
          style={{
            background: "transparent",
            border: `2px solid ${INK}`,
            color: INK,
            borderRadius: 8,
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 500,
          }}
        />
        <button
          onClick={submit}
          disabled={status === "loading"}
          className="px-5 py-3 disabled:opacity-50 transition-transform hover:scale-[1.02] active:scale-95"
          style={{
            background: VOLT,
            color: INK,
            borderRadius: 8,
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontWeight: 800,
            fontSize: 17,
            border: `2px solid ${INK}`,
            letterSpacing: "-0.01em",
          }}
        >
          {status === "loading" ? "..." : "i'm in"}
        </button>
      </div>
      <div
        className="mt-3 min-h-[20px] text-xs"
        style={{ color: MUTED, fontFamily: "'JetBrains Mono', monospace" }}
      >
        {status === "error" && (
          <div style={{ color: "#C73E2E", fontWeight: 600 }}>that doesn't look right. try again?</div>
        )}
        {status === "idle" && (
          <div>
            instant 100 pts + 50 per friend.
          </div>
        )}
      </div>
    </div>
  );
}

// =====================================================
// SCRIBBLES
// =====================================================
function Scribble({ className, style }) {
  return (
    <svg viewBox="0 0 120 80" className={className} style={style} fill="none">
      <path
        d="M 5 40 Q 30 10, 60 35 T 110 40 M 100 30 L 110 40 L 100 50"
        stroke={INK}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

function VoltHighlight({ children }) {
  return (
    <span style={{ position: "relative", display: "inline-block" }}>
      <span
        style={{
          position: "absolute",
          left: "-4px",
          right: "-4px",
          top: "20%",
          bottom: "10%",
          background: VOLT,
          zIndex: 0,
          transform: "rotate(-0.5deg)",
          borderRadius: 2,
        }}
      />
      <span style={{ position: "relative", zIndex: 1 }}>{children}</span>
    </span>
  );
}

// =====================================================
// NAV
// =====================================================
function Nav({ page, onNavigate }) {
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  const isBrands = page === "brands";
  return (
    <nav className="absolute top-0 left-0 right-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <div
          className="flex items-baseline gap-2 cursor-pointer"
          onClick={() => {
            if (isBrands) onNavigate("home");
            else window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          <div
            className="text-3xl leading-none"
            style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              color: INK,
              fontWeight: 900,
              letterSpacing: "-0.04em",
            }}
          >
            zay
          </div>
          {isBrands && (
            <div
              className="text-xs uppercase tracking-widest pb-1"
              style={{ color: MUTED, fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}
            >
              / for brands
            </div>
          )}
        </div>
        <div className="flex items-center gap-4 sm:gap-5">
          <button
            onClick={() => onNavigate(isBrands ? "home" : "brands")}
            className="text-xs uppercase tracking-widest transition-opacity hover:opacity-60"
            style={{ color: INK, fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}
          >
            {isBrands ? "← back" : "for brands"}
          </button>
          <button
            onClick={() => (isBrands ? scrollTo("contact") : scrollTo("waitlist"))}
            className="text-xs uppercase tracking-widest transition-opacity hover:opacity-60 hidden sm:block"
            style={{ color: INK, fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}
          >
            {isBrands ? "talk to us →" : "join the list →"}
          </button>
        </div>
      </div>
    </nav>
  );
}

// =====================================================
// HERO
// =====================================================
function Hero() {
  return (
    <section className="relative pt-32 pb-20 px-6" style={{ background: PAPER }}>
      <div className="max-w-6xl mx-auto grid lg:grid-cols-[1.2fr,1fr] gap-12 lg:gap-20 items-center">
        <div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-xs uppercase tracking-[0.25em] mb-6"
            style={{ color: MUTED, fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}
          >
            [ now in beta ]
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="leading-[0.92] mb-6"
            style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              color: INK,
              fontSize: "clamp(3.2rem, 8vw, 6rem)",
              letterSpacing: "-0.04em",
              fontWeight: 900,
            }}
          >
            side hustle <br />
            for your <VoltHighlight>thumb.</VoltHighlight>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-lg mb-10 max-w-md"
            style={{
              color: MUTED,
              fontFamily: "'Bricolage Grotesque', sans-serif",
              lineHeight: 1.4,
              fontWeight: 500,
            }}
          >
            tell brands what you actually think. <br />
            we'll pay you for it.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex items-center gap-5"
          >
            <button
              onClick={() => document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" })}
              className="px-7 py-3.5 transition-transform hover:scale-[1.03] active:scale-95"
              style={{
                background: VOLT,
                color: INK,
                border: `2px solid ${INK}`,
                borderRadius: 999,
                fontFamily: "'Bricolage Grotesque', sans-serif",
                fontWeight: 800,
                fontSize: 17,
                letterSpacing: "-0.01em",
              }}
            >
              get on the list
            </button>
            <div className="hidden sm:flex items-center gap-2">
              <Scribble style={{ width: 70, height: 40, transform: "rotate(-10deg)" }} />
              <span
                className="uppercase tracking-widest text-xs"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  color: INK,
                  fontWeight: 600,
                }}
              >
                try it →
              </span>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <SwipeDemo />
        </motion.div>
      </div>
    </section>
  );
}

// =====================================================
// HOW IT WORKS
// =====================================================
function HowItWorks() {
  const steps = [
    { n: "01", body: "we send you a drop. it's quick. tap, swipe, done." },
    { n: "02", body: "you tell us what you actually think. nay or yay. no essay." },
    { n: "03", body: "you earn points. cash them in. real money, gift cards, exclusive drops." },
  ];
  return (
    <section className="py-24 px-6" style={{ background: PAPER }}>
      <div className="max-w-3xl mx-auto">
        <div
          className="text-xs uppercase tracking-[0.25em] mb-12"
          style={{ color: MUTED, fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}
        >
          [ how it works ]
        </div>
        <div className="space-y-10">
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex items-start gap-6"
            >
              <span
                className="leading-none flex-shrink-0"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  color: VOLT_DEEP,
                  fontWeight: 700,
                  fontSize: "1.3rem",
                  paddingTop: "0.6rem",
                  minWidth: "2.5rem",
                }}
              >
                {s.n}
              </span>
              <p
                className="leading-snug"
                style={{
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  color: INK,
                  fontSize: "clamp(1.4rem, 3vw, 2rem)",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                }}
              >
                {s.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// =====================================================
// TESTIMONIALS
// =====================================================
function Testimonials() {
  const quotes = [
    {
      q: "thought it was a scam ngl. then £12 hit my revolut.",
      name: "lewis",
      where: "kingston uni",
      indent: false,
    },
    {
      q: "i swipe on this in lectures my profs would be so disappointed.",
      name: "maya",
      where: "esher college, 17",
      indent: true,
    },
    {
      q: "ok the fact i can earn money having opinions on trainers is actually kinda crazy",
      name: "sophia",
      where: "surrey, 17",
      indent: false,
    },
  ];
  return (
    <section className="py-24 px-6" style={{ background: PAPER_DEEP }}>
      <div className="max-w-3xl mx-auto">
        <div
          className="text-xs uppercase tracking-[0.25em] mb-12"
          style={{ color: MUTED, fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}
        >
          [ what people are saying ]
        </div>

        <div className="space-y-14">
          {quotes.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={item.indent ? "pl-0 sm:pl-16" : ""}
            >
              <p
                className="leading-tight mb-4"
                style={{
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  color: INK,
                  fontSize: "clamp(1.6rem, 3.5vw, 2.5rem)",
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                }}
              >
                "{item.q}"
              </p>
              <div
                className="text-xs uppercase tracking-widest"
                style={{
                  color: MUTED,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: 600,
                }}
              >
                {item.name} · {item.where}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// =====================================================
// WAITLIST
// =====================================================
function Waitlist() {
  return (
    <section id="waitlist" className="py-32 px-6 relative" style={{ background: PAPER }}>
      <div className="max-w-2xl mx-auto">
        <div
          className="text-xs uppercase tracking-[0.25em] mb-6"
          style={{ color: MUTED, fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}
        >
          [ waitlist ]
        </div>
        <h2
          className="leading-[0.92] mb-6"
          style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            color: INK,
            fontSize: "clamp(3rem, 7vw, 4.5rem)",
            fontWeight: 900,
            letterSpacing: "-0.04em",
          }}
        >
          you <VoltHighlight>in?</VoltHighlight>
        </h2>
        <p
          className="text-lg mb-10 max-w-md"
          style={{
            color: MUTED,
            fontFamily: "'Bricolage Grotesque', sans-serif",
            lineHeight: 1.4,
            fontWeight: 500,
          }}
        >
          start earning before launch. 100 points the second you join. 50 more for every friend you bring.
        </p>
        <WaitlistForm />
      </div>
    </section>
  );
}

// =====================================================
// FOOTER
// =====================================================
function Footer({ page, onNavigate }) {
  const isBrands = page === "brands";
  return (
    <footer className="py-12 px-6" style={{ background: PAPER, borderTop: `1.5px solid ${INK}` }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between gap-6 items-start sm:items-end">
          <div>
            <div
              className="text-3xl mb-2 leading-none"
              style={{
                fontFamily: "'Bricolage Grotesque', sans-serif",
                color: INK,
                fontWeight: 900,
                letterSpacing: "-0.04em",
              }}
            >
              zay
            </div>
            <div
              className="text-[10px] uppercase tracking-widest"
              style={{ color: MUTED, fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}
            >
              @haveyourzay everywhere
            </div>
          </div>

          <div
            className="text-xs space-y-1.5 sm:text-right"
            style={{ color: MUTED, fontFamily: "'JetBrains Mono', monospace", fontWeight: 500 }}
          >
            <div>
              <a
                href="mailto:bandish@zay.xyz"
                className="hover:underline"
                style={{ color: INK, fontWeight: 600 }}
              >
                bandish@zay.xyz
              </a>
            </div>
            {isBrands ? (
              <div>
                looking to join?{" "}
                <button
                  onClick={() => onNavigate("home")}
                  className="hover:underline"
                  style={{ color: INK, fontWeight: 600, background: "none", border: "none", padding: 0, cursor: "pointer", fontFamily: "inherit", fontSize: "inherit" }}
                >
                  zay.xyz
                </button>
              </div>
            ) : (
              <div>
                running a brand?{" "}
                <button
                  onClick={() => onNavigate("brands")}
                  className="hover:underline"
                  style={{ color: INK, fontWeight: 600, background: "none", border: "none", padding: 0, cursor: "pointer", fontFamily: "inherit", fontSize: "inherit" }}
                >
                  for brands →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}

// =====================================================
// BRANDS PAGE
// =====================================================

function BrandsHero() {
  return (
    <section className="relative pt-32 pb-20 px-6" style={{ background: PAPER }}>
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-xs uppercase tracking-[0.25em] mb-6"
          style={{ color: MUTED, fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}
        >
          [ for brands ]
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="leading-[0.92] mb-8"
          style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            color: INK,
            fontSize: "clamp(2.8rem, 7vw, 5.5rem)",
            letterSpacing: "-0.04em",
            fontWeight: 900,
          }}
        >
          what gen z <br />
          actually <VoltHighlight>thinks.</VoltHighlight>
          <br />
          before you ship it.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-xl mb-10 max-w-2xl"
          style={{
            color: MUTED,
            fontFamily: "'Bricolage Grotesque', sans-serif",
            lineHeight: 1.35,
            fontWeight: 500,
          }}
        >
          zay turns gen z instinct into structured signal, same day. <br />
          test a product, an ad, a name, a campaign. find out what they think before everyone else does.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
        >
          <a
            href="mailto:brands@zay.xyz"
            className="px-7 py-3.5 transition-transform hover:scale-[1.03] active:scale-95 inline-block"
            style={{
              background: VOLT,
              color: INK,
              border: `2px solid ${INK}`,
              borderRadius: 999,
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontWeight: 800,
              fontSize: 17,
              letterSpacing: "-0.01em",
              textDecoration: "none",
            }}
          >
            book a pilot
          </a>
          <div
            className="text-xs uppercase tracking-widest"
            style={{ color: MUTED, fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}
          >
            mvp live · panel growing · pilots opening
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function BrandsProblem() {
  const points = [
    {
      label: "scraping",
      body: "noise, bias, legal exposure. data they never agreed to give.",
    },
    {
      label: "surveys",
      body: "long, boring, ignored. self-selecting bias from people willing to do them.",
    },
    {
      label: "social listening",
      body: "no consent, no structure. you're guessing from chatter.",
    },
    {
      label: "focus groups",
      body: "slow, expensive, performative. eight people in a room is not a generation.",
    },
  ];
  return (
    <section className="py-24 px-6" style={{ background: PAPER }}>
      <div className="max-w-5xl mx-auto">
        <div
          className="text-xs uppercase tracking-[0.25em] mb-10"
          style={{ color: MUTED, fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}
        >
          [ what isn't working ]
        </div>
        <h2
          className="leading-[0.95] mb-14 max-w-3xl"
          style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            color: INK,
            fontSize: "clamp(2rem, 4.5vw, 3.2rem)",
            letterSpacing: "-0.03em",
            fontWeight: 800,
          }}
        >
          the tools brands use to read gen z were built before gen z existed.
        </h2>

        <div className="grid sm:grid-cols-2 gap-x-10 gap-y-8">
          {points.map((p, i) => (
            <motion.div
              key={p.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <div
                className="text-xs uppercase tracking-[0.25em] mb-2"
                style={{ color: VOLT_DEEP, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}
              >
                {p.label}
              </div>
              <p
                className="leading-snug"
                style={{
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  color: INK,
                  fontSize: "1.25rem",
                  fontWeight: 600,
                  letterSpacing: "-0.01em",
                }}
              >
                {p.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BrandsWhatYouGet() {
  const items = [
    {
      label: "01",
      title: "live sentiment, not stale data",
      body: "drop your question on monday. read the report on tuesday. that's the cycle.",
    },
    {
      label: "02",
      title: "structured signal, not scraped noise",
      body: "every response is intentional, paid and consented. clean data your team can actually use.",
    },
    {
      label: "03",
      title: "the questions you can't ask anywhere else",
      body: "test a name, a colourway, a campaign idea, a pricing point. before you commit a budget, find out what they actually think.",
    },
  ];
  return (
    <section className="py-24 px-6" style={{ background: PAPER_DEEP }}>
      <div className="max-w-5xl mx-auto">
        <div
          className="text-xs uppercase tracking-[0.25em] mb-10"
          style={{ color: MUTED, fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}
        >
          [ what you get ]
        </div>
        <div className="space-y-12">
          {items.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex items-start gap-6"
            >
              <span
                className="leading-none flex-shrink-0"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  color: VOLT_DEEP,
                  fontWeight: 700,
                  fontSize: "1.3rem",
                  paddingTop: "0.6rem",
                  minWidth: "2.5rem",
                }}
              >
                {s.label}
              </span>
              <div className="flex-1">
                <h3
                  className="leading-tight mb-3"
                  style={{
                    fontFamily: "'Bricolage Grotesque', sans-serif",
                    color: INK,
                    fontSize: "clamp(1.4rem, 3vw, 2rem)",
                    fontWeight: 800,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {s.title}
                </h3>
                <p
                  className="leading-relaxed max-w-2xl"
                  style={{
                    fontFamily: "'Bricolage Grotesque', sans-serif",
                    color: MUTED,
                    fontSize: "1.15rem",
                    fontWeight: 500,
                  }}
                >
                  {s.body}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BrandsHow() {
  const steps = [
    { n: "01", body: "you send us a brief. one question or twenty." },
    { n: "02", body: "we drop it to a matched gen z panel. they swipe, rank, react." },
    { n: "03", body: "you get a structured report. clean signal, real quotes, clear takeaways." },
    { n: "04", body: "you ship something better." },
  ];
  return (
    <section className="py-24 px-6" style={{ background: PAPER }}>
      <div className="max-w-3xl mx-auto">
        <div
          className="text-xs uppercase tracking-[0.25em] mb-12"
          style={{ color: MUTED, fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}
        >
          [ how it works ]
        </div>
        <div className="space-y-10">
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex items-start gap-6"
            >
              <span
                className="leading-none flex-shrink-0"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  color: VOLT_DEEP,
                  fontWeight: 700,
                  fontSize: "1.3rem",
                  paddingTop: "0.6rem",
                  minWidth: "2.5rem",
                }}
              >
                {s.n}
              </span>
              <p
                className="leading-snug"
                style={{
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  color: INK,
                  fontSize: "clamp(1.4rem, 3vw, 2rem)",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                }}
              >
                {s.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Sample report teaser — fake but realistic
function SampleReport() {
  const cards = [
    {
      brand: "trader joe's",
      question: "bring back the everything seasoning sticks?",
      yay: 87,
      nay: 13,
      quote: "they were unreal in scrambled eggs",
      bg: "#D4574E",
    },
    {
      brand: "spotify",
      question: "wrapped, but in june?",
      yay: 64,
      nay: 36,
      quote: "wrapped hits different in december, don't ruin it",
      bg: "#7BC4A4",
    },
    {
      brand: "aimé leon dore",
      question: "new colourway. cop or drop?",
      yay: 41,
      nay: 59,
      quote: "looks like a 2019 stussy collab i'm sorry",
      bg: "#FFB84D",
    },
  ];
  return (
    <section className="py-24 px-6" style={{ background: PAPER_DEEP }}>
      <div className="max-w-5xl mx-auto">
        <div
          className="text-xs uppercase tracking-[0.25em] mb-6"
          style={{ color: MUTED, fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}
        >
          [ sample output ]
        </div>
        <h2
          className="leading-[0.95] mb-3 max-w-3xl"
          style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            color: INK,
            fontSize: "clamp(2rem, 4.5vw, 3.2rem)",
            letterSpacing: "-0.03em",
            fontWeight: 800,
          }}
        >
          what a report looks like.
        </h2>
        <p
          className="mb-12 max-w-2xl"
          style={{
            color: MUTED,
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontSize: "1.1rem",
            lineHeight: 1.5,
            fontWeight: 500,
          }}
        >
          three real questions, three real reads. delivered as a dashboard, a deck or raw data, whatever your team works in.
        </p>

        <div className="grid md:grid-cols-3 gap-5">
          {cards.map((c, i) => (
            <motion.div
              key={c.brand}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-2xl overflow-hidden flex flex-col"
              style={{
                background: PAPER,
                border: `1.5px solid ${INK}`,
              }}
            >
              <div className="p-4" style={{ background: c.bg }}>
                <div
                  className="text-[10px] uppercase tracking-[0.2em] mb-2"
                  style={{ color: INK, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}
                >
                  {c.brand}
                </div>
                <p
                  className="leading-tight"
                  style={{
                    fontFamily: "'Bricolage Grotesque', sans-serif",
                    color: INK,
                    fontSize: "1.15rem",
                    fontWeight: 700,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {c.question}
                </p>
              </div>
              <div className="p-5 flex-1">
                {/* result bar */}
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="text-2xl leading-none"
                    style={{
                      fontFamily: "'Bricolage Grotesque', sans-serif",
                      fontWeight: 900,
                      color: INK,
                      letterSpacing: "-0.03em",
                    }}
                  >
                    {c.yay}%
                  </div>
                  <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: PAPER_DEEP }}>
                    <div
                      style={{
                        width: `${c.yay}%`,
                        height: "100%",
                        background: VOLT_DEEP,
                      }}
                    />
                  </div>
                  <div
                    className="text-[10px] uppercase tracking-widest"
                    style={{ color: MUTED, fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}
                  >
                    yay
                  </div>
                </div>
                <div
                  className="text-[10px] uppercase tracking-[0.2em] mb-1.5"
                  style={{ color: MUTED, fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}
                >
                  top response
                </div>
                <p
                  className="leading-snug"
                  style={{
                    fontFamily: "'Bricolage Grotesque', sans-serif",
                    color: INK,
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    fontStyle: "italic",
                  }}
                >
                  "{c.quote}"
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <div
          className="mt-6 text-xs uppercase tracking-widest"
          style={{ color: MUTED, fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}
        >
          * illustrative. real reports include cohort breakdowns, regional splits and verbatim quotes.
        </div>
      </div>
    </section>
  );
}

function BrandsPilots() {
  return (
    <section className="py-24 px-6" style={{ background: PAPER }}>
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-start">
        <div>
          <div
            className="text-xs uppercase tracking-[0.25em] mb-6"
            style={{ color: MUTED, fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}
          >
            [ pilots ]
          </div>
          <h2
            className="leading-[0.92] mb-6"
            style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              color: INK,
              fontSize: "clamp(2.2rem, 5vw, 3.5rem)",
              letterSpacing: "-0.04em",
              fontWeight: 900,
            }}
          >
            we're <VoltHighlight>opening</VoltHighlight> our <br />
            first paid pilots.
          </h2>
          <p
            className="text-lg mb-2"
            style={{
              color: MUTED,
              fontFamily: "'Bricolage Grotesque', sans-serif",
              lineHeight: 1.4,
              fontWeight: 500,
            }}
          >
            small cohort. hands on. fixed scope.
          </p>
          <p
            className="text-lg mb-8"
            style={{
              color: MUTED,
              fontFamily: "'Bricolage Grotesque', sans-serif",
              lineHeight: 1.4,
              fontWeight: 500,
            }}
          >
            you get a real report, we get a real partner. fair trade.
          </p>
        </div>
        <div
          className="p-8 rounded-2xl"
          style={{
            background: PAPER_DEEP,
            border: `1.5px solid ${INK}`,
          }}
        >
          <div
            className="text-xs uppercase tracking-[0.25em] mb-5"
            style={{ color: VOLT_DEEP, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}
          >
            what's included
          </div>
          <ul className="space-y-3 mb-6">
            {[
              "one structured brief, scoped together",
              "a custom drop to a matched gen z cohort",
              "structured report inside 5 working days",
              "verbatim quotes + cohort splits",
              "60 min readout call with the founders",
            ].map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-3"
                style={{
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  color: INK,
                  fontSize: "1.05rem",
                  fontWeight: 500,
                  lineHeight: 1.4,
                }}
              >
                <span style={{ color: VOLT_DEEP, fontWeight: 900 }}>→</span>
                {item}
              </li>
            ))}
          </ul>
          <a
            href="mailto:brands@zay.xyz?subject=pilot enquiry"
            className="inline-block px-5 py-2.5 transition-transform hover:scale-[1.03] active:scale-95"
            style={{
              background: VOLT,
              color: INK,
              border: `2px solid ${INK}`,
              borderRadius: 999,
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontWeight: 800,
              fontSize: 15,
              textDecoration: "none",
              letterSpacing: "-0.01em",
            }}
          >
            enquire about a pilot →
          </a>
        </div>
      </div>
    </section>
  );
}

function BrandsFAQ() {
  const faqs = [
    {
      q: "how fast can i actually get answers?",
      a: "most pilots turn around inside a working week. simple questions can move in 48 hours once your panel is matched.",
    },
    {
      q: "what makes this different from a survey tool?",
      a: "two things. one, the audience opted in to give signal and gets paid for it, so you're not fighting for attention. two, the format is swipe native, so response rates and completion are way higher than any survey you've run.",
    },
    {
      q: "is my panel reliable?",
      a: "we verify with student emails, profile data and quality controls on response patterns. you'll see cohort breakdowns in every report so you can read the data with context.",
    },
    {
      q: "what about gdpr and consent?",
      a: "every respondent opts in per drop and gets paid for their answer. nothing scraped, nothing inferred. consent is built into the system, not bolted on.",
    },
    {
      q: "what do reports look like?",
      a: "structured findings, cohort splits, verbatim quotes and the raw data if you want it. delivered as a doc, dashboard or csv. whatever your team uses.",
    },
    {
      q: "do you only work with consumer brands?",
      a: "right now, yes. anything where gen z and gen alpha are the consumer or the cultural signal. fashion, beauty, food, music, tech, media.",
    },
  ];
  return (
    <section className="py-24 px-6" style={{ background: PAPER_DEEP }}>
      <div className="max-w-3xl mx-auto">
        <div
          className="text-xs uppercase tracking-[0.25em] mb-10"
          style={{ color: MUTED, fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}
        >
          [ faq ]
        </div>
        <div className="space-y-6">
          {faqs.map((f, i) => (
            <motion.details
              key={i}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="group"
              style={{ borderBottom: `1px solid ${INK}33`, paddingBottom: "1.25rem" }}
            >
              <summary
                className="cursor-pointer flex justify-between items-start gap-4 list-none"
                style={{
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  color: INK,
                  fontSize: "1.2rem",
                  fontWeight: 700,
                  letterSpacing: "-0.01em",
                }}
              >
                <span>{f.q}</span>
                <span
                  className="flex-shrink-0 text-2xl leading-none transition-transform group-open:rotate-45"
                  style={{ color: VOLT_DEEP, fontWeight: 300 }}
                >
                  +
                </span>
              </summary>
              <p
                className="mt-3 leading-relaxed"
                style={{
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  color: MUTED,
                  fontSize: "1.05rem",
                  fontWeight: 500,
                }}
              >
                {f.a}
              </p>
            </motion.details>
          ))}
        </div>
      </div>
    </section>
  );
}

function BrandsContact() {
  return (
    <section id="contact" className="py-32 px-6" style={{ background: PAPER }}>
      <div className="max-w-2xl mx-auto">
        <div
          className="text-xs uppercase tracking-[0.25em] mb-6"
          style={{ color: MUTED, fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}
        >
          [ talk to us ]
        </div>
        <h2
          className="leading-[0.92] mb-6"
          style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            color: INK,
            fontSize: "clamp(2.5rem, 6vw, 4rem)",
            fontWeight: 900,
            letterSpacing: "-0.04em",
          }}
        >
          got a <VoltHighlight>question</VoltHighlight> <br />
          for gen z?
        </h2>
        <p
          className="text-lg mb-10 max-w-md"
          style={{
            color: MUTED,
            fontFamily: "'Bricolage Grotesque', sans-serif",
            lineHeight: 1.4,
            fontWeight: 500,
          }}
        >
          drop us a line. we'll come back inside 24 hours with a real human and a real plan.
        </p>
        <a
          href="mailto:brands@zay.xyz?subject=hello from a brand"
          className="inline-block px-7 py-4 transition-transform hover:scale-[1.03] active:scale-95"
          style={{
            background: VOLT,
            color: INK,
            border: `2px solid ${INK}`,
            borderRadius: 999,
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontWeight: 800,
            fontSize: 18,
            letterSpacing: "-0.01em",
            textDecoration: "none",
          }}
        >
          brands@zay.xyz →
        </a>
      </div>
    </section>
  );
}

// =====================================================
// APP
// =====================================================
export default function App() {
  const [page, setPage] = useState("home");

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,700;12..96,800;12..96,900&family=JetBrains+Mono:wght@400;500;600;700&display=swap";
    document.head.appendChild(link);
    document.body.style.fontFamily = "'Bricolage Grotesque', sans-serif";
    document.body.style.background = PAPER;
    document.body.style.color = INK;
    return () => link.remove();
  }, []);

  const navigate = (p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  return (
    <div className="min-h-screen relative" style={{ background: PAPER, color: INK }}>
      <Nav page={page} onNavigate={navigate} />
      {page === "home" ? (
        <>
          <Hero />
          <HowItWorks />
          <Testimonials />
          <Waitlist />
        </>
      ) : (
        <>
          <BrandsHero />
          <BrandsProblem />
          <BrandsWhatYouGet />
          <BrandsHow />
          <SampleReport />
          <BrandsPilots />
          <BrandsFAQ />
          <BrandsContact />
        </>
      )}
      <Footer page={page} onNavigate={navigate} />
    </div>
  );
}
