# Responsive Form - Full-Stack Developer Assignment

A mobile-first responsive contact form built with vanilla HTML, CSS, and JavaScript.

**[Figma Design](https://www.figma.com/design/8KetzbNvo0sIUYd48i0bLs/fullstack-developer?node-id=0-1&t=ZUs3UoKMmOe50cZE-1)**

## Features

- **Semantic HTML** with ARIA attributes for accessibility
- **RTL Support** (Hebrew language)
- **Responsive CSS** using flexbox, CSS variables, and media queries
- **Client-side validation** for required fields, email, and phone formats
- **Thank-you modal** on successful submission

## Project Structure

```
src/
├── index.html      # Main HTML structure
├── css/
│   └── styles.css  # Responsive styles
└── js/
    ├── main.js     # Form logic & modal handling
    └── validate.js # Validation utilities
```

## Quick Start

Open `src/index.html` in a browser, or serve locally:

```bash
npx serve src
```

## Form Fields

| Field | Validation |
|-------|------------|
| Full Name | Required |
| Phone | Required, Israeli format |
| Showroom | Required (select) |
| Email | Required, valid format |
| Marketing Consent | Optional |

## Browser Support

Modern browsers (Chrome, Firefox, Safari, Edge)

---

*Built following best practices in accessibility, responsiveness, and UX.*
