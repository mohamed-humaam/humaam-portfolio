"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { animate, motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowRight, Calendar, Briefcase, Users, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EASE_OUT_EXPO } from "@/components/ui/reveal";

interface HeroProps {
    settings: {
        name: string;
        tagline: string;
        bio: string | null;
        yearsExp: number;
        projectsCount: number;
        clientsCount: number;
        calendly: string | null;
    } | null;
}

/**
 * The intro runs as one short sequence:
 *
 *   0.1s  the dot grid fades up and hairline traces start drawing across the page
 *   0.25s the headline rises line by line out of its own baseline
 *   0.7s  copy, buttons and stats settle; the stats count up
 *   0.9s  the code window types itself in, line by line
 *
 * Everything collapses to its final state when the visitor prefers reduced motion.
 */

/** Hairline routes in a 1440×900 box; strokes stay 1px at any size. */
const TRACES = [
    // Above the copy, dipping toward the code window.
    "M -40 60 C 240 40, 420 120, 700 90 S 1060 20, 1500 70",
    // Below the stats.
    "M -40 885 C 280 860, 520 815, 780 845 S 1220 900, 1500 815",
    // Down the right edge, mostly behind the code window.
    "M 1060 -40 C 1080 140, 1260 220, 1300 400 S 1240 760, 1400 940",
];

function Traces({ reduce }: { reduce: boolean }) {
    return (
        <svg
            // The box stretches to the section, so on tall phone screens the routes
            // turn steep and cross the copy; they only draw from tablet width up.
            className="absolute inset-0 hidden h-full w-full md:block"
            viewBox="0 0 1440 900"
            preserveAspectRatio="none"
            aria-hidden="true"
        >
            {TRACES.map((d, i) => (
                <motion.path
                    key={d}
                    d={d}
                    fill="none"
                    stroke="hsl(var(--primary))"
                    strokeOpacity={0.35}
                    strokeWidth={1}
                    vectorEffect="non-scaling-stroke"
                    initial={reduce ? false : {pathLength: 0}}
                    animate={{pathLength: 1}}
                    transition={{delay: 0.1 + i * 0.25, duration: 2.2, ease: EASE_OUT_EXPO}}
                />
            ))}
        </svg>
    );
}

/** A number that counts up from zero the first time it is on screen. */
function CountUp({ value, suffix = "", reduce }: { value: number; suffix?: string; reduce: boolean }) {
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, {once: true});

    useEffect(() => {
        const el = ref.current;
        if (!el || !inView) return;
        if (reduce) {
            el.textContent = `${value}${suffix}`;
            return;
        }
        const controls = animate(0, value, {
            delay: 0.7,
            duration: 1.6,
            ease: EASE_OUT_EXPO,
            onUpdate: (v) => {
                el.textContent = `${Math.round(v)}${suffix}`;
            },
        });
        return () => controls.stop();
    }, [inView, value, suffix, reduce]);

    return <span ref={ref}>{reduce ? `${value}${suffix}` : `0${suffix}`}</span>;
}

/** One line of the headline, rising out from behind its own baseline. */
function RiseLine({ children, delay, reduce, className }: {
    children: React.ReactNode;
    delay: number;
    reduce: boolean;
    className?: string;
}) {
    return (
        <span className="block overflow-hidden pb-[0.08em]">
            <motion.span
                className={`block ${className ?? ""}`}
                initial={reduce ? false : {y: "110%"}}
                animate={{y: 0}}
                transition={{delay, duration: 1.1, ease: EASE_OUT_EXPO}}
            >
                {children}
            </motion.span>
        </span>
    );
}

export function Hero({settings}: HeroProps) {
    const reduce = !!useReducedMotion();
    const name = settings?.name || "Humaam";

    const stats = [
        {label: "Years Experience", value: settings?.yearsExp || 4, suffix: "", icon: Briefcase},
        {label: "Projects Completed", value: settings?.projectsCount || 50, suffix: "+", icon: Code},
        {label: "Happy Clients", value: settings?.clientsCount || 30, suffix: "+", icon: Users},
    ];

    const settle = (delay: number) => ({
        initial: reduce ? false : {opacity: 0, y: 16},
        animate: {opacity: 1, y: 0},
        transition: {delay, duration: 0.9, ease: EASE_OUT_EXPO},
    });

    const codeLines = `const developer = {
  name: "${name}",
  role: "Full-Stack Developer",
  experience: "${settings?.yearsExp || 4}+ years",

  stack: [
    "React", "Next.js",
    "Laravel", "Node.js",
    "React Native", "Python"
  ],

  builds: [
    "ERPs & Business Systems",
    "Scalable Web Apps",
    "Mobile Applications",
    "APIs & Integrations"
  ],

  focus: "Clean architecture, performance, maintainability",
  mindset: "Problem-first, solution-driven",
  coffee: "☕ Always brewing"
};

export default developer;`.split("\n");

    return (
        <section className="relative min-h-[90vh] flex items-center overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 -z-10">
                <motion.div
                    className="dot-grid absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_40%_45%,#000_30%,transparent_75%)]"
                    initial={reduce ? false : {opacity: 0}}
                    animate={{opacity: 1}}
                    transition={{delay: 0.1, duration: 1.2, ease: "easeOut"}}
                />
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float"/>
                <div
                    className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-float"
                    style={{animationDelay: "1s"}}/>
                <Traces reduce={reduce}/>
                <div className="absolute inset-0 noise opacity-50"/>
            </div>

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-32">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Content */}
                    <div>
                        <motion.div
                            {...settle(0.15)}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6"
                        >
              <span className="relative flex h-2 w-2">
                <span
                    className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
                            Available for new projects
                        </motion.div>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold tracking-tight mb-6">
                            <RiseLine delay={0.25} reduce={reduce}>
                                Hi, I&apos;m <span className="gradient-text">{name}</span>
                            </RiseLine>
                            <RiseLine delay={0.37} reduce={reduce} className="text-muted-foreground">
                                {settings?.tagline || "Full-Stack Developer"}
                            </RiseLine>
                        </h1>

                        <motion.p {...settle(0.7)} className="text-lg text-muted-foreground mb-8 max-w-xl">
                            {settings?.bio ||
                                "I build powerful digital solutions that drive business growth. From enterprise systems to mobile apps, I deliver clean, scalable code that solves real problems."}
                        </motion.p>

                        <motion.div {...settle(0.8)} className="flex flex-wrap gap-4 mb-12">
                            <Button asChild size="lg" className="group">
                                <Link href="/projects">
                                    View My Work
                                    <ArrowRight
                                        className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"/>
                                </Link>
                            </Button>
                            {settings?.calendly && (
                                <Button asChild variant="outline" size="lg">
                                    <a href={settings.calendly} target="_blank" rel="noopener noreferrer">
                                        <Calendar className="mr-2 h-4 w-4"/>
                                        Book a Call
                                    </a>
                                </Button>
                            )}
                        </motion.div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-6">
                            {stats.map((stat, index) => (
                                <motion.div
                                    key={stat.label}
                                    {...settle(0.9 + index * 0.08)}
                                    className="text-center sm:text-left"
                                >
                                    <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                                        <stat.icon className="h-4 w-4 text-primary"/>
                                        <span className="text-2xl sm:text-3xl font-bold tabular-nums">
                                            <CountUp value={stat.value} suffix={stat.suffix} reduce={reduce}/>
                                        </span>
                                    </div>
                                    <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Visual */}
                    <motion.div
                        initial={reduce ? false : {opacity: 0, y: 24, scale: 0.97}}
                        animate={{opacity: 1, y: 0, scale: 1}}
                        transition={{delay: 0.45, duration: 1.2, ease: EASE_OUT_EXPO}}
                        className="relative hidden lg:block"
                    >
                        <div className="relative aspect-square">
                            {/* Code Window */}
                            <div
                                className="absolute inset-0 rounded-2xl bg-card border border-border shadow-2xl overflow-hidden">
                                <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border-b border-border">
                                    <div className="flex gap-2">
                                        <div className="w-3 h-3 rounded-full bg-red-500"/>
                                        <div className="w-3 h-3 rounded-full bg-yellow-500"/>
                                        <div className="w-3 h-3 rounded-full bg-green-500"/>
                                    </div>
                                    <span className="text-xs text-muted-foreground ml-2">portfolio.tsx</span>
                                </div>
                                <pre className="p-4 font-mono text-sm text-muted-foreground">
                                    <code>
                                        {codeLines.map((line, i) => (
                                            <motion.span
                                                key={i}
                                                className="block min-h-[1.25rem] whitespace-pre"
                                                initial={reduce ? false : {opacity: 0, x: -6}}
                                                animate={{opacity: 1, x: 0}}
                                                transition={{delay: 0.9 + i * 0.045, duration: 0.4, ease: "easeOut"}}
                                            >
                                                {line}
                                                {i === codeLines.length - 1 && (
                                                    <span
                                                        className="ml-0.5 inline-block h-4 w-2 translate-y-0.5 bg-primary animate-caret"/>
                                                )}
                                            </motion.span>
                                        ))}
                                    </code>
                                </pre>
                            </div>

                            {/* Floating Elements */}
                            <motion.div
                                animate={{y: [0, -10, 0]}}
                                transition={{repeat: Infinity, duration: 3}}
                                className="absolute -top-4 -right-4 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium shadow-lg"
                            >
                                React Expert 🚀
                            </motion.div>
                            <motion.div
                                animate={{y: [0, 10, 0]}}
                                transition={{repeat: Infinity, duration: 3, delay: 1}}
                                className="absolute -bottom-4 -left-4 px-4 py-2 rounded-lg bg-card border border-border text-sm font-medium shadow-lg"
                            >
                                Laravel Pro 💻
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Scroll cue */}
            <motion.div
                initial={reduce ? false : {opacity: 0}}
                animate={{opacity: 1}}
                transition={{delay: 2.2, duration: 0.8}}
                className="pointer-events-none absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex"
                aria-hidden="true"
            >
                <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-muted-foreground">Scroll</span>
                <span className="relative h-10 w-px overflow-hidden bg-border">
                    <span className="absolute inset-x-0 top-0 h-1/2 bg-primary animate-scroll-cue motion-reduce:animate-none"/>
                </span>
            </motion.div>
        </section>
    );
}
