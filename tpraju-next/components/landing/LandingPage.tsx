"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type SubmitEventHandler,
} from "react";
import { CertificateModal } from "./CertificateModal";
import { ShareFloating } from "./ShareFloating";

import { urlFor } from "@/lib/sanity.image";
import { sendContactEmail } from "@/app/actions/contact";

import { TPRCLoader } from "./LoadingScreen";

const HERO_BG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCWASYnz6kODAfg1YQ7cNgUaCc6Qf64cMUfUHa-QNDn1FrMKLUdQdl3YTQHI8hCfUECTGZghv4-X3PzmTWa1V3QJOSi4ifkXFl9DBLxqsCjjWkGdPK2iQIFEFWmJ_Be1ygq8HgEgr-tk8-CPTuhtc4DjiKfL4OnIogfAvI4svCNTlMf5nNGIFUPaIUwtjhC0vjyHufhH0MTJwT3Z9r8iuUVLhjnrFHeJNJ3rsijo4Z820RAIbo4bSFdhdM--vU7TxWWDxHSErUfIfM7";

const ABOUT_IMG =
  "https://img.freepik.com/premium-photo/tall-building-with-crane-top-it_662214-417885.jpg";

const FEAT1 =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAPXfhKDsJ2_4ZDt2FwW4KBY1C2IQQkaGo3yJ5GDYpSn86anHbZC82iTvPQ-eJG2UU-ieKjIV3kV3an1bIlL1ojQ6XhcdPqAcsVJE5oscfhQP9Z__gpOx1XTv1z9uP-LofCNlYdBXhRYYH52PvbvhUQmFeveq-1U539QxWYS5smOy_dZluAQIKmOMgW8lYgmgwE6yMxBeizhvvu7uK_Rrkq-PHbBDvjPV4jJO61Raluu3O82crKIlKhaYwlmv_9gETEdmDWd4uKkmlZ";

const FEAT2 =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBB30CYzqJ8Irmq_dU-HpoJg03XeZC4Drlo8gL-THfDzCR4YPJxNx-NUs3dQuCuuG3fietzebj0ZDsReozy7aEED7mrXCgw-rAmn1tZrmdGbBqMhqCPyhd6C1gDVksjZryOcwvvVrMqJXQr2pMgL_6l-wKTPgDuA4-pacDVJzl4AzELnI0nyP3jBLAaEXwHIf5EvGu6ZUqlmAdC38Sk24NZOgfRXo74FVgigcx9V-nhsVKbH4S7EkterR9oWPMy0MsoQpxfIEORYmhD";

const FEAT3 =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBAkmJ-23UOvacuJ_1BKhI6TyJzrmVDqnCxVWAFFPlgWHMRlkw-xa1Cuh1WZ_5brf_N3kg85Gl7yCrPP4JXy74CDXRWb4gM5a15xg5J6eVYJDvATGFAn35RZXInhYc1SF3SPA9Am0QQOtQRb7A_Ad2gzFTueLvTTQ8qjLSgUmg1xTfblnLx1xPgrYWEHlXU8DumAYGgFGwXZ8ki2mYt5S18k7-m19Rmv4l88uoyXrqzY66XWLxOnTuLv7jQsX0lxpaD345rJJM10tTW";

const CERT1 =
  "https://img.freepik.com/free-vector/certificate-template-design_53876-59034.jpg";
const CERT2 =
  "https://img.freepik.com/free-vector/certificate-template-design_53876-59037.jpg";
const CERT3 =
  "https://img.freepik.com/free-vector/certificate-template-design_53876-59041.jpg";

export function LandingPage({ clients, projects }: { clients: any[], projects: any[] }) {
  const [certSrc, setCertSrc] = useState<string | null>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const pausedSlidersRef = useRef(new Set<string>());
  const sliderStateRef = useRef<Record<string, number>>({ cat1: 0, cat2: 0 });

  const openCertificate = useCallback((src: string) => setCertSrc(src), []);
  const closeCertificate = useCallback(() => setCertSrc(null), []);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const REVEAL_MS = reduceMotion ? 0 : 1050;
    const easeReveal = reduceMotion
      ? "linear"
      : "cubic-bezier(0.16, 1, 0.3, 1)";
    const easeBtn = reduceMotion
      ? "linear"
      : "cubic-bezier(0.32, 0.72, 0, 1)";

    const animatedElements = document.querySelectorAll(
      "section, .group, .glass, .bg-white, div.bg-background-light, div.bg-background-dark"
    );

    const reveal = (h: HTMLElement) => {
      h.style.opacity = "1";
      h.style.transform = "translateY(0)";
      window.setTimeout(() => {
        h.style.removeProperty("will-change");
      }, REVEAL_MS + 100);
    };

    animatedElements.forEach((el) => {
      const h = el as HTMLElement;
      if (reduceMotion) {
        h.style.opacity = "1";
        h.style.transform = "none";
        return;
      }
      h.style.opacity = "0";
      h.style.transform = "translateY(28px)";
      h.style.transition = `opacity ${REVEAL_MS}ms ${easeReveal}, transform ${REVEAL_MS}ms ${easeReveal}`;
      h.style.willChange = "opacity, transform";
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            reveal(entry.target as HTMLElement);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -6% 0px" }
    );

    animatedElements.forEach((el) => {
      if (!reduceMotion) observer.observe(el);
    });

    const onLoad = () => {
      animatedElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.92) {
          reveal(el as HTMLElement);
        }
      });
    };
    window.addEventListener("load", onLoad);

    const buttons = document.querySelectorAll("button");
    const btnHandlers: { el: HTMLElement; enter: () => void; leave: () => void }[] =
      [];
    if (!reduceMotion) {
      buttons.forEach((btn) => {
        const b = btn as HTMLElement;
        b.style.transition = `transform 0.48s ${easeBtn}`;
        const enter = () => {
          b.style.transform = "scale(1.03)";
        };
        const leave = () => {
          b.style.transform = "scale(1)";
        };
        b.addEventListener("mouseenter", enter);
        b.addEventListener("mouseleave", leave);
        btnHandlers.push({ el: b, enter, leave });
      });
    }

    return () => {
      window.removeEventListener("load", onLoad);
      observer.disconnect();
      btnHandlers.forEach(({ el, enter, leave }) => {
        el.removeEventListener("mouseenter", enter);
        el.removeEventListener("mouseleave", leave);
      });
    };
  }, []);

  useEffect(() => {
    const fWrapper = document.getElementById("featured-wrapper");
    const fTrack = document.getElementById("featured-track");
    if (!fWrapper || !fTrack) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let targetX = 0;
    let currentX = 0;
    let rafId: number | null = null;

    const applyTransform = (x: number) => {
      fTrack.style.transform = `translate3d(-${x}px, 0, 0)`;
    };

    const tick = () => {
      const diff = targetX - currentX;
      if (reduceMotion || Math.abs(diff) < 0.25) {
        currentX = targetX;
        applyTransform(currentX);
        rafId = null;
        return;
      }
      currentX += diff * 0.1;
      applyTransform(currentX);
      rafId = requestAnimationFrame(tick);
    };

    const scheduleTick = () => {
      if (rafId === null) rafId = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      const rect = fWrapper.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      let progress = -rect.top / (rect.height - viewportHeight);
      progress = Math.max(0, Math.min(1, progress));
      const maxScroll = Math.max(0, fTrack.scrollWidth - window.innerWidth + 80);
      targetX = progress * maxScroll;
      if (reduceMotion) {
        currentX = targetX;
        applyTransform(currentX);
      } else {
        scheduleTick();
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    const sliderIds = ["cat1", "cat2"];
    const scrollDelay = 3000;

    const autoScrollAll = () => {
      sliderIds.forEach((id) => {
        if (pausedSlidersRef.current.has(id)) return;
        const slider = document.getElementById(id);
        if (!slider) return;
        const items = slider.querySelectorAll(".product-item");
        if (!items.length) return;
        const totalItems = items.length;
        sliderStateRef.current[id] = (sliderStateRef.current[id] ?? 0) + 1;
        if (sliderStateRef.current[id] >= totalItems) {
          sliderStateRef.current[id] = 0;
        }
        const itemWidth = (items[0] as HTMLElement).offsetWidth;
        slider.scrollTo({
          left: sliderStateRef.current[id] * itemWidth,
          behavior: "smooth",
        });
      });
    };

    const syncInterval = setInterval(autoScrollAll, scrollDelay);
    return () => clearInterval(syncInterval);
  }, []);

  const onMessageInput = () => {
    const ta = messageRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${ta.scrollHeight}px`;
  };

  const onContactSubmit: SubmitEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    alert("Thank you — we will get back to you shortly.");
  };

  const pauseScroll = (id: string) => pausedSlidersRef.current.add(id);
  const resumeScroll = (id: string) => pausedSlidersRef.current.delete(id);

  return (
    <>
      <TPRCLoader />
      <ShareFloating />

      <header className="sticky top-0 z-50 w-full border-b border-gray-200/50 dark:border-gray-800/50 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md transition-[background-color,backdrop-filter,border-color] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-20 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-8 bg-primary rounded flex items-center justify-center text-charcoal">
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <h1 className="text-xl font-extrabold tracking-tight text-charcoal dark:text-white">
              TP RAJU{" "}
              <span className="font-normal text-gray-500">Engineering</span>
            </h1>
          </div>
          <nav className="hidden lg:flex items-center gap-10">
            <a
              className="text-sm font-semibold hover:text-primary transition-colors"
              href="#"
            >
              Home
            </a>
            <a
              className="text-sm font-semibold hover:text-primary transition-colors"
              href="#"
            >
              About
            </a>
            <a
              className="text-sm font-semibold hover:text-primary transition-colors"
              href="#"
            >
              Major Clients
            </a>
            <a
              className="text-sm font-semibold hover:text-primary transition-colors"
              href="#"
            >
              Projects
            </a>
            <a
              className="text-sm font-semibold hover:text-primary transition-colors"
              href="#"
            >
              Products
            </a>
            <a
              className="text-sm font-semibold hover:text-primary transition-colors"
              href="#"
            >
              Gallery
            </a>
          </nav>
          <button
            type="button"
            className="bg-primary hover:bg-yellow-500 text-charcoal px-5 py-2 rounded-full font-bold text-sm whitespace-nowrap shadow-sm transition-all"
          >
            Contact Us
          </button>
        </div>
      </header>

      <main className="max-w-[1440px] mx-auto">
        <section className="px-6 md:px-20 pt-10 lg:pt-12 pb-12 lg:pb-12 grid lg:grid-cols-2 gap-16 items-center">
          <div className="flex flex-col gap-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full text-primary text-xs font-bold tracking-wider uppercase">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              ISO 9001:2015 Certified
            </div>
            <h1 className="text-5xl md:text-7xl font-black leading-[1.1] tracking-tighter text-charcoal dark:text-white">
              Leaders in Scaffolding &amp; Industrial{" "}
              <span className="text-primary italic">Engineering</span> Services
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-xl leading-relaxed">
              Premium enterprise-level scaffolding solutions for refineries,
              chemical plants, and power sectors. Built on precision, safety,
              and 15+ years of excellence.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                type="button"
                className="bg-primary hover:bg-yellow-500 text-charcoal px-8 py-4 rounded-xl font-bold text-base shadow-lg shadow-primary/20 transition-all flex items-center gap-2"
              >
                Contact Us{" "}
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
              <button
                type="button"
                className="border-2 border-charcoal/10 dark:border-white/10 hover:bg-charcoal hover:text-white dark:hover:bg-white dark:hover:text-charcoal px-8 py-4 rounded-xl font-bold text-base transition-all"
              >
                View Products
              </button>
            </div>
          </div>
          <div className="relative">
            <div
              className="w-full aspect-[4/5] md:aspect-square bg-center bg-cover rounded-xl shadow-2xl"
              style={{ backgroundImage: `url("${HERO_BG}")` }}
            />
            <div className="absolute inset-0 hidden xl:block pointer-events-none">
              <div className="absolute top-[20%] -left-8">
                <div className="glass p-6 h-[100px] rounded-2xl shadow-2xl border border-white/20 flex items-center gap-4 min-w-[220px] backdrop-blur-xl">
                  <div className="size-12 rounded-lg bg-primary text-charcoal flex items-center justify-center shadow-md">
                    <span className="material-symbols-outlined">engineering</span>
                  </div>
                  <div>
                    <p className="text-2xl font-black text-charcoal dark:text-white">
                      15+
                    </p>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                      Years Exp
                    </p>
                  </div>
                </div>
              </div>
              <div className="absolute top-[50%] -translate-y-1/2 -right-8">
                <div className="glass p-6 h-[100px] rounded-2xl shadow-2xl border border-white/20 flex items-center gap-4 min-w-[220px] backdrop-blur-xl">
                  <div className="size-12 rounded-lg bg-primary text-charcoal flex items-center justify-center shadow-md">
                    <span className="material-symbols-outlined">checklist</span>
                  </div>
                  <div>
                    <p className="text-2xl font-black text-charcoal dark:text-white">
                      500+
                    </p>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                      Projects
                    </p>
                  </div>
                </div>
              </div>
              <div className="absolute top-[56%] -left-8">
                <div className="glass p-6 h-[100px] rounded-2xl shadow-2xl border border-white/20 flex items-center gap-4 min-w-[220px] backdrop-blur-xl">
                  <div className="size-12 rounded-lg bg-primary text-charcoal flex items-center justify-center shadow-md">
                    <span className="material-symbols-outlined">groups</span>
                  </div>
                  <div>
                    <p className="text-2xl font-black text-charcoal dark:text-white">
                      200+
                    </p>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                      Clients
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 md:px-20 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div
              className="w-full aspect-[4/5] bg-center bg-cover rounded-2xl shadow-2xl"
              style={{ backgroundImage: `url("${ABOUT_IMG}")` }}
            />
            <div className="flex flex-col gap-6">
              <span className="text-primary font-bold uppercase tracking-widest text-xs">
                About TP Raju Engineering Contractor
              </span>
              <h2 className="text-4xl md:text-5xl font-black leading-tight">
                Building Industrial Safety &amp; Engineering Excellence
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                TP Raju Engineering Contractor is a trusted name in scaffolding
                rental and industrial engineering services, delivering safe and
                reliable solutions for refineries, chemical plants, power plants
                and heavy industries across India.
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Since our establishment, we have focused on quality
                workmanship, modern equipment, and strict safety compliance. Our
                experienced workforce and engineering team ensure every project
                is executed efficiently and on schedule.
              </p>
              <div className="grid grid-cols-2 gap-6 mt-6">
                <div className="bg-background-light dark:bg-background-dark p-6 rounded-xl">
                  <h4 className="text-3xl font-black text-primary">15+</h4>
                  <p className="text-sm uppercase text-gray-500 font-bold">
                    Years of Experience
                  </p>
                </div>
                <div className="bg-background-light dark:bg-background-dark p-6 rounded-xl">
                  <h4 className="text-3xl font-black text-primary">500+</h4>
                  <p className="text-sm uppercase text-gray-500 font-bold">
                    Projects Completed
                  </p>
                </div>
                <div className="bg-background-light dark:bg-background-dark p-6 rounded-xl">
                  <h4 className="text-3xl font-black text-primary">200+</h4>
                  <p className="text-sm uppercase text-gray-500 font-bold">
                    Satisfied Clients
                  </p>
                </div>
                <div className="bg-background-light dark:bg-background-dark p-6 rounded-xl">
                  <h4 className="text-3xl font-black text-primary">ISO</h4>
                  <p className="text-sm uppercase text-gray-500 font-bold">
                    9001:2015 Certified
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="xl:hidden px-6 md:px-20 pb-20 lg:pb-32 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm text-center">
            <p className="text-4xl font-black text-primary mb-2">15+</p>
            <p className="text-sm font-bold text-gray-500 uppercase">
              Years of Experience
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm text-center">
            <p className="text-4xl font-black text-primary mb-2">500+</p>
            <p className="text-sm font-bold text-gray-500 uppercase">
              Projects Completed
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm text-center">
            <p className="text-4xl font-black text-primary mb-2">200+</p>
            <p className="text-sm font-bold text-gray-500 uppercase">
              Satisfied Clients
            </p>
          </div>
        </section>

        <section className="px-6 md:px-20 py-20 bg-white dark:bg-zinc-900/50 rounded-2xl">
          <div className="text-center mb-16">
            <span className="text-primary font-bold uppercase tracking-widest text-xs">
              Trusted By Industry Leaders
            </span>
            <h2 className="text-4xl font-black mt-2 mb-4">Our Major Clients</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
              We are proud to collaborate with some of India&apos;s most
              respected infrastructure, energy, and industrial organizations.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
            {clients?.map((client: any) => (
              <div
                key={client._id}
                className="group bg-background-light dark:bg-background-dark p-8 rounded-xl flex flex-col items-center justify-center gap-4 shadow-sm hover:shadow-xl transition-all">
                <img
                  src={urlFor(client.logo).url()}
                  alt={client.name}
                  className="h-12 object-contain grayscale group-hover:grayscale-0 transition-all"
                />
                <p className="font-bold text-sm">{client.name}</p>
              </div>
            ))}
          </div>
        </section>

        <div id="featured-wrapper" className="relative h-[200vh]">
          <section className="sticky top-[70px] py-20 flex flex-col justify-center overflow-hidden bg-white dark:bg-zinc-900/50">
            <div className="px-6 md:px-20 mb-12 shrink-0">
              <h2 className="text-4xl font-black tracking-tight mb-2">
                Featured Projects
              </h2>
              <p className="text-gray-500 uppercase tracking-widest text-xs font-bold">
                Industry standard excellence
              </p>
            </div>
            <div
              id="featured-track"
              className="flex gap-8 px-6 md:px-20 w-max"
            >
              {projects?.map((project: any) => (

                <div className="min-w-[400px] md:min-w-[600px] snap-center">
                  <div className="group relative overflow-hidden rounded-2xl aspect-[16/9]">
                    <div className="absolute inset-0 bg-charcoal/40 group-hover:bg-charcoal/20 transition-[background-color,opacity] duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] z-10" />
                    <div
                      className="w-full h-full bg-center bg-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-[1.06]"
                      style={{ backgroundImage: `url("${urlFor(project.image).url()}")` }}
                    />
                    <div className="absolute bottom-0 left-0 p-10 z-20">
                      <span className="bg-primary text-charcoal px-4 py-1 rounded-full text-xs font-bold mb-4 inline-block">
                        {project.category}
                      </span>
                      <h3 className="text-white text-3xl font-black">
                        {project.title}
                      </h3>
                      <p className="text-white/80 mt-2">
                        {project.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>



        {/* <section className="px-6 md:px-20 py-20 lg:py-32 bg-background-light dark:bg-background-dark">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4">Industrial Hardware Store</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
              We supply premium grade Cuplock systems, pipes, and scaffolding
              components certified for heavy-duty industrial use.
            </p>
          </div>
          <div className="grid lg:grid-cols-2 gap-10">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm">
              <h3 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-200">
                Product Category 1
              </h3>
              <div className="relative">
                <div
                  id="cat1"
                  className="flex gap-6 overflow-x-auto scroll-smooth no-scrollbar px-12 py-2 snap-x snap-mandatory"
                  onMouseEnter={() => pauseScroll("cat1")}
                  onMouseLeave={() => resumeScroll("cat1")}
                >
                  <ProductSlide
                    img="https://images.unsplash.com/photo-1504307651254-35680f356dfd"
                    title="Steel Pipes"
                    subtitle="40NB & 50NB Grade"
                  />
                  <ProductSlide
                    img="https://images.unsplash.com/photo-1513828583688-c52646db42da"
                    title="Walkway Boards"
                    subtitle="Heavy Duty"
                  />
                  <ProductSlide
                    img="https://images.unsplash.com/photo-1503387762-592deb58ef4e"
                    title="Scaffolding Clamps"
                    subtitle="Industrial Grade"
                  />
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm">
              <h3 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-200">
                Product Category 2
              </h3>
              <div className="relative">
                <div
                  id="cat2"
                  className="flex gap-6 overflow-x-auto scroll-smooth no-scrollbar px-12 py-2 snap-x snap-mandatory"
                  onMouseEnter={() => pauseScroll("cat2")}
                  onMouseLeave={() => resumeScroll("cat2")}
                >
                  <ProductSlide
                    img="https://images.unsplash.com/photo-1504307651254-35680f356dfd"
                    title="Steel Pipes"
                    subtitle="40NB & 50NB Grade"
                  />
                  <ProductSlide
                    img="https://images.unsplash.com/photo-1513828583688-c52646db42da"
                    title="Walkway Boards"
                    subtitle="Heavy Duty"
                  />
                  <ProductSlide
                    img="https://images.unsplash.com/photo-1503387762-592deb58ef4e"
                    title="Scaffolding Clamps"
                    subtitle="Industrial Grade"
                  />
                </div>
              </div>
            </div>
          </div>
        </section> */}

        {/* -----------------------------------product start--------------------------------- */}

        <section className="px-6 md:px-20 py-20 lg:py-32 bg-background-light dark:bg-background-dark">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4">Industrial Hardware Store</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">We supply premium grade Cuplock systems, pipes, and
              scaffolding components certified for heavy-duty industrial use.</p>
          </div>
          {/* <!-- Grouped Products Layout --> */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">

            {/* <!-- Scaffolding Materials --> */}
            <div>
              <h3 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-200">Scaffolding Materials</h3>
              <div className="grid grid-cols-2 gap-6 lg:gap-8">
                {/* <!-- Product Card 1 --> */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all group">
                  <div
                    className="bg-gray-50 dark:bg-gray-900 rounded-xl aspect-[4/3] flex items-center justify-center mb-6 overflow-hidden">
                    <img className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                      data-alt="Galvanized scaffolding steel pipes bundles"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAu-rukwQgq2R9R2wL_U7k3UdL4dYt4X6n8Zvlo_1Kq_qDihl6Jjo94RsncUxAD5KbItuyOtIRBaEGxDZrQHmGTP3me_wdYbGhITU4AmckGoQDDMYAWq0efCsdt4WV77oun9Zrl9FhP3YZ7lT4lJCB0z2BW82Kduyt1KT8j7vjYnGtzQX_0gnfb1G8lzNR9d7KwZUtK5gWYO4I00pXRu3NUxA-AguLiQf00B3ciTcGWnZ4oteNvToOGAcn7ZLUuURQGnqXB4q8Fs31-" />
                  </div>
                  <h3 className="font-bold text-lg">Steel Pipes</h3>
                  <p className="text-sm text-gray-500 mb-4">40NB &amp; 50NB Grade</p>
                  <div className="flex justify-between items-center">
                    <span className="text-primary font-bold">Standard Size</span>
                    {/* <button className="size-10 rounded-full bg-charcoal text-white flex items-center justify-center">
                  <span className="material-symbols-outlined text-sm">add</span>
                </button> */}
                  </div>
                </div>
                {/* <!-- Product Card 2 --> */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all group">
                  <div
                    className="bg-gray-50 dark:bg-gray-900 rounded-xl aspect-[4/3] flex items-center justify-center mb-6 overflow-hidden">
                    <img className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                      data-alt="Industrial metal walking boards/planks"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDF436iPHDOM4SsH_3PbrTaqpU4BL7vEZdEudZe0iMUuxTK0KQTNuVllF5vmUKFpoEh54p8Hku4OTSp-IDTXXfXMTMsCuXXmmfeE7vBw4kAjJQGJJjSlJqvs2TZ9Md4xqMbcaCGLQhZIX0sG1xx-7PdsQtOIsl5v8HckAgpSLrVqYEb8rOFfYYBQr4km7-qyi--5swXvcrQKZqQmzyqvB6aBM61-Hxsre7WVujvrx7zAWpxcluHG0iDkktkfxNfYW5AHQJrlWBwcuz5" />
                  </div>
                  <h3 className="font-bold text-lg">Walkway Boards</h3>
                  <p className="text-sm text-gray-500 mb-4">Galvanized Anti-Slip</p>
                  <div className="flex justify-between items-center">
                    <span className="text-primary font-bold">Heavy Duty</span>
                    {/* <button className="size-10 rounded-full bg-charcoal text-white flex items-center justify-center">
                  <span className="material-symbols-outlined text-sm">add</span>
                </button> */}
                  </div>
                </div>
              </div>
            </div>

            {/* Name<!-- Access Equipment & Accessories --> */}
            <div>
              <h3 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-200">Access Equipment</h3>
              <div className="grid grid-cols-2 gap-6 lg:gap-8">
                {/* <!-- Product Card 3 --> */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all group">
                  <div
                    className="bg-gray-50 dark:bg-gray-900 rounded-xl aspect-[4/3] flex items-center justify-center mb-6 overflow-hidden">
                    <img className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                      data-alt="Aluminium industrial extension ladders"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuB1-MAorCmAzUP59OAdV8rQDpKgA3RJRAYeknuXi45gkEoGOFbQ7MMzM9iJNjUIwYICDh3UhnzHuUVdTXm6G_e5gAQqCS27N1u-y1QocicQEHh_6LOR3SU1bFg8RiJv_hhuPUOGSIwpJmP5wOdTGZrLOOKhfXQowY2Gq3ghv10e_zWAjThH3sw6deN5OyL4s7pBUa_leVVxxk2DH_NaraHNHT-ntAzmFBgXTZsTH4NICM6sVxHR6fETmriFhZzyniSU14QOPDPtA75z" />
                  </div>
                  <h3 className="font-bold text-lg">Step Ladders</h3>
                  <p className="text-sm text-gray-500 mb-4">Aluminum Alloy Grade</p>
                  <div className="flex justify-between items-center">
                    <span className="text-primary font-bold">L-Type</span>
                    {/* <button className="size-10 rounded-full bg-charcoal text-white flex items-center justify-center">
                  <span className="material-symbols-outlined text-sm">add</span>
                </button> */}
                  </div>
                </div>
                {/* <!-- Product Card 4 --> */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all group">
                  <div
                    className="bg-gray-50 dark:bg-gray-900 rounded-xl aspect-[4/3] flex items-center justify-center mb-6 overflow-hidden">
                    <img className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                      data-alt="Assorted scaffolding metal fittings and clamps"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCjRPxexIKGfOp9TFss2EOpGC1IJfiH5-breVQzNRJYjawi5hQRNPgNlf3gnSgbTkx-a_EcoQYZK89PfacFcqczPDJE8wx2aydjS2RNOs-YKAnJIIUydHymWLMkzETVA-F9Zeh3_WRSccc5y2MmZiNP5WuVd1yPx5UxTP-gqlqYuyVHNUXqNjEPcDA1Y0ELkA8Z5-doFhq4uvbvTPsZ4aETBqnDUOX6nAalxzRC10XOQuSZIkZ0i3rIFoPiPpJ-TOsJl0ZurmdYIYI-" />
                  </div>
                  <h3 className="font-bold text-lg">Couplers &amp; Fittings</h3>
                  <p className="text-sm text-gray-500 mb-4">Forged Right Angle</p>
                  <div className="flex justify-between items-center">
                    <span className="text-primary font-bold">EN-74 Certified</span>
                    {/* <button className="size-10 rounded-full bg-charcoal text-white flex items-center justify-center">
                  <span className="material-symbols-outlined text-sm">add</span>
                </button> */}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>
        {/* ----------------------------------------------------------product end-------------------------------- */}

        <section className="px-6 md:px-20 py-20 lg:py-28 bg-white dark:bg-zinc-900/50 rounded-2xl">
          <div className="text-center mb-16">
            <span className="text-primary font-bold uppercase tracking-widest text-xs">
              Project Gallery
            </span>
            <h2 className="text-4xl font-black mt-2 mb-4">Inside Our Worksites</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto pb-4">
              A glimpse of our scaffolding systems, industrial maintenance, and
              large-scale engineering operations across India.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <GalleryImage src="https://img.freepik.com/premium-photo/workers-ascending-metal-maze-realistic-depiction-scaffolding-climbing-candid-daily-wo_980716-109649.jpg?w=2000" />
            <GalleryImage src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80" />
            <div className="group relative aspect-square overflow-hidden rounded-2xl">
              <video
                src="https://www.w3schools.com/html/mov_bbb.mp4"
                className="w-full h-full object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-[1.06]"
                autoPlay
                muted
                loop
                playsInline
              />
            </div>
            <GalleryImage src="https://cdn.pixabay.com/photo/2023/09/14/09/07/scaffolding-8252585_960_720.jpg" />
            <GalleryImage src="https://images.unsplash.com/photo-1590650153855-d9e808231d41?auto=format&fit=crop&w=900&q=80" />
            <div className="group relative aspect-square overflow-hidden rounded-2xl">
              <video
                src="https://www.w3schools.com/html/movie.mp4"
                className="w-full h-full object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-[1.06]"
                autoPlay
                muted
                loop
                playsInline
              />
            </div>
            <GalleryImage src="https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?auto=format&fit=crop&w=900&q=80" />
            <GalleryImage src="https://img.freepik.com/premium-photo/construction-workers-working-construction-site_891336-3566.jpg" />
          </div>
          <div className="flex justify-center mt-16">
            <Link
              href="/gallery"
              className="bg-primary hover:bg-yellow-500 text-charcoal px-10 py-4 rounded-xl font-bold transition-all shadow-lg shadow-primary/20"
            >
              View Full Gallery
            </Link>
          </div>
        </section>

        <section className="px-6 md:px-20 py-10 lg:py-28 bg-background-light dark:bg-background-dark">
          <div className="text-center mb-16">
            <span className="text-primary font-bold uppercase tracking-widest text-xs">
              Our Achievements
            </span>
            <h2 className="text-4xl font-black mt-2 mb-4">
              Certifications &amp; Industry Recognition
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto lg:py-2">
              Over the years, TP Raju Engineering Contractor has received
              multiple recognitions for safety, quality workmanship, and
              engineering excellence.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            <AchievementCard
              certSrc={CERT1}
              icon="workspace_premium"
              title="ISO 9001:2015 Certification"
              body="Certified for maintaining international quality management standards in industrial engineering and scaffolding services."
              tag="Quality Certification"
              onOpen={openCertificate}
            />
            <AchievementCard
              certSrc={CERT2}
              icon="verified"
              title="Safety Excellence Award"
              body="Recognized for maintaining exceptional safety standards across multiple refinery and industrial maintenance projects."
              tag="Industrial Safety"
              onOpen={openCertificate}
            />
            <AchievementCard
              certSrc={CERT3}
              icon="engineering"
              title="Engineering Excellence"
              body="Honored for delivering large-scale industrial scaffolding and mechanical engineering projects across India."
              tag="Engineering Recognition"
              onOpen={openCertificate}
            />
          </div>
        </section>

        {/* <!-- Testimonials --> */}
        <section className="px-6 md:px-20 py-20 bg-white dark:bg-zinc-900/50 rounded-2xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black mb-3">Client Feedback</h2>
            {/* <!--  <div className="flex justify-center gap-1 text-primary">
              <span className="material-symbols-outlined">star</span>
              <span className="material-symbols-outlined">star</span>
              <span className="material-symbols-outlined">star</span>
              <span className="material-symbols-outlined">star</span>
              <span className="material-symbols-outlined">star</span>
            </div>   --> */}
          </div>

          <div className="grid md:grid-cols-3 gap-6">

            <div className="bg-background-light dark:bg-background-dark p-8 rounded-2xl relative">
              <p className="italic text-gray-600 dark:text-gray-300 mb-6">
                <span className="text-primary font-black text-lg">" </span>
                Their commitment to safety is unparalleled. In our refinery expansion, TP Raju Engineering completed 20,000 man-hours without a single incident.
                <span className="text-primary font-black text-lg">"</span>
              </p>
              <div>
                <p className="font-black">Ramesh Kumar</p>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Safety Head, HPCL</p>
              </div>
            </div>

            <div className="bg-background-light dark:bg-background-dark p-8 rounded-2xl relative">
              <p className="italic text-gray-600 dark:text-gray-300 mb-6">
                <span className="text-primary font-black text-lg">" </span>
                Excellent material quality and prompt delivery. Their fabrication work for our chemical reactor housing was precise and handled with great care.
                <span className="text-primary font-black text-lg">"</span>
              </p>
              <div>
                <p className="font-black">S. Venkatesh</p>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Project Manager, L&amp;T</p>
              </div>
            </div>

            <div className="bg-background-light dark:bg-background-dark p-8 rounded-2xl relative">
              <p className="italic text-gray-600 dark:text-gray-300 mb-6">
                <span className="text-primary font-black text-lg">" </span>
                The rental service is highly efficient. They provided us with specialized cantilever scaffolding that solved a major accessibility challenge.
                <span className="text-primary font-black text-lg">"</span>
              </p>
              <div>
                <p className="font-black">David Miller</p>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Site Engineer, Petrofac</p>
              </div>
            </div>

          </div>
        </section>


        <section className=" mx-6 md:mx-5 my-12 lg:my-15 px-6 md:px-20 py-24 lg:py-32 bg-black text-white overflow-hidden relative rounded-2xl">
          <div className="max-w-[1400px] mx-auto grid lg:grid-cols-2 gap-20 items-start">
            <div className="relative">
              <h2 className="contact-title text-[72px] md:text-[110px] leading-[0.9] font-black tracking-tight">
                LET&apos;S <br />
                GET IN <br />
                TOUCH
              </h2>
              <div className="contact-circle" />
            </div>
            <div className="flex flex-col gap-12">
              <form
                id="contactForm"
                className="space-y-12"
                action={async (formData) => {
                  const result = await sendContactEmail(formData);
                  if (result.success) {
                    alert("Thank you — we will get back to you shortly.");
                    (document.getElementById("contactForm") as HTMLFormElement).reset();
                  } else {
                    alert("Something went wrong. Please try again.");
                  }
                }}
              >
                <div className="form-group">
                  <label htmlFor="fullName">FULL NAME</label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-12">
                  <div className="form-group">
                    <label htmlFor="email">EMAIL</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="john@email.com"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">PHONE</label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+91 0000000000"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={12}
                      onInput={(e) => {
                        const t = e.currentTarget;
                        t.value = t.value.replace(/[^0-9]/g, "");
                      }}
                    />
                  </div>
                </div>
                <div className="form-group message-group">
                  <label htmlFor="messageBox">MESSAGE</label>
                  <textarea
                    ref={messageRef}
                    id="messageBox"
                    name="messageBox"
                    placeholder="Tell us about your project..."
                    rows={1}
                    onInput={onMessageInput}
                  />
                </div>
                <div className="submit-container">
                  <button type="submit" className="submit-btn">
                    <span className="material-symbols-outlined">
                      arrow_forward
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-charcoal dark:bg-black text-gray-400 py-20 border-t border-white/5">
        <div className="max-w-[1440px] mx-auto px-6 md:px-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <div className="size-8 bg-primary rounded flex items-center justify-center text-charcoal">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 48 48"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-extrabold tracking-tight text-white">
                  TP RAJU
                </h2>
              </div>
              <p className="text-sm leading-relaxed">
                Providing high-end scaffolding and engineering services across
                India since 2008. Precision, reliability, and safety are the
                core of our operations.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-8 uppercase tracking-widest text-xs">
                Quick Links
              </h4>
              <ul className="flex flex-col gap-4 text-sm">
                <li>
                  <a className="hover:text-primary transition-colors" href="#">
                    About Company
                  </a>
                </li>
                <li>
                  <a className="hover:text-primary transition-colors" href="#">
                    Our Services
                  </a>
                </li>
                <li>
                  <a className="hover:text-primary transition-colors" href="#">
                    Product Catalogue
                  </a>
                </li>
                <li>
                  <a className="hover:text-primary transition-colors" href="#">
                    Safety Standards
                  </a>
                </li>
                <li>
                  <a className="hover:text-primary transition-colors" href="#">
                    Latest Projects
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-8 uppercase tracking-widest text-xs">
                Services
              </h4>
              <ul className="flex flex-col gap-4 text-sm">
                <li>
                  <a className="hover:text-primary transition-colors" href="#">
                    Scaffolding Rental
                  </a>
                </li>
                <li>
                  <a className="hover:text-primary transition-colors" href="#">
                    Erection Services
                  </a>
                </li>
                <li>
                  <a className="hover:text-primary transition-colors" href="#">
                    Mechanical Work
                  </a>
                </li>
                <li>
                  <a className="hover:text-primary transition-colors" href="#">
                    Thermal Insulation
                  </a>
                </li>
                <li>
                  <a className="hover:text-primary transition-colors" href="#">
                    Steel Fabrication
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-8 uppercase tracking-widest text-xs">
                Contact Us
              </h4>
              <ul className="flex flex-col gap-4 text-sm">
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">
                    location_on
                  </span>
                  102, Industrial Plaza, GIDC Area, Gujarat
                </li>
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">
                    mail
                  </span>
                  info@tprajuengineering.com
                </li>
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">
                    phone
                  </span>
                  +91 98765 43210
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-xs">
              © 2023 TP Raju Engineering Contractor. All rights reserved.
            </p>
            <div className="flex gap-8">
              <a className="text-xs hover:text-white transition-colors" href="#">
                Privacy Policy
              </a>
              <a className="text-xs hover:text-white transition-colors" href="#">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>

      <CertificateModal src={certSrc} onClose={closeCertificate} />
    </>
  );
}

function ProductSlide({
  img,
  title,
  subtitle,
}: {
  img: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="product-item relative w-full min-w-[510px] h-[220px] rounded-2xl overflow-hidden group flex-shrink-0 snap-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={img}
        alt=""
        className="w-full h-full object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-[1.06]"
      />
      <div className="absolute bottom-0 left-0 w-full bg-black/70 text-white p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-[600ms] ease-[cubic-bezier(0.32,0.72,0,1)]">
        <h4 className="font-bold text-lg">{title}</h4>
        <p className="text-sm opacity-80">{subtitle}</p>
      </div>
    </div>
  );
}

function GalleryImage({ src }: { src: string }) {
  return (
    <div className="group relative aspect-square overflow-hidden rounded-2xl">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        className="w-full h-full object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-[1.06]"
      />
      <div className="absolute inset-0 bg-charcoal/40 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]" />
    </div>
  );
}

function AchievementCard({
  certSrc,
  icon,
  title,
  body,
  tag,
  onOpen,
}: {
  certSrc: string;
  icon: string;
  title: string;
  body: string;
  tag: string;
  onOpen: (src: string) => void;
}) {
  return (
    <div className="achievement-card group glass rounded-2xl shadow-xl overflow-hidden">
      <div className="relative overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={certSrc}
          alt=""
          className="certificate-img w-full h-[260px] object-cover cursor-pointer"
          onClick={() => onOpen(certSrc)}
        />
        <div className="certificate-overlay">
          <div
            className="overlay-content cursor-pointer"
            onClick={() => onOpen(certSrc)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onOpen(certSrc);
              }
            }}
            role="button"
            tabIndex={0}
          >
            <span className="material-symbols-outlined text-primary text-4xl">
              {icon}
            </span>
            <p className="text-white font-bold text-sm uppercase tracking-widest mt-2">
              View Certificate
            </p>
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-3">
          <span className="material-symbols-outlined text-primary text-3xl">
            {icon}
          </span>
          <h3 className="text-xl font-bold">{title}</h3>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-sm">{body}</p>
        <div className="mt-4 text-xs uppercase text-gray-500 font-bold tracking-widest">
          {tag}
        </div>
      </div>
    </div>
  );
}
