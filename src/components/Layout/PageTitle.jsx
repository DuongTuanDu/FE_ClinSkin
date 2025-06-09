import React, { useEffect } from "react";
import { Helmet } from "react-helmet";

const SITE_NAME = "ClinSkin";
const DEFAULT_DESCRIPTION =
    "ClinSkin - Trang web chuyên cung cấp mỹ phẩm và dịch vụ chăm sóc da tốt nhất, uy tín, và an toàn.";
const DEFAULT_KEYWORDS =
    "mỹ phẩm, skincare, chăm sóc da, ClinSkin";

const PageTitle = ({
    title,
    description = DEFAULT_DESCRIPTION,
    keywords = DEFAULT_KEYWORDS,
    ogImage = "https://i.pinimg.com/236x/fc/c2/9e/fcc29e50faabd60965d79d8d6caa8fb8.jpg",
    children,
}) => {
    const fullTitle = title;
    const canonicalUrl = window.location.href.split("?")[0];

    useEffect(() => {
        document.title = fullTitle;
    }, [fullTitle]);

    // Schema markup for SEO
    const websiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: SITE_NAME,
        url: "https://clinskin.vercel.app",
        description: description,
        potentialAction: {
            "@type": "SearchAction",
            target: "https://clinskin.vercel.app/auth",
            "query-input": "required name=search_term_string",
        },
    };

    return (
        <>
            <Helmet>
                {/* Basic Meta Tags */}
                <title>{fullTitle}</title>
                <meta name="description" content={description} />
                <meta name="keywords" content={keywords} />
                <link rel="canonical" href={canonicalUrl} />

                {/* Open Graph Tags */}
                <meta property="og:title" content={fullTitle} />
                <meta property="og:description" content={description} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={canonicalUrl} />
                <meta property="og:image" content={ogImage} />
                <meta property="og:site_name" content={SITE_NAME} />
                <meta property="og:locale" content="vi_VN" />

                {/* Twitter Card Tags */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={fullTitle} />
                <meta name="twitter:description" content={description} />
                <meta name="twitter:image" content={ogImage} />

                {/* Additional Meta Tags */}
                <meta name="robots" content="index, follow" />
                <meta name="author" content={SITE_NAME} />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
                <meta name="language" content="Vietnamese" />
                <meta name="revisit-after" content="7 days" />

                {/* Schema Markup */}
                <script type="application/ld+json">
                    {JSON.stringify(websiteSchema)}
                </script>
            </Helmet>
            <main role="main" id="main-content">
                {children}
            </main>
        </>
    );
};

export default PageTitle;
