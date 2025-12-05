import serverless from 'serverless-http'
import app from '../src/app'

// Wrap the Express app with serverless-http and export as the default handler
export default serverless(app as any)
