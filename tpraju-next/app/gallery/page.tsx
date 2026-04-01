import Link from "next/link";

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-charcoal dark:text-gray-100 px-6 py-20">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-black mb-4">Gallery</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Full gallery content can be added here. This route replaces the old{" "}
          <code className="text-sm bg-black/10 dark:bg-white/10 px-2 py-1 rounded">
            gallery.html
          </code>{" "}
          link from the static site.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-primary text-charcoal px-6 py-3 rounded-xl font-bold hover:bg-yellow-500 transition-colors"
        >
          ← Back to home
        </Link>
      </div>
    </div>
  );
}
