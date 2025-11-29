export const trackEvent = (action: string, category: string, label: string = '') => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', action, {
      event_category: category,
      event_label: label,
      timestamp: new Date().toISOString()
    });
  }

  console.log(`📊 Event: ${action} | ${category} | ${label}`);

  const events = JSON.parse(localStorage.getItem('analyticsEvents') || '[]');
  events.push({
    action,
    category,
    label,
    timestamp: new Date().toISOString()
  });

  if (events.length > 100) {
    events.shift();
  }

  localStorage.setItem('analyticsEvents', JSON.stringify(events));
};

export const trackToolUsage = (toolName: string, action: string = 'used') => {
  trackEvent(action, 'Tool Usage', toolName);

  const toolUsageCount = parseInt(localStorage.getItem(`tool_${toolName}_count`) || '0');
  localStorage.setItem(`tool_${toolName}_count`, String(toolUsageCount + 1));

  if (!localStorage.getItem('firstToolUsed')) {
    localStorage.setItem('firstToolUsed', new Date().toISOString());
  }
  localStorage.setItem('toolUsedOnce', 'true');
  localStorage.setItem('lastToolUsed', toolName);
  localStorage.setItem('lastToolUsedTime', new Date().toISOString());
};

export const trackPageView = (pageName: string) => {
  trackEvent('page_view', 'Navigation', pageName);
};

export const trackConversion = (type: string, value: string = '') => {
  trackEvent('conversion', type, value);

  const conversions = JSON.parse(localStorage.getItem('conversions') || '[]');
  conversions.push({
    type,
    value,
    timestamp: new Date().toISOString()
  });
  localStorage.setItem('conversions', JSON.stringify(conversions));
};

export const getAnalyticsSummary = () => {
  const events = JSON.parse(localStorage.getItem('analyticsEvents') || '[]');
  const conversions = JSON.parse(localStorage.getItem('conversions') || '[]');
  const firstToolUsed = localStorage.getItem('firstToolUsed');
  const emailCaptured = localStorage.getItem('emailCaptured');

  return {
    totalEvents: events.length,
    totalConversions: conversions.length,
    firstToolUsed,
    emailCaptured,
    events: events.slice(-10),
    conversions
  };
};
