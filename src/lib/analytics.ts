"use client";

// Extend the Window interface for gtag
declare global {
    interface Window {
        gtag?: (
            command: "event" | "config" | "js",
            action: string | Date,
            params?: Record<string, unknown>
        ) => void;
    }
}

type EventParams = {
    category?: string;
    label?: string;
    value?: number;
    [key: string]: unknown;
};

/**
 * Track a custom event in Google Analytics
 * @param eventName - The name of the event to track
 * @param params - Additional parameters for the event
 */
export function trackEvent(eventName: string, params?: EventParams) {
    if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", eventName, params);
    }
}

/**
 * Track a page view (useful for SPA navigation tracking)
 * @param url - The URL to track
 * @param title - Optional page title
 */
export function trackPageView(url: string, title?: string) {
    if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "page_view", {
            page_path: url,
            page_title: title,
        });
    }
}

/**
 * Track contact form submission
 */
export function trackContactSubmission() {
    trackEvent("contact_form_submit", {
        category: "engagement",
        label: "Contact Form",
    });
}

/**
 * Track project view
 */
export function trackProjectView(projectName: string, projectSlug: string) {
    trackEvent("view_project", {
        category: "engagement",
        label: projectName,
        project_slug: projectSlug,
    });
}

/**
 * Track blog post read
 */
export function trackBlogRead(postTitle: string, postSlug: string) {
    trackEvent("read_blog_post", {
        category: "engagement",
        label: postTitle,
        post_slug: postSlug,
    });
}

/**
 * Track CTA click
 */
export function trackCTAClick(ctaName: string, location: string) {
    trackEvent("cta_click", {
        category: "engagement",
        label: ctaName,
        location: location,
    });
}

/**
 * Track service view
 */
export function trackServiceView(serviceName: string, serviceSlug: string) {
    trackEvent("view_service", {
        category: "engagement",
        label: serviceName,
        service_slug: serviceSlug,
    });
}

/**
 * Track outbound link clicks (social, external)
 */
export function trackOutboundLink(url: string, linkType: string) {
    trackEvent("outbound_link", {
        category: "outbound",
        label: url,
        link_type: linkType,
    });
}
