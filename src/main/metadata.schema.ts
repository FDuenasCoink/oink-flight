import { z } from 'zod'

export interface CompileData {
  project: string
  name: string
  version: string
  notes: string
  author: string
}

export type TMetadata = z.infer<typeof Metadata>
export type TMetadataList = z.infer<typeof MetadataList>

export const Metadata = z.object({
  name: z.string(),
  createdAt: z.string(),
  version: z.string(),
  notes: z.string(),
  author: z.string(),
  location: z.string()
})

export const MetadataList = z.record(z.string(), Metadata)
