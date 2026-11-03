# Personal CV Website

A responsive, animated personal CV website for **Jamalee Qym Talento**, an Information Technology student and Microsoft Certified Azure Administrator Associate (AZ-104).

## Technologies Used
- HTML5, CSS3, vanilla JavaScript (no build step)
- Google Fonts (Inter Tight)
- Deployed on Vercel

## Student Name
Jamalee Qym Talento — BSIT, Davao del Norte State College

## Live Vercel Link
https://cv-repo-xi.vercel.app/

## GitHub Repository
https://github.com/talentojamaleeqym-eng/cv-repo

## Structure
```
index.html      page content
css/styles.css  design system, layout, animations
js/main.js      nav, scroll reveal, skill bars, terminal, project filter
assets/         profile.jpg goes here
```

## Motion Design
Animation follows a small set of research-backed rules:
- **Fast and purposeful:** UI motion stays in the 100-500 ms range; hover feedback is about 180 ms.
- **One thing moves at a time:** the hero plays an ordered sequence (name, role, intro, actions, terminal), then everything else reveals on scroll with a short stagger.
- **No blocking intro:** the page is fully painted on the first frame, because visitors judge a site's appearance within about 50 ms.
- **Progress cues:** a scroll progress bar and side section rail show how far through the page you are.
- **Accessible:** no parallax or large scroll-driven motion, and everything turns off under the OS "reduce motion" setting (WCAG 2.3.3).
