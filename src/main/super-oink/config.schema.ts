import { z } from 'zod'

export type TConfig = z.infer<typeof Config>

export const Config = z.object({
  oink_available: z.boolean(),
  ulr_record_register: z.string(),
  piggybank_id: z.string(),
  deposit_limit_offset: z.number(),
  credentials: z.object({
    username: z.string(),
    password: z.string()
  }),
  hardware: z.object({
    validator: z.object({
      type: z.enum(['azkoyen', 'pelicano']),
      available: z.boolean()
    }),
    dispenser: z.object({
      type: z.enum(['dispenser']),
      available: z.boolean(),
      cards_count: z.boolean()
    }),
    billValidator: z.object({
      type: z.enum(['nv10']),
      available: z.boolean()
    })
  }),
  url_videos: z.object({
    welcome: z.string(),
    what_is_coink: z.string(),
    how_to_deposit: z.string(),
    visa_creating: z.string(),
    onboarding: z.string()
  }),
  timers: z.object({
    session_inactivity: z.number(),
    logout_inactivity: z.number(),
    vaucher_inactivity: z.number(),
    recycle_card_timeout: z.number(),
    deposit_inactivity: z.number(),
    heart_beat: z.number()
  })
})
