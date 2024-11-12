import { Handler, schedule } from '@netlify/functions';
import { syncYahooData } from './yahoo-service';

const syncHandler: Handler = async (event, context) => {
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

export const handler = schedule('0 */6 * * *', syncHandler);
