"use client";

import Link from "next/link";
import {motion} from "framer-motion";
import {ArrowRight, Calendar, Briefcase, Users, Code} from "lucide-react";
import {Button} from "@/components/ui/button";

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

export function Hero({settings}: HeroProps) {
    const stats = [
        {
            label: "Years Experience",
            value: settings?.yearsExp || 4,
            icon: Briefcase
        },
        {
            label: "Projects Completed",
            value: `${settings?.projectsCount || 50}+`,
            icon: Code
        },
        {
            label: "Happy Clients",
            value: `${settings?.clientsCount || 30}+`,
            icon: Users
        },
    ];

    return (
        <section className="relative min-h-[90vh] flex items-center overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float"/>
                <div
                    className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-float"
                    style={{animationDelay: "1s"}}/>
                <div className="absolute inset-0 noise opacity-50"/>
            </div>

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-32">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Content */}
                    <motion.div
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.5}}
                    >
                        <motion.div
                            initial={{opacity: 0, x: -20}}
                            animate={{opacity: 1, x: 0}}
                            transition={{delay: 0.2}}
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
                            Hi, I&apos;m{" "}
                            <span className="gradient-text">{settings?.name || "Humaam"}</span>
                            <br/>
                            <span className="text-muted-foreground">
                {settings?.tagline || "Full-Stack Developer"}
              </span>
                        </h1>

                        <p className="text-lg text-muted-foreground mb-8 max-w-xl">
                            {settings?.bio ||
                                "I build powerful digital solutions that drive business growth. From enterprise systems to mobile apps, I deliver clean, scalable code that solves real problems."}
                        </p>

                        <div className="flex flex-wrap gap-4 mb-12">
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
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-6">
                            {stats.map((stat, index) => (
                                <motion.div
                                    key={stat.label}
                                    initial={{opacity: 0, y: 20}}
                                    animate={{opacity: 1, y: 0}}
                                    transition={{delay: 0.4 + index * 0.1}}
                                    className="text-center sm:text-left"
                                >
                                    <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                                        <stat.icon className="h-4 w-4 text-primary"/>
                                        <span className="text-2xl sm:text-3xl font-bold">{stat.value}</span>
                                    </div>
                                    <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Visual */}
                    <motion.div
                        initial={{opacity: 0, scale: 0.9}}
                        animate={{opacity: 1, scale: 1}}
                        transition={{delay: 0.3, duration: 0.5}}
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
                                <div className="p-4 font-mono text-sm">
                  <pre className="text-muted-foreground">
                    <code>{`const developer = {
  name: settings?.name || "Humaam",
  role: "Full-Stack Developer",
  experience: "4+ years",

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

export default developer;`}</code>
                  </pre>
                                </div>
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
        </section>
    );
}
