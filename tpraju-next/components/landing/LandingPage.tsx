"use client";

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
import { Project, Product, GalleryItem, Client } from "@/types/sanity";

const HERO_BG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCWASYnz6kODAfg1YQ7cNgUaCc6Qf64cMUfUHa-QNDn1FrMKLUdQdl3YTQHI8hCfUECTGZghv4-X3PzmTWa1V3QJOSi4ifkXFl9DBLxqsCjjWkGdPK2iQIFEFWmJ_Be1ygq8HgEgr-tk8-CPTuhtc4DjiKfL4OnIogfAvI4svCNTlMf5nNGIFUPaIUwtjhC0vjyHufhH0MTJwT3Z9r8iuUVLhjnrFHeJNJ3rsijo4Z820RAIbo4bSFdhdM--vU7TxWWDxHSErUfIfM7";

const ABOUT_IMG =
  "https://img.freepik.com/premium-photo/tall-building-with-crane-top-it_662214-417885.jpg";

const CERT1 =
  "https://img.freepik.com/free-vector/certificate-template-design_53876-59034.jpg";
const CERT2 =
  "https://img.freepik.com/free-vector/certificate-template-design_53876-59037.jpg";
const CERT3 =
  "https://img.freepik.com/free-vector/certificate-template-design_53876-59041.jpg";

// Fallback categories for when products are not available
const FALLBACK_CATEGORIES = [
  {
    id: "scaffolding",
    number: "01",
    name: "Scaffolding Materials",
    products: [
      {
        id: "p1",
        name: "Steel Pipes",
        subtitle: "40NB & 50NB Grade",
        tag: "Standard Size",
        image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80"
      },
      {
        id: "p2",
        name: "Walkway Boards",
        subtitle: "Galvanized Anti-Slip",
        tag: "Heavy Duty",
        image: "https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&w=800&q=80"
      },
      {
        id: "p3",
        name: "Cuplock Standards",
        subtitle: "High Tensile Steel",
        tag: "Verticals",
        image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80"
      },
      {
        id: "p4",
        name: "Cuplock Ledgers",
        subtitle: "Horizontal Support",
        tag: "Horizontals",
        image: "https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&w=800&q=80"
      },
      {
        id: "p5",
        name: "Joint Pins",
        subtitle: "Pipe Connection",
        tag: "Fittings",
        image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80"
      },
      {
        id: "p6",
        name: "Base Plates",
        subtitle: "Foundation Support",
        tag: "Base Setup",
        image: "https://images.unsplash.com/photo-1590650153855-d9e808231d41?auto=format&fit=crop&w=800&q=80"
      }
    ]
  },
  {
    id: "access",
    number: "02",
    name: "Access Equipment",
    products: [
      {
        id: "p7",
        name: "Step Ladders",
        subtitle: "Aluminum Alloy Grade",
        tag: "L-Type",
        image: "https://img.freepik.com/premium-photo/industrial-power-tool-worker-using-angle-grinder-with-sparks-flying_53876-130005.jpg?w=800"
      },
      {
        id: "p8",
        name: "Couplers & Fittings",
        subtitle: "Forged Right Angle",
        tag: "EN-74 Certified",
        image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80"
      },
      {
        id: "p9",
        name: "Base Jacks",
        subtitle: "Adjustable Support",
        tag: "Heavy Duty",
        image: "https://images.unsplash.com/photo-1590650153855-d9e808231d41?auto=format&fit=crop&w=800&q=80"
      },
      {
        id: "p10",
        name: "U-Head Jacks",
        subtitle: "Top Support",
        tag: "Adjustable",
        image: "https://img.freepik.com/free-photo/closeup-photo-worker-welding-metal-with-sparks-factory_181624-9122.jpg?w=800"
      },
      {
        id: "p11",
        name: "Mobile Towers",
        subtitle: "Aluminum Scaffolding",
        tag: "Rolling",
        image: "https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&w=800&q=80"
      },
      {
        id: "p12",
        name: "Prop Jacks",
        subtitle: "Telescopic Steel",
        tag: "Supports",
        image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80"
      }
    ]
  }
];

// Helper function to transform Sanity products into categories
const transformProductsToCategories = (products: Product[]) => {
  if (!products || products.length === 0) {
    return FALLBACK_CATEGORIES;
  }

  // Group products by category
  const grouped = products.reduce((acc: Record<string, {
    id: string;
    number: string;
    name: string;
    products: {
      id: string;
      name: string;
      subtitle?: string;
      tag?: string;
      image: string;
    }[];
  }>, product: Product) => {
    const categoryKey = product.categoryName || "Uncategorized";
    if (!acc[categoryKey]) {
      acc[categoryKey] = {
        id: product.categoryName?.toLowerCase().replace(/\s+/g, '-') || "uncategorized",
        number: product.categoryNumber || "00",
        name: product.categoryName || "Uncategorized",
        products: []
      };
    }
    acc[categoryKey].products.push({
      id: product._id,
      name: product.title,
      subtitle: product.subtitle,
      tag: product.tag,
      image: product.image ? urlFor(product.image).url() : "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80"
    });
    return acc;
  }, {});

  return Object.values(grouped);
};

// Fallback gallery items for when no gallery data is available
const FALLBACK_GALLERY_ITEMS = [
  { id: 'g1', mediaType: 'image', src: "https://img.freepik.com/premium-photo/workers-ascending-metal-maze-realistic-depiction-scaffolding-climbing-candid-daily-wo_980716-109649.jpg?w=2000", gridClass: "col-span-2 row-span-2", title: "Scaffolding Installation" },
  { id: 'g2', mediaType: 'image', src: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80", gridClass: "col-span-2 row-span-1", title: "Project Overview" },
  { id: 'g3', mediaType: 'video', src: "https://www.w3schools.com/html/mov_bbb.mp4", gridClass: "col-span-1 row-span-1", title: "Work in Progress" },
  { id: 'g4', mediaType: 'image', src: "https://cdn.pixabay.com/photo/2023/09/14/09/07/scaffolding-8252585_960_720.jpg", gridClass: "col-span-1 row-span-1", title: "Safety Setup" },
  { id: 'g5', mediaType: 'image', src: "https://images.unsplash.com/photo-1590650153855-d9e808231d41?auto=format&fit=crop&w=900&q=80", gridClass: "col-span-1 row-span-2 hidden md:block", title: "Structural Work" },
  { id: 'g6', mediaType: 'video', src: "https://www.w3schools.com/html/movie.mp4", gridClass: "col-span-2 row-span-2", title: "On-Site Documentation" },
  { id: 'g7', mediaType: 'image', src: "https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?auto=format&fit=crop&w=900&q=80", gridClass: "col-span-1 row-span-1", title: "Construction Details" },
  { id: 'g8', mediaType: 'image', src: "https://img.freepik.com/premium-photo/construction-workers-working-construction-site_891336-3566.jpg", gridClass: "col-span-1 row-span-1", title: "Team at Work" },
  { id: 'g9', mediaType: 'image', src: "https://images.unsplash.com/photo-1590650153855-d9e808231d41?auto=format&fit=crop&w=900&q=80", gridClass: "col-span-2 row-span-1 md:hidden", title: "Project Completion" },
];

// Helper function to transform Sanity gallery items
const transformGalleryItems = (galleryItems: GalleryItem[]) => {
  if (!galleryItems || galleryItems.length === 0) {
    return FALLBACK_GALLERY_ITEMS;
  }

  // Map through gallery items and optimize media
  return galleryItems.map((item: GalleryItem, index: number) => {
    let src = '';
    if (item.mediaType === 'image' && item.image) {
      src = urlFor(item.image)
        .width(800)
        .quality(80)
        .auto('format')
        .url();
    } else if (item.mediaType === 'video' && item.videoUrl) {
      src = item.videoUrl;
    }

    // Assign grid positions in a cycle to maintain layout variety
    const gridClasses = [
      "col-span-2 row-span-2",
      "col-span-2 row-span-1",
      "col-span-1 row-span-1",
      "col-span-1 row-span-1",
      "col-span-1 row-span-2 hidden md:block",
      "col-span-2 row-span-2",
      "col-span-1 row-span-1",
      "col-span-1 row-span-1",
      "col-span-2 row-span-1 md:hidden"
    ];

    return {
      id: item._id,
      mediaType: item.mediaType,
      src,
      gridClass: gridClasses[index % gridClasses.length],
      title: item.title || 'Gallery Item'
    };
  });
};

interface LandingPageProps {
  clients: Client[];
  projects: Project[];
  gallery: GalleryItem[];
  products: Product[];
}

export function LandingPage({ clients, projects, gallery, products }: LandingPageProps) {
  // Transform Sanity products into categories
  const categories = transformProductsToCategories(products);
  
  // Transform Sanity gallery items
  const galleryItems = transformGalleryItems(gallery);
  
  const [activeTab, setActiveTab] = useState(categories[0]?.id || "");
  const [certSrc, setCertSrc] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const pausedSlidersRef = useRef(new Set<string>());
  const sliderStateRef = useRef<Record<string, number>>({ cat1: 0, cat2: 0 });
  const productScrollRef = useRef<HTMLDivElement>(null);

  const scrollProductsLeft = () => {
    if (productScrollRef.current) {
      const cardWidth = (productScrollRef.current.children[0] as HTMLElement)?.offsetWidth || 300;
      const gap = 24;
      productScrollRef.current.scrollBy({ left: -(cardWidth + gap), behavior: "smooth" });
    }
  };

  const scrollProductsRight = () => {
    if (productScrollRef.current) {
      const cardWidth = (productScrollRef.current.children[0] as HTMLElement)?.offsetWidth || 300;
      const gap = 24;
      productScrollRef.current.scrollBy({ left: cardWidth + gap, behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (productScrollRef.current) {
      productScrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
    }
  }, [activeTab]);

  const openCertificate = useCallback((src: string) => setCertSrc(src), []);
  const closeCertificate = useCallback(() => setCertSrc(null), []);

  useEffect(() => {
    // This matches the timing of your TPRCLoader (approx 3.2 seconds)
    const timer = setTimeout(() => setIsLoaded(true), 3200);
    return () => clearTimeout(timer);
  }, []);

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

  const pauseScroll = (id: string) => pausedSlidersRef.current.add(id);
  const resumeScroll = (id: string) => pausedSlidersRef.current.delete(id);

  return (
    <>
      <TPRCLoader />
      {/* Only render the share button once isLoaded is true */}
      {isLoaded && <ShareFloating />}

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
            {/* <a
              className="text-sm font-semibold hover:text-primary transition-colors"
              href="#"
            >
              Gallery
            </a> */}
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
                className="bg-primary hover:bg-yellow-500 text-charcoal px-8 py-4 rounded-full font-bold text-base shadow-lg shadow-primary/20 transition-all flex items-center gap-2"
              >
                Contact Us{" "}
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
              <button
                type="button"
                className="border-2 border-charcoal/10 dark:border-white/10 hover:bg-charcoal hover:text-white dark:hover:bg-white dark:hover:text-charcoal px-8 py-4 rounded-full font-bold text-base transition-all"
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
            {clients?.map((client: Client) => (
              <div
                key={client._id}
                className="group bg-background-light dark:bg-background-dark p-8 rounded-xl flex flex-col items-center justify-center gap-4 shadow-sm hover:shadow-xl transition-all">
                <img
                  src={urlFor(client.logo)
                    .height(48)
                    .fit('max')
                    .auto('format')
                    .quality(80)
                    .url()}
                  alt={client.name}
                  className="h-12 w-auto object-contain grayscale group-hover:grayscale-0 transition-all"
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
              {projects?.map((project: Project) => (

                <div key={project._id} className="min-w-[400px] md:min-w-[600px] snap-center">
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

        <section className="px-6 md:px-20 py-20 lg:py-32 bg-background-light dark:bg-background-dark">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4">Industrial Hardware Store</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">We supply premium grade Cuplock systems, pipes, and scaffolding components certified for heavy-duty industrial use.</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
            {/* <!-- Left Column: Tabs --> */}
            <div className="lg:w-1/3 flex flex-col justify-top gap-4 ">
              {categories.map((category) => {
                const isActive = activeTab === category.id;
                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveTab(category.id)}
                    className={`flex items-center justify-center lg:justify-start gap-4 p-4 lg:py-4 lg:px-0 transition-all duration-300 ${isActive
                      ? ''
                      : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                      }`}
                  >
                    <span className={`text-3xl lg:text-4xl font-black transition-colors ${isActive ? 'text-primary' : 'text-gray-300 dark:text-gray-700'}`}>
                      {category.number}
                    </span>
                    <span className={`text-lg md:text-xl font-bold text-left transition-colors ${isActive ? 'text-charcoal dark:text-white' : ''}`}>
                      {category.name}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* <!-- Right Column: Product Cards Carousel --> */}
            <div className="lg:w-2/3 flex flex-col">
              <div
                ref={productScrollRef}
                className="flex gap-4 lg:gap-6 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-6"
              >
                {categories.find(c => c.id === activeTab)?.products.map((product: {
                    id: string;
                    name: string;
                    subtitle?: string;
                    tag?: string;
                    image: string;
                  }) => (
                  <div
                    key={product.id}
                    className="w-[85vw] sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] shrink-0 snap-start bg-white dark:bg-gray-800 p-4 lg:p-5 rounded-2xl shadow-sm hover:shadow-xl transition-all group animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col"
                  >
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg aspect-[4/3] flex items-center justify-center mb-4 overflow-hidden">
                      <img
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        alt={product.name}
                        src={product.image}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-base lg:text-lg mb-1 leading-tight truncate">{product.name}</h3>
                      <p className="text-xs lg:text-sm text-gray-500 mb-4 truncate">{product.subtitle}</p>
                    </div>
                    <div className="flex justify-between items-center border-t border-gray-100 dark:border-gray-700 pt-4 mt-auto">
                      <span className="text-primary font-bold text-xs lg:text-sm tracking-wide">{product.tag}</span>
                      {/* <button className="size-8 lg:size-10 rounded-full bg-background-light dark:bg-background-dark group-hover:bg-primary group-hover:text-charcoal flex items-center justify-center transition-colors shrink-0">
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                      </button> */}
                    </div>
                  </div>
                ))}
              </div>

              {/* <!-- Scroll Controls --> */}
              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={scrollProductsLeft}
                  className="size-10 rounded-full border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-primary hover:text-charcoal hover:border-primary transition-all text-gray-500 hover:text-charcoal dark:text-gray-400"
                  aria-label="Scroll left"
                >
                  <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <button
                  onClick={scrollProductsRight}
                  className="size-10 rounded-full border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-primary hover:text-charcoal hover:border-primary transition-all text-gray-500 hover:text-charcoal dark:text-gray-400"
                  aria-label="Scroll right"
                >
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
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
          <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[180px] md:auto-rows-[240px] gap-4 md:gap-6">
            {galleryItems.map((item: { id: string, mediaType: string, src: string, gridClass: string }) => 
              item.mediaType === 'video' ? (
                <div key={item.id} className={`group relative overflow-hidden shadow-sm hover:shadow-xl transition-all ${item.gridClass}`}>
                  <video
                    src={item.src}
                    className="w-full h-full object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-[1.06] block"
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                  <div className="absolute inset-0 bg-charcoal/40 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] pointer-events-none" />
                </div>
              ) : (
                <GalleryImage key={item.id} src={item.src} className={item.gridClass} />
              )
            )}
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
                <span className="text-primary font-black text-lg">&quot; </span>
                Their commitment to safety is unparalleled. In our refinery expansion, TP Raju Engineering completed 20,000 man-hours without a single incident.
                <span className="text-primary font-black text-lg">&quot;</span>
              </p>
              <div>
                <p className="font-black">Ramesh Kumar</p>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Safety Head, HPCL</p>
              </div>
            </div>

            <div className="bg-background-light dark:bg-background-dark p-8 rounded-2xl relative">
              <p className="italic text-gray-600 dark:text-gray-300 mb-6">
                <span className="text-primary font-black text-lg">&quot; </span>
                Excellent material quality and prompt delivery. Their fabrication work for our chemical reactor housing was precise and handled with great care.
                <span className="text-primary font-black text-lg">&quot;</span>
              </p>
              <div>
                <p className="font-black">S. Venkatesh</p>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Project Manager, L&amp;T</p>
              </div>
            </div>

            <div className="bg-background-light dark:bg-background-dark p-8 rounded-2xl relative">
              <p className="italic text-gray-600 dark:text-gray-300 mb-6">
                <span className="text-primary font-black text-lg">&quot; </span>
                The rental service is highly efficient. They provided us with specialized cantilever scaffolding that solved a major accessibility challenge.
                <span className="text-primary font-black text-lg">&quot;</span>
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

function GalleryImage({ src, className = "" }: { src: string; className?: string }) {
  return (
    <div className={`group relative overflow-hidden shadow-sm hover:shadow-xl transition-all ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        loading="lazy"
        className="w-full h-full object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-[1.06] block"
      />
      <div className="absolute inset-0 bg-charcoal/40 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] pointer-events-none" />
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
