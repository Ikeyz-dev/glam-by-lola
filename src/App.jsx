import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence, useMotionValue, useAnimationFrame } from "framer-motion";
import { ArrowUpRight, MapPin, Phone, Mail, InstagramIcon, ChevronDown, Star, Sparkles, Play } from "lucide-react";

/* ============================================================
   BRAND TOKENS
   ============================================================ */
const C = {
    ink: "#0a0806",
    inkMid: "#1a1410",
    inkSoft: "#2a201a",
    gold: "#c8a96e",
    goldLight: "#e2c898",
    goldPale: "#f5ead6",
    cream: "#faf6ef",
    muted: "#7a6a5a",
    mutedLight: "#a89880",
};

/* ============================================================
   REAL SERVICES DATA
   ============================================================ */
const MAKEUP_SERVICES = [
    { name: "Airbrush Make-up", tag: "Flawless finish" },
    { name: "Bridal Make-up", tag: "Your perfect day" },
    { name: "Brow Shaping", tag: "Frame your face" },
    { name: "Clean Makeup", tag: "Effortless glow" },
    { name: "Eyelash Extensions", tag: "Open & defined" },
    { name: "Fashion Show Makeup", tag: "Runway ready" },
    { name: "Beauty Makeovers", tag: "Transform" },
    { name: "Makeup Classes", tag: "Learn the craft" },
    { name: "Performance Make-up", tag: "Stage & screen" },
    { name: "Photography Make-up", tag: "Camera perfect" },
    { name: "Special Occasion Makeup", tag: "Every milestone" },
    { name: "Television Make-up", tag: "HD ready" },
    { name: "Theatre & Costume", tag: "Character artistry" },
    { name: "Gele Services", tag: "Cultural elegance" },
    { name: "Private Lessons", tag: "1-on-1 mastery" },
];

const NAIL_SERVICES = [
    { name: "Acrylic Nails", tag: "Sculptured perfection" },
    { name: "Nail Designs", tag: "Artistry on every tip" },
    { name: "Nail Extensions", tag: "Length & drama" },
    { name: "Nail Painting", tag: "Flawless colour" },
    { name: "Nail Polish Changes", tag: "Quick refresh" },
];

const TESTIMONIALS = [
    {
        text: "I came in for my wedding glam and left in tears — happy tears. Lola understood exactly what I envisioned without me even articulating it fully. Every guest asked who did my makeup.",
        name: "Adaeze O.",
        tag: "Bridal Client",
        location: "Lekki",
        rating: 5,
        avatar: "AO",
    },
    {
        text: "This studio is the real deal. The precision, the products, the atmosphere — it's genuinely world-class. My eyelash extensions looked natural and full for weeks. Never going anywhere else.",
        name: "Funmi A.",
        tag: "Regular Client",
        location: "Egbe",
        rating: 5,
        avatar: "FA",
    },
    {
        text: "Took a makeup class with Lola and it completely changed how I see beauty. The techniques, the attention to detail — she gives you everything. Worth every kobo.",
        name: "Chioma E.",
        tag: "Makeup Student",
        location: "Isolo",
        rating: 5,
        avatar: "CE",
    },
    {
        text: "My acrylic nails have never looked this elegant. Clean, long-lasting, and the nail art was simply stunning. The studio itself feels like a luxury escape in the middle of Lagos.",
        name: "Temi B.",
        tag: "Nail Client",
        location: "Surulere",
        rating: 5,
        avatar: "TB",
    },
];

const PRICING = [
    {
        tier: "Essentials",
        subtitle: "Everyday beauty",
        price: "From ₦8,000",
        accent: false,
        services: ["Nail Polish Changes", "Brow Shaping", "Clean Makeup", "Beauty Makeovers"],
    },
    {
        tier: "Signature",
        subtitle: "The Glam experience",
        price: "From ₦25,000",
        accent: true,
        services: ["Airbrush Make-up", "Eyelash Extensions", "Acrylic Nails + Design", "Gele Services", "Photography Makeup"],
    },
    {
        tier: "Prestige",
        subtitle: "Full transformation",
        price: "From ₦80,000",
        accent: false,
        services: ["Bridal Full Package", "Makeup Classes (3 sessions)", "Private 1-on-1 Lessons", "TV & Fashion Show Makeup", "Theatre & Costume"],
    },
];

/* ============================================================
   UTILITY
   ============================================================ */
const WA_LINK = "https://wa.me/2347087172867?text=Hello%20Glam%20by%20Lola!%20I%20would%20like%20to%20book%20an%20appointment.";

function lerp(a, b, t) { return a + (b - a) * t; }

/* ============================================================
   CUSTOM CURSOR
   ============================================================ */
function CustomCursor() {
    const cursorRef = useRef(null);
    const dotRef = useRef(null);
    const pos = useRef({ x: -100, y: -100 });
    const current = useRef({ x: -100, y: -100 });
    const [hovered, setHovered] = useState(false);

    useEffect(() => {
        const move = (e) => { pos.current = { x: e.clientX, y: e.clientY }; };
        window.addEventListener("mousemove", move);

        const onEnter = () => setHovered(true);
        const onLeave = () => setHovered(false);
        document.querySelectorAll("a, button, [data-cursor]").forEach(el => {
            el.addEventListener("mouseenter", onEnter);
            el.addEventListener("mouseleave", onLeave);
        });

        let raf;
        const animate = () => {
            current.current.x = lerp(current.current.x, pos.current.x, 0.12);
            current.current.y = lerp(current.current.y, pos.current.y, 0.12);
            if (cursorRef.current) {
                cursorRef.current.style.transform = `translate(${current.current.x - 20}px, ${current.current.y - 20}px)`;
            }
            if (dotRef.current) {
                dotRef.current.style.transform = `translate(${pos.current.x - 3}px, ${pos.current.y - 3}px)`;
            }
            raf = requestAnimationFrame(animate);
        };
        raf = requestAnimationFrame(animate);
        return () => { window.removeEventListener("mousemove", move); cancelAnimationFrame(raf); };
    }, []);

    return (
        <>
            <div ref={cursorRef} style={{
                position: "fixed", top: 0, left: 0, width: 40, height: 40, borderRadius: "50%",
                border: `1px solid ${hovered ? C.gold : "rgba(200,169,110,0.5)"}`,
                pointerEvents: "none", zIndex: 9999, transition: "border-color 0.3s, transform 0.05s",
                mixBlendMode: "difference",
                transform: hovered ? "scale(1.8)" : "scale(1)",
            }} />
            <div ref={dotRef} style={{
                position: "fixed", top: 0, left: 0, width: 6, height: 6, borderRadius: "50%",
                background: C.gold, pointerEvents: "none", zIndex: 9999,
            }} />
        </>
    );
}

/* ============================================================
   MAGNETIC BUTTON
   ============================================================ */
function MagneticBtn({ children, className = "", href, onClick, style = {} }) {
    const ref = useRef(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const sx = useSpring(x, { stiffness: 200, damping: 20 });
    const sy = useSpring(y, { stiffness: 200, damping: 20 });

    const handleMouse = (e) => {
        const rect = ref.current.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        x.set((e.clientX - cx) * 0.35);
        y.set((e.clientY - cy) * 0.35);
    };
    const handleLeave = () => { x.set(0); y.set(0); };

    const Tag = href ? motion.a : motion.button;
    return (
        <Tag
            ref={ref}
            href={href} target={href ? "_blank" : undefined}
            onClick={onClick}
            onMouseMove={handleMouse}
            onMouseLeave={handleLeave}
            style={{ x: sx, y: sy, ...style }}
            className={className}
            whileTap={{ scale: 0.96 }}
        >
            {children}
        </Tag>
    );
}

/* ============================================================
   SCROLL REVEAL WRAPPER
   ============================================================ */
function Reveal({ children, delay = 0, y = 50, className = "" }) {
    return (
        <motion.div
            className={className}
            initial={{ opacity: 0, y }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.9, delay, ease: [0.25, 0.1, 0.25, 1] }}
        >
            {children}
        </motion.div>
    );
}

/* ============================================================
   FLOATING ORBS BACKGROUND
   ============================================================ */
function FloatingOrbs() {
    return (
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
            {[
                { w: 600, h: 600, top: "-20%", left: "-15%", color: "rgba(200,169,110,0.06)", dur: 18 },
                { w: 400, h: 400, top: "40%", right: "-10%", color: "rgba(200,169,110,0.04)", dur: 24 },
                { w: 300, h: 300, bottom: "10%", left: "20%", color: "rgba(200,169,110,0.05)", dur: 14 },
            ].map((orb, i) => (
                <motion.div key={i}
                    animate={{ y: [0, -40, 0], x: [0, 20, 0], scale: [1, 1.08, 1] }}
                    transition={{ duration: orb.dur, repeat: Infinity, ease: "easeInOut" }}
                    style={{
                        position: "absolute", width: orb.w, height: orb.h,
                        borderRadius: "50%", background: orb.color,
                        filter: "blur(80px)",
                        top: orb.top, left: orb.left, right: orb.right, bottom: orb.bottom,
                    }}
                />
            ))}
        </div>
    );
}

/* ============================================================
   NAV
   ============================================================ */
function Nav() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const { scrollY } = useScroll();

    useEffect(() => {
        return scrollY.onChange(v => setScrolled(v > 60));
    }, [scrollY]);

    const links = ["Services", "Gallery", "Pricing", "Reviews", "Contact"];

    return (
        <>
            <motion.nav
                style={{
                    position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
                    padding: "0 clamp(20px,5vw,72px)",
                    height: 72, display: "flex", alignItems: "center", justifyContent: "space-between",
                    backdropFilter: scrolled ? "blur(24px)" : "none",
                    background: scrolled ? "rgba(10,8,6,0.88)" : "transparent",
                    borderBottom: scrolled ? "1px solid rgba(200,169,110,0.12)" : "1px solid transparent",
                    transition: "all 0.5s ease",
                }}
            >
                {/* Logo */}
                <a href="#" style={{ textDecoration: "none" }}>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 19, fontWeight: 500, color: C.goldLight, letterSpacing: "0.06em", lineHeight: 1.1 }}>
                        Glam by Lola
                        <div style={{ fontSize: 9, letterSpacing: "0.4em", color: C.mutedLight, fontWeight: 300, textTransform: "uppercase", marginTop: 2 }}>Beauty Studio</div>
                    </div>
                </a>

                {/* Desktop links */}
                <div style={{ display: "flex", gap: 40, listStyle: "none" }} className="hide-mobile">
                    {links.map(l => (
                        <a key={l} href={`#${l.toLowerCase()}`}
                            style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: C.mutedLight, textDecoration: "none", transition: "color 0.3s" }}
                            onMouseEnter={e => e.target.style.color = C.goldLight}
                            onMouseLeave={e => e.target.style.color = C.mutedLight}
                        >{l}</a>
                    ))}
                </div>

                {/* CTA */}
                <MagneticBtn
                    href={WA_LINK}
                    style={{
                        padding: "10px 24px", background: C.gold, color: C.ink,
                        fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase",
                        fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", gap: 8,
                        fontFamily: "'DM Sans', sans-serif",
                    }}
                    className="hide-mobile"
                >
                    Book Now <ArrowUpRight size={13} />
                </MagneticBtn>

                {/* Hamburger */}
                <button onClick={() => setMenuOpen(v => !v)}
                    style={{ background: "none", border: "none", cursor: "pointer", padding: 8, display: "none" }}
                    className="show-mobile"
                >
                    <div style={{ width: 24, display: "flex", flexDirection: "column", gap: 5 }}>
                        <motion.span animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 7 : 0 }}
                            style={{ display: "block", height: 1.5, background: C.goldLight, transformOrigin: "center" }} />
                        <motion.span animate={{ opacity: menuOpen ? 0 : 1 }}
                            style={{ display: "block", height: 1.5, background: C.goldLight }} />
                        <motion.span animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -7 : 0 }}
                            style={{ display: "block", height: 1.5, background: C.goldLight, transformOrigin: "center" }} />
                    </div>
                </button>
            </motion.nav>

            {/* Mobile drawer */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 28, stiffness: 200 }}
                        style={{
                            position: "fixed", top: 0, right: 0, bottom: 0, width: "min(340px, 100vw)",
                            background: C.inkMid, zIndex: 99, padding: "100px 40px 40px",
                            borderLeft: `1px solid rgba(200,169,110,0.15)`,
                        }}
                    >
                        {links.map((l, i) => (
                            <motion.div key={l}
                                initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: i * 0.07 }}
                                style={{ marginBottom: 32 }}
                            >
                                <a href={`#${l.toLowerCase()}`} onClick={() => setMenuOpen(false)}
                                    style={{
                                        fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 300,
                                        color: C.cream, textDecoration: "none", letterSpacing: "0.02em",
                                    }}
                                >{l}</a>
                            </motion.div>
                        ))}
                        <a href={WA_LINK} target="_blank"
                            style={{
                                display: "inline-block", marginTop: 20,
                                padding: "14px 28px", background: C.gold, color: C.ink,
                                fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600,
                                textDecoration: "none",
                            }}
                        >Book Now</a>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

/* ============================================================
   HERO
   ============================================================ */
function Hero() {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
    const y = useTransform(scrollYProgress, [0, 1], [0, 180]);
    const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);

    const words = ["Makeup.", "Nail Art.", "Bridal.", "Gele.", "Lashes."];
    const [wordIdx, setWordIdx] = useState(0);
    useEffect(() => {
        const t = setInterval(() => setWordIdx(i => (i + 1) % words.length), 2200);
        return () => clearInterval(t);
    }, []);

    return (
        <section ref={ref} id="home" style={{
            position: "relative", minHeight: "100svh", display: "flex", alignItems: "flex-end",
            overflow: "hidden", background: C.ink,
            padding: "0 clamp(20px,5vw,72px) clamp(60px,10vh,100px)",
        }}>
            {/* BG image parallax */}
            <motion.div style={{ position: "absolute", inset: 0, y, scale }}>
                <img
                    src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1800&q=85"
                    alt="" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.35 }}
                />
                <div style={{
                    position: "absolute", inset: 0,
                    background: `linear-gradient(170deg, ${C.ink}88 0%, ${C.ink}cc 40%, ${C.ink}f5 100%)`
                }} />
            </motion.div>

            <FloatingOrbs />

            {/* Vertical text */}
            <div style={{
                position: "absolute", left: "clamp(20px,5vw,72px)", top: "50%", transform: "translateY(-50%)",
                writingMode: "vertical-rl", fontSize: 9, letterSpacing: "0.5em", color: C.muted,
                textTransform: "uppercase",
            }}>
                Lagos · Nigeria · Est. 2019
            </div>

            {/* Hero content */}
            <motion.div style={{ position: "relative", zIndex: 1, maxWidth: 900, opacity }}>
                {/* Eyebrow */}
                <Reveal delay={0.1}>
                    <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
                        <div style={{ width: 40, height: 1, background: C.gold }} />
                        <span style={{ fontSize: 10, letterSpacing: "0.45em", color: C.gold, textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif" }}>
                            Glam by Lola Beauty Studio
                        </span>
                    </div>
                </Reveal>

                {/* Main headline */}
                <Reveal delay={0.2}>
                    <h1 style={{
                        fontFamily: "'Cormorant Garamond', serif", fontWeight: 300,
                        fontSize: "clamp(56px,10vw,130px)", lineHeight: 0.9, letterSpacing: "-0.02em",
                        marginBottom: 16,
                    }}>
                        <span style={{ color: C.cream, display: "block" }}>Beauty is</span>
                        <span style={{ display: "block", color: C.goldLight, fontStyle: "italic", overflow: "hidden" }}>
                            <AnimatePresence mode="wait">
                                <motion.span
                                    key={wordIdx}
                                    initial={{ y: 80, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: -80, opacity: 0 }}
                                    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                                    style={{ display: "block" }}
                                >
                                    {words[wordIdx]}
                                </motion.span>
                            </AnimatePresence>
                        </span>
                    </h1>
                </Reveal>

                <Reveal delay={0.35}>
                    <p style={{
                        fontSize: "clamp(14px,1.8vw,17px)", color: C.mutedLight, fontWeight: 300,
                        lineHeight: 1.8, maxWidth: 460, marginBottom: 48,
                        fontFamily: "'DM Sans', sans-serif",
                    }}>
                        Premium makeup artistry, flawless nail studio & bridal transformations in the heart of Egbe, Lagos.
                    </p>
                </Reveal>

                <Reveal delay={0.5}>
                    <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
                        <MagneticBtn href={WA_LINK} style={{
                            padding: "16px 36px", background: C.gold, color: C.ink,
                            fontSize: 11, letterSpacing: "0.25em", textTransform: "uppercase", fontWeight: 600,
                            textDecoration: "none", display: "flex", alignItems: "center", gap: 10,
                            fontFamily: "'DM Sans', sans-serif",
                        }}>
                            Book Appointment <ArrowUpRight size={15} />
                        </MagneticBtn>
                        <MagneticBtn href="#services" style={{
                            padding: "15px 28px", border: "1px solid rgba(200,169,110,0.3)",
                            color: C.goldLight, fontSize: 11, letterSpacing: "0.25em", textTransform: "uppercase",
                            textDecoration: "none", fontFamily: "'DM Sans', sans-serif", display: "flex",
                            alignItems: "center", gap: 8,
                        }}>
                            View Services
                        </MagneticBtn>
                    </div>
                </Reveal>

                {/* Stats strip */}
                <Reveal delay={0.65}>
                    <div style={{ display: "flex", gap: clamp(32, 5, 60), marginTop: 64, paddingTop: 40, borderTop: "1px solid rgba(200,169,110,0.12)", flexWrap: "wrap" }}>
                        {[["2,000+", "Clients Served"], ["5★", "Google Rating"], ["15+", "Makeup Services"], ["2", "Specialities"]].map(([n, l]) => (
                            <div key={l}>
                                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(28px,3.5vw,40px)", fontWeight: 300, color: C.goldLight, lineHeight: 1 }}>{n}</div>
                                <div style={{ fontSize: 10, letterSpacing: "0.25em", color: C.muted, marginTop: 6, textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif" }}>{l}</div>
                            </div>
                        ))}
                    </div>
                </Reveal>
            </motion.div>

            {/* Scroll hint */}
            <motion.div
                animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }}
                style={{ position: "absolute", bottom: 32, right: "clamp(20px,5vw,72px)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}
            >
                <span style={{ fontSize: 9, letterSpacing: "0.4em", color: C.muted, textTransform: "uppercase", writingMode: "vertical-rl" }}>Scroll</span>
                <ChevronDown size={14} color={C.gold} />
            </motion.div>
        </section>
    );
}

/* small helper to avoid eval in JSX */
function clamp(v, min, max) { return v; }

/* ============================================================
   MARQUEE
   ============================================================ */
function Marquee() {
    const items = ["Bridal Glam", "Airbrush Makeup", "Eyelash Extensions", "Gele Services", "Acrylic Nails", "Makeup Classes", "Nail Designs", "Brow Shaping", "Fashion Show", "Photography Makeup"];
    const doubled = [...items, ...items];
    return (
        <div style={{ background: C.gold, padding: "13px 0", overflow: "hidden", whiteSpace: "nowrap" }}>
            <motion.div
                animate={{ x: ["0%", "-50%"] }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                style={{ display: "inline-flex" }}
            >
                {doubled.map((item, i) => (
                    <span key={i} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: "0.28em", textTransform: "uppercase", color: C.ink, fontWeight: 600, padding: "0 36px" }}>
                        {item} {i % items.length !== items.length - 1 ? "✦" : ""}
                    </span>
                ))}
            </motion.div>
        </div>
    );
}

/* ============================================================
   SERVICES — Bento grid
   ============================================================ */
function Services() {
    const [tab, setTab] = useState("makeup");

    return (
        <section id="services" style={{ background: C.inkMid, padding: "clamp(80px,12vh,140px) clamp(20px,5vw,72px)" }}>
            <Reveal>
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
                    <div style={{ width: 32, height: 1, background: C.gold }} />
                    <span style={{ fontSize: 10, letterSpacing: "0.4em", color: C.gold, textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif" }}>What We Do</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 24, marginBottom: 60 }}>
                    <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(40px,6vw,80px)", fontWeight: 300, lineHeight: 1.0, color: C.cream }}>
                        Two Studios.<br /><em style={{ color: C.goldLight }}>One Vision.</em>
                    </h2>
                    {/* Tab switcher */}
                    <div style={{ display: "flex", border: "1px solid rgba(200,169,110,0.2)", padding: 4, gap: 4 }}>
                        {[["makeup", "💄 Make-up Artist"], ["nails", "💅 Nail Salon"]].map(([key, label]) => (
                            <button key={key} onClick={() => setTab(key)}
                                style={{
                                    padding: "10px 20px", fontSize: 11, letterSpacing: "0.2em",
                                    textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
                                    background: tab === key ? C.gold : "transparent",
                                    color: tab === key ? C.ink : C.mutedLight,
                                    border: "none", fontWeight: tab === key ? 600 : 400,
                                    transition: "all 0.3s",
                                }}
                            >{label}</button>
                        ))}
                    </div>
                </div>
            </Reveal>

            {/* Service grid */}
            <AnimatePresence mode="wait">
                <motion.div key={tab}
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                        gap: 1, background: "rgba(200,169,110,0.08)",
                    }}
                >
                    {(tab === "makeup" ? MAKEUP_SERVICES : NAIL_SERVICES).map((svc, i) => (
                        <motion.div key={svc.name}
                            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.04 }}
                            whileHover={{ background: C.inkSoft }}
                            style={{
                                background: C.inkMid, padding: "28px 28px",
                                cursor: "default", position: "relative", overflow: "hidden",
                                borderBottom: "1px solid rgba(200,169,110,0.06)",
                            }}
                        >
                            <motion.div
                                initial={{ width: 0 }} whileHover={{ width: "100%" }}
                                transition={{ duration: 0.4 }}
                                style={{ position: "absolute", bottom: 0, left: 0, height: 1, background: C.gold }}
                            />
                            <div style={{ fontSize: 5, letterSpacing: "0.4em", color: C.gold, textTransform: "uppercase", marginBottom: 10, fontFamily: "'DM Sans', sans-serif" }}>
                                {svc.tag}
                            </div>
                            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 400, color: C.cream, lineHeight: 1.3 }}>
                                {svc.name}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </AnimatePresence>

            <Reveal delay={0.2}>
                <div style={{ textAlign: "center", marginTop: 60 }}>
                    <MagneticBtn href={WA_LINK} style={{
                        padding: "16px 44px", background: C.gold, color: C.ink,
                        fontSize: 11, letterSpacing: "0.25em", textTransform: "uppercase", fontWeight: 600,
                        textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 10,
                        fontFamily: "'DM Sans', sans-serif",
                    }}>
                        Book Your Service <ArrowUpRight size={14} />
                    </MagneticBtn>
                </div>
            </Reveal>
        </section>
    );
}

/* ============================================================
   GALLERY — Masonry editorial
   ============================================================ */
const GALLERY_IMGS = [
    { src: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80", alt: "Bridal glam", span: "2" },
    { src: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600&q=80", alt: "Makeup artistry" },
    { src: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=700&q=80", alt: "Glam look" },
    { src: "https://images.unsplash.com/photo-1583001931096-959e9a1a6223?w=600&q=80", alt: "Nail art" },
    { src: "https://images.unsplash.com/photo-1516914943479-89db7d9ae7f2?w=800&q=80", alt: "Beauty", span: "2" },
    { src: "https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?w=700&q=80", alt: "Lashes" },
];

function Gallery() {
    const [lightbox, setLightbox] = useState(null);

    return (
        <section id="gallery" style={{ background: C.ink, padding: "clamp(80px,12vh,140px) 0" }}>
            <div style={{ padding: "0 clamp(20px,5vw,72px)", marginBottom: 60 }}>
                <Reveal>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 20 }}>
                        <div>
                            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                                <div style={{ width: 32, height: 1, background: C.gold }} />
                                <span style={{ fontSize: 10, letterSpacing: "0.4em", color: C.gold, textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif" }}>Our Work</span>
                            </div>
                            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(40px,6vw,80px)", fontWeight: 300, color: C.cream, lineHeight: 1 }}>
                                The <em style={{ color: C.goldLight }}>Glam</em><br />Speaks.
                            </h2>
                        </div>
                        <MagneticBtn href={WA_LINK} style={{
                            display: "flex", alignItems: "center", gap: 8,
                            fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase",
                            color: C.gold, textDecoration: "none", fontFamily: "'DM Sans', sans-serif",
                            border: "1px solid rgba(200,169,110,0.3)", padding: "12px 20px",
                        }}>
                            Book Your Look <ArrowUpRight size={13} />
                        </MagneticBtn>
                    </div>
                </Reveal>
            </div>

            {/* Grid */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 4, padding: "0 4px",
            }}>
                {GALLERY_IMGS.map((img, i) => (
                    <motion.div key={i}
                        onClick={() => setLightbox(img.src)}
                        whileHover={{ scale: 1.015 }}
                        transition={{ duration: 0.5 }}
                        style={{
                            gridColumn: img.span ? `span ${img.span}` : "span 1",
                            aspectRatio: img.span === "2" ? "16/9" : "3/4",
                            overflow: "hidden", position: "relative", cursor: "zoom-in",
                        }}
                    >
                        <motion.img
                            src={img.src} alt={img.alt}
                            loading="lazy"
                            whileHover={{ scale: 1.08 }}
                            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
                            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                        />
                        <motion.div
                            initial={{ opacity: 0 }} whileHover={{ opacity: 1 }}
                            style={{
                                position: "absolute", inset: 0,
                                background: "linear-gradient(to top, rgba(200,169,110,0.3), transparent)",
                            }}
                        />
                    </motion.div>
                ))}
            </div>

            {/* Lightbox */}
            <AnimatePresence>
                {lightbox && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={() => setLightbox(null)}
                        style={{
                            position: "fixed", inset: 0, background: "rgba(10,8,6,0.96)",
                            zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center",
                            padding: 24, cursor: "zoom-out",
                        }}
                    >
                        <motion.img
                            src={lightbox}
                            initial={{ scale: 0.88, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.88, opacity: 0 }}
                            style={{ maxWidth: 900, width: "100%", maxHeight: "90vh", objectFit: "contain", border: "1px solid rgba(200,169,110,0.2)" }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}

/* ============================================================
   PRICING
   ============================================================ */
function Pricing() {
    return (
        <section id="pricing" style={{ background: C.inkMid, padding: "clamp(80px,12vh,140px) clamp(20px,5vw,72px)" }}>
            <Reveal>
                <div style={{ textAlign: "center", marginBottom: 72 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, marginBottom: 20 }}>
                        <div style={{ width: 32, height: 1, background: C.gold }} />
                        <span style={{ fontSize: 10, letterSpacing: "0.4em", color: C.gold, textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif" }}>Investment</span>
                        <div style={{ width: 32, height: 1, background: C.gold }} />
                    </div>
                    <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(40px,6vw,80px)", fontWeight: 300, color: C.cream }}>
                        Choose Your <em style={{ color: C.goldLight }}>Experience</em>
                    </h2>
                </div>
            </Reveal>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 2, background: "rgba(200,169,110,0.08)" }}>
                {PRICING.map((p, i) => (
                    <Reveal key={p.tier} delay={i * 0.12}>
                        <motion.div
                            whileHover={{ y: -6 }}
                            transition={{ duration: 0.4 }}
                            style={{
                                background: p.accent ? C.inkSoft : C.inkMid,
                                padding: "clamp(36px,5vw,56px) clamp(28px,4vw,44px)",
                                position: "relative", height: "100%",
                                borderTop: p.accent ? `2px solid ${C.gold}` : "2px solid transparent",
                            }}
                        >
                            {p.accent && (
                                <div style={{
                                    position: "absolute", top: -1, left: "50%", transform: "translateX(-50%) translateY(-50%)",
                                    background: C.gold, color: C.ink, fontSize: 9, letterSpacing: "0.3em",
                                    textTransform: "uppercase", padding: "5px 14px", fontWeight: 700,
                                    fontFamily: "'DM Sans', sans-serif",
                                }}>Most Popular</div>
                            )}
                            <div style={{ fontSize: 10, letterSpacing: "0.35em", color: p.accent ? C.gold : C.muted, textTransform: "uppercase", marginBottom: 12, fontFamily: "'DM Sans', sans-serif" }}>
                                {p.subtitle}
                            </div>
                            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 400, color: C.cream, marginBottom: 8 }}>
                                {p.tier}
                            </div>
                            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 44, fontWeight: 300, color: C.goldLight, marginBottom: 36 }}>
                                {p.price}
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 40 }}>
                                {p.services.map(s => (
                                    <div key={s} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                        <div style={{ width: 5, height: 5, borderRadius: "50%", background: C.gold, flexShrink: 0 }} />
                                        <span style={{ fontSize: 14, color: C.mutedLight, fontWeight: 300, fontFamily: "'DM Sans', sans-serif" }}>{s}</span>
                                    </div>
                                ))}
                            </div>
                            <MagneticBtn href={WA_LINK} style={{
                                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                                padding: "14px 24px", width: "100%",
                                background: p.accent ? C.gold : "transparent",
                                border: p.accent ? "none" : "1px solid rgba(200,169,110,0.3)",
                                color: p.accent ? C.ink : C.goldLight,
                                fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600,
                                textDecoration: "none", fontFamily: "'DM Sans', sans-serif",
                            }}>
                                Book This <ArrowUpRight size={13} />
                            </MagneticBtn>
                        </motion.div>
                    </Reveal>
                ))}
            </div>
        </section>
    );
}

/* ============================================================
   TESTIMONIALS
   ============================================================ */
function Testimonials() {
    const [active, setActive] = useState(0);

    return (
        <section id="reviews" style={{ background: C.ink, padding: "clamp(80px,12vh,140px) clamp(20px,5vw,72px)", overflow: "hidden" }}>
            <Reveal>
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
                    <div style={{ width: 32, height: 1, background: C.gold }} />
                    <span style={{ fontSize: 10, letterSpacing: "0.4em", color: C.gold, textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif" }}>Client Love</span>
                </div>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(40px,6vw,80px)", fontWeight: 300, color: C.cream, marginBottom: 64, lineHeight: 1.0 }}>
                    What They <em style={{ color: C.goldLight }}>Say.</em>
                </h2>
            </Reveal>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
                {TESTIMONIALS.map((t, i) => (
                    <Reveal key={t.name} delay={i * 0.1}>
                        <motion.div
                            whileHover={{ y: -6, borderColor: "rgba(200,169,110,0.4)" }}
                            transition={{ duration: 0.4 }}
                            style={{
                                background: "rgba(255,255,255,0.02)",
                                backdropFilter: "blur(20px)",
                                border: "1px solid rgba(200,169,110,0.1)",
                                padding: "clamp(28px,4vw,44px)",
                                position: "relative",
                            }}
                        >
                            {/* Quote mark */}
                            <div style={{ position: "absolute", top: 20, right: 28, fontFamily: "'Cormorant Garamond', serif", fontSize: 80, color: "rgba(200,169,110,0.08)", lineHeight: 1 }}>"</div>

                            {/* Stars */}
                            <div style={{ display: "flex", gap: 3, marginBottom: 20 }}>
                                {Array(t.rating).fill(0).map((_, j) => <Star key={j} size={13} fill={C.gold} color={C.gold} />)}
                            </div>

                            <p style={{ fontSize: 14, lineHeight: 1.85, color: C.mutedLight, fontStyle: "italic", marginBottom: 28, fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}>
                                "{t.text}"
                            </p>

                            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                                <div style={{
                                    width: 44, height: 44, borderRadius: "50%",
                                    background: `linear-gradient(135deg, ${C.gold}, ${C.goldLight})`,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontSize: 13, fontWeight: 700, color: C.ink, fontFamily: "'DM Sans', sans-serif",
                                }}>{t.avatar}</div>
                                <div>
                                    <div style={{ fontSize: 13, fontWeight: 500, color: C.cream, fontFamily: "'DM Sans', sans-serif" }}>{t.name}</div>
                                    <div style={{ fontSize: 11, color: C.gold, letterSpacing: "0.08em", fontFamily: "'DM Sans', sans-serif" }}>{t.tag} · {t.location}</div>
                                </div>
                            </div>
                        </motion.div>
                    </Reveal>
                ))}
            </div>
        </section>
    );
}

/* ============================================================
   BOOKING CTA — Full bleed cinematic
   ============================================================ */
function BookingCTA() {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
    const bgY = useTransform(scrollYProgress, [0, 1], [-60, 60]);

    return (
        <section ref={ref} style={{ position: "relative", overflow: "hidden", minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <motion.div style={{ position: "absolute", inset: 0, y: bgY }}>
                <img src="https://images.unsplash.com/photo-1607008829749-c0f284a49fc4?w=1400&q=80"
                    alt="" style={{ width: "100%", height: "120%", objectFit: "cover", marginTop: "-10%" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(10,8,6,0.88) 0%, rgba(10,8,6,0.75) 100%)" }} />
            </motion.div>

            <FloatingOrbs />

            <div style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "clamp(80px,12vh,120px) clamp(20px,5vw,72px)" }}>
                <Reveal>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "clamp(15px,2vw,20px)", color: C.gold, marginBottom: 24, letterSpacing: "0.1em" }}>
                        — Your transformation awaits —
                    </div>
                    <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "clamp(44px,8vw,100px)", lineHeight: 0.95, color: C.cream, marginBottom: 48 }}>
                        Ready to <em style={{ color: C.goldLight }}>Glow?</em>
                    </h2>
                    <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
                        <MagneticBtn href={WA_LINK} style={{
                            padding: "18px 48px", background: C.gold, color: C.ink,
                            fontSize: 12, letterSpacing: "0.3em", textTransform: "uppercase", fontWeight: 700,
                            textDecoration: "none", display: "flex", alignItems: "center", gap: 12,
                            fontFamily: "'DM Sans', sans-serif",
                        }}>
                            <svg viewBox="0 0 24 24" fill="white" width={18} height={18}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                            Chat on WhatsApp
                        </MagneticBtn>
                        <MagneticBtn href="tel:+2347087172867" style={{
                            padding: "17px 36px", border: "1px solid rgba(200,169,110,0.4)",
                            color: C.goldLight, fontSize: 12, letterSpacing: "0.3em", textTransform: "uppercase",
                            textDecoration: "none", display: "flex", alignItems: "center", gap: 10,
                            fontFamily: "'DM Sans', sans-serif",
                        }}>
                            <Phone size={15} /> Call Now
                        </MagneticBtn>
                    </div>
                </Reveal>
            </div>
        </section>
    );
}

/* ============================================================
   CONTACT SECTION
   ============================================================ */
function Contact() {
    return (
        <section id="contact" style={{ background: C.inkMid, padding: "clamp(80px,12vh,140px) clamp(20px,5vw,72px)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(40px,6vw,100px)", alignItems: "start" }}>
                <div>
                    <Reveal>
                        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
                            <div style={{ width: 32, height: 1, background: C.gold }} />
                            <span style={{ fontSize: 10, letterSpacing: "0.4em", color: C.gold, textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif" }}>Visit Us</span>
                        </div>
                        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(36px,5vw,64px)", fontWeight: 300, color: C.cream, marginBottom: 16, lineHeight: 1.05 }}>
                            Find Us<br /><em style={{ color: C.goldLight }}>in Lagos.</em>
                        </h2>
                        <p style={{ fontSize: 15, color: C.mutedLight, lineHeight: 1.8, fontWeight: 300, marginBottom: 48, fontFamily: "'DM Sans', sans-serif" }}>
                            Walk in or book ahead. We're open 7 days a week because beauty doesn't take days off.
                        </p>
                    </Reveal>

                    <Reveal delay={0.15}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 24, marginBottom: 48 }}>
                            {[
                                { icon: <MapPin size={16} color={C.gold} />, label: "Address", value: "13 Cele Way, Isolo Road, Egbe, Lagos 102213" },
                                { icon: <Phone size={16} color={C.gold} />, label: "Phone / WhatsApp", value: "+234 708 717 2867", href: "tel:+2347087172867" },
                                { icon: <Mail size={16} color={C.gold} />, label: "Email", value: "glambylolaa@gmail.com", href: "mailto:glambylolaa@gmail.com" },
                                { icon: <InstagramIcon size={16} color={C.gold} />, label: "Instagram", value: "@glam.by.lola", href: "https://instagram.com/glam.by.lola" },
                            ].map(item => (
                                <div key={item.label} style={{ display: "flex", gap: 16 }}>
                                    <div style={{
                                        width: 40, height: 40, border: "1px solid rgba(200,169,110,0.2)",
                                        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                                    }}>{item.icon}</div>
                                    <div>
                                        <div style={{ fontSize: 10, letterSpacing: "0.3em", color: C.gold, textTransform: "uppercase", marginBottom: 4, fontFamily: "'DM Sans', sans-serif" }}>{item.label}</div>
                                        {item.href
                                            ? <a href={item.href} target="_blank" style={{ fontSize: 14, color: C.cream, fontWeight: 300, fontFamily: "'DM Sans', sans-serif", textDecoration: "none", transition: "color 0.3s" }}
                                                onMouseEnter={e => e.target.style.color = C.goldLight}
                                                onMouseLeave={e => e.target.style.color = C.cream}
                                            >{item.value}</a>
                                            : <div style={{ fontSize: 14, color: C.cream, fontWeight: 300, fontFamily: "'DM Sans', sans-serif" }}>{item.value}</div>
                                        }
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Reveal>

                    <Reveal delay={0.25}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            <MagneticBtn href={WA_LINK} style={{
                                display: "flex", alignItems: "center", gap: 10, padding: "15px 28px",
                                background: "#25D366", color: "#fff", fontSize: 11, letterSpacing: "0.2em",
                                textTransform: "uppercase", fontWeight: 600, textDecoration: "none",
                                fontFamily: "'DM Sans', sans-serif",
                            }}>
                                <svg viewBox="0 0 24 24" fill="white" width={17} height={17}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                                Chat on WhatsApp
                            </MagneticBtn>
                            <MagneticBtn href="tel:+2347087172867" style={{
                                display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "14px 28px",
                                border: "1px solid rgba(200,169,110,0.3)", color: C.goldLight,
                                fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase",
                                textDecoration: "none", fontFamily: "'DM Sans', sans-serif",
                            }}>
                                <Phone size={14} /> Call +234 708 717 2867
                            </MagneticBtn>
                        </div>
                    </Reveal>
                </div>

                {/* Map */}
                <Reveal delay={0.2}>
                    <div style={{ border: "1px solid rgba(200,169,110,0.15)", overflow: "hidden", position: "relative", height: "100%", minHeight: 480 }}>
                        <div style={{
                            position: "absolute", top: 16, left: 16, zIndex: 1,
                            background: C.inkMid, border: "1px solid rgba(200,169,110,0.2)",
                            padding: "7px 14px", fontSize: 10, letterSpacing: "0.25em",
                            textTransform: "uppercase", color: C.gold, fontFamily: "'DM Sans', sans-serif",
                        }}>📍 Egbe, Lagos</div>
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.3!2d3.2783676!3d6.5344978!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8fb1a7b741dd%3A0xbb7f9ba101faf5b9!2sGlam%20by%20lola%20beauty%20studio!5e0!3m2!1sen!2sng!4v1700000000000!5m2!1sen!2sng"
                            style={{ width: "100%", height: "100%", minHeight: 480, border: "none", filter: "grayscale(0.4) contrast(1.05)" }}
                            loading="lazy"
                            title="Glam by Lola location"
                        />
                    </div>
                </Reveal>
            </div>
        </section>
    );
}

/* ============================================================
   FOOTER
   ============================================================ */
function Footer() {
    return (
        <footer style={{ background: "#070504", padding: "clamp(48px,8vh,80px) clamp(20px,5vw,72px) 32px", borderTop: "1px solid rgba(200,169,110,0.1)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "clamp(32px,5vw,80px)", marginBottom: 60 }}>
                <div>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 500, color: C.goldLight, letterSpacing: "0.06em", marginBottom: 4 }}>Glam by Lola</div>
                    <div style={{ fontSize: 9, letterSpacing: "0.4em", color: C.muted, textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif", marginBottom: 20 }}>Beauty Studio</div>
                    <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.75, fontWeight: 300, maxWidth: 280, fontFamily: "'DM Sans', sans-serif" }}>
                        Lagos' premier makeup artistry and nail studio. We specialise in bridal glam, airbrush makeup, Gele services, and flawless nail art.
                    </p>
                    <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
                        {[
                            { label: "IG", href: "https://instagram.com/glam.by.lola" },
                            { label: "WA", href: WA_LINK },
                            { label: "FB", href: "https://www.facebook.com/search/top?q=GLAM%20BY%20LOLA" },
                            { label: "✉", href: "mailto:glambylolaa@gmail.com" },
                        ].map(s => (
                            <a key={s.label} href={s.href} target="_blank"
                                style={{
                                    width: 36, height: 36, border: "1px solid rgba(200,169,110,0.2)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontSize: 11, color: C.muted, textDecoration: "none", fontFamily: "'DM Sans', sans-serif",
                                    fontWeight: 600, transition: "all 0.3s",
                                }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = C.gold; e.currentTarget.style.color = C.gold; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(200,169,110,0.2)"; e.currentTarget.style.color = C.muted; }}
                            >{s.label}</a>
                        ))}
                    </div>
                </div>

                <div>
                    <div style={{ fontSize: 10, letterSpacing: "0.35em", color: C.gold, textTransform: "uppercase", marginBottom: 20, fontFamily: "'DM Sans', sans-serif" }}>Services</div>
                    {["Bridal Make-up", "Airbrush Makeup", "Eyelash Extensions", "Gele Services", "Acrylic Nails", "Makeup Classes"].map(s => (
                        <div key={s} style={{ marginBottom: 12 }}>
                            <a href="#services" style={{ fontSize: 13, color: C.muted, textDecoration: "none", fontFamily: "'DM Sans', sans-serif", fontWeight: 300, transition: "color 0.3s" }}
                                onMouseEnter={e => e.target.style.color = C.goldLight}
                                onMouseLeave={e => e.target.style.color = C.muted}
                            >{s}</a>
                        </div>
                    ))}
                </div>

                <div>
                    <div style={{ fontSize: 10, letterSpacing: "0.35em", color: C.gold, textTransform: "uppercase", marginBottom: 20, fontFamily: "'DM Sans', sans-serif" }}>Studio</div>
                    {[["About", "#"], ["Gallery", "#gallery"], ["Pricing", "#pricing"], ["Reviews", "#reviews"], ["Book Now", WA_LINK]].map(([label, href]) => (
                        <div key={label} style={{ marginBottom: 12 }}>
                            <a href={href} target={href.startsWith("http") ? "_blank" : undefined}
                                style={{ fontSize: 13, color: C.muted, textDecoration: "none", fontFamily: "'DM Sans', sans-serif", fontWeight: 300, transition: "color 0.3s" }}
                                onMouseEnter={e => e.target.style.color = C.goldLight}
                                onMouseLeave={e => e.target.style.color = C.muted}
                            >{label}</a>
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 28, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
                <div style={{ fontSize: 12, color: C.muted, opacity: 0.5, fontFamily: "'DM Sans', sans-serif" }}>
                    © 2025 Glam by Lola Beauty Studio · 13 Cele Way, Egbe, Lagos
                </div>
                <div style={{ fontSize: 12, color: C.muted, opacity: 0.4, fontFamily: "'DM Sans', sans-serif" }}>
                    glambylolaa@gmail.com
                </div>
            </div>
        </footer>
    );
}

/* ============================================================
   FLOATING WHATSAPP
   ============================================================ */
function FloatingWhatsApp() {
    return (
        <motion.a
            href={WA_LINK} target="_blank"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 2, type: "spring", stiffness: 200, damping: 15 }}
            whileHover={{ scale: 1.12 }}
            aria-label="Chat on WhatsApp"
            style={{
                position: "fixed", bottom: 28, right: 24, zIndex: 400,
                width: 56, height: 56, borderRadius: "50%",
                background: "#25D366", display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 8px 24px rgba(37,211,102,0.35)", textDecoration: "none",
            }}
        >
            <motion.div
                animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: 3 }}
                style={{
                    position: "absolute", inset: -4, borderRadius: "50%",
                    border: "2px solid rgba(37,211,102,0.5)",
                }}
            />
            <svg viewBox="0 0 24 24" fill="white" width={26} height={26}>
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
        </motion.a>
    );
}

/* ============================================================
   ROOT APP
   ============================================================ */
export default function App() {
    return (
        <>
            {/* Google Fonts */}
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=DM+Sans:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: #0a0806; color: #faf6ef; overflow-x: hidden; cursor: none; }

        @media (max-width: 768px) {
          body { cursor: auto; }
          .hide-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
          /* Contact grid single col */
          #contact > div > div { grid-template-columns: 1fr !important; }
          /* Gallery 2 col on mobile */
          section[id="gallery"] > div:last-of-type { grid-template-columns: repeat(2,1fr) !important; }
          section[id="gallery"] > div:last-of-type > div { grid-column: span 1 !important; aspect-ratio: 1/1 !important; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
        }

        ::selection { background: rgba(200,169,110,0.3); color: #faf6ef; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0a0806; }
        ::-webkit-scrollbar-thumb { background: #c8a96e; border-radius: 2px; }
      `}</style>

            {/* Custom cursor — desktop only */}
            <div style={{ display: "none" }} className="hide-mobile">
                <CustomCursor />
            </div>

            <Nav />
            <Hero />
            <Marquee />
            <Services />
            <Gallery />
            <Testimonials />
            <Pricing />
            <BookingCTA />
            <Contact />
            <Footer />
            <FloatingWhatsApp />
        </>
    );
}
