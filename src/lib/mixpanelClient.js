import mixpanel from "mixpanel-browser";

const MIXPANEL_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;

export const initMixpanel = () => {
  if (!MIXPANEL_TOKEN) {
    console.warn("Mixpanel token is missing! Check your .env file.");
    return;
  }

  mixpanel.init(MIXPANEL_TOKEN, { autocapture: true });
};

export const setMixpanelUser = (user) => {
  if (!user) {
    console.warn("User is missing! Check your .env file.");
    return;
  }

  mixpanel.people.set(user.id, user);
};

export const setMixpanelTrack = (eventId, properties) => {
  if (!eventId) {
    console.warn("Event ID is missing! Check your .env file.");
    return;
  }

  mixpanel.track(eventId, properties);
};
