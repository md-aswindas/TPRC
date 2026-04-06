import { LandingPage } from "@/components/landing/LandingPage";
import { client } from "@/lib/sanity.client";

export default async function Home() {
  const [clients, projects, gallery, products] = await Promise.all([
    client.fetch(`*[_type == "majorClient"]{_id, name, logo}`),
    client.fetch(`*[_type == "project"] | order(_createdAt desc) {_id, title, category, description, image}`), 
    client.fetch(`*[_type == "galleryItem"] | order(_createdAt desc)`),
    client.fetch(`*[_type == "product"] | order(_createdAt desc)`)
    ]);

  return (
    <LandingPage 
      clients={clients || []} 
      projects={projects || []} 
      gallery={gallery || []}
      products={products || []}
    />
  );
}