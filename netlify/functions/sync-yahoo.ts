import { Handler, schedule } from '@netlify/functions';
import { syncYahooData } from '../../src/lib/yahoo';

const handler: Handler = async (event, context) => {
  try {
    const result = await syncYahooData();
    return {
      statusCode: 200,
      body: JSON.stringify({ success: result.success })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to sync data' })
    };
  }
};

// Run every 6 hours
export const handler = schedule('0 */6 * * *', handler);
