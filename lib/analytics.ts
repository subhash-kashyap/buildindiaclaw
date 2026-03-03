import mixpanel from 'mixpanel-browser';

// Replace with your actual Mixpanel token or use an environment variable
const MIXPANEL_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN || 'your-mixpanel-token-here';

const isProd = process.env.NODE_ENV === 'production';

export const initAnalytics = () => {
  if (typeof window !== 'undefined') {
    mixpanel.init(MIXPANEL_TOKEN, {
      debug: !isProd,
      track_pageview: true,
      persistence: 'localStorage',
    });
  }
};

export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  if (typeof window !== 'undefined') {
    mixpanel.track(eventName, properties);
  }
};

export const identity = (userId: string, traits?: Record<string, any>) => {
  if (typeof window !== 'undefined') {
    mixpanel.identify(userId);
    if (traits) {
      mixpanel.people.set(traits);
    }
  }
};

export const trackClick = (elementName: string, additionalProps?: Record<string, any>) => {
  trackEvent('Click', {
    element: elementName,
    ...additionalProps,
  });
};
