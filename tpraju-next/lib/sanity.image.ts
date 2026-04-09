import imageUrlBuilder from '@sanity/image-url'
import { client } from './sanity.client'
import { SanityImage } from "@/types/sanity"

const builder = imageUrlBuilder(client)

export const urlFor = (source: SanityImage) => builder.image(source)