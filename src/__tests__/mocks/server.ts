/**
 * WellnessTall MSW Server
 * Test server configuration
 */

import { setupServer } from 'msw/node'
import { handlers } from './handlers'

export const server = setupServer(...handlers)
