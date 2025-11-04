# 🎨 EduBridge Branding Guide

## Overview

EduBridge uses a professional, modern design system built around trust, accessibility, and educational excellence. This guide ensures consistent branding across all components and features.

---

## 🎨 Color Palette

### Primary Colors (Indigo)
**Purpose:** Trust, professionalism, stability

```css
Primary 50:  #eef2ff  /* Lightest */
Primary 500: #6366f1  /* Main brand color */
Primary 600: #4f46e5  /* Hover states, buttons */
Primary 900: #312e81  /* Darkest */
```

**Usage:**
- Primary buttons
- Links and interactive elements
- Brand logos and icons
- Headers and important text

### Secondary Colors (Blue)
**Purpose:** Technology, learning, innovation

```css
Secondary 500: #3b82f6  /* Main secondary */
Secondary 600: #2563eb  /* Hover states */
Secondary 700: #1d4ed8  /* Active states */
```

**Usage:**
- Secondary buttons
- Information badges
- Learning indicators
- Technical elements

### Accent Colors (Sky/Cyan)
**Purpose:** Freshness, modern feel, highlights

```css
Accent 400: #22d3ee  /* Highlight color */
Accent 500: #06b6d4  /* Main accent */
Accent 600: #0891b2  /* Darker accent */
```

**Usage:**
- Call-to-action highlights
- Success states
- Feature highlights
- Decorative elements

### Background Colors

```css
Background Light: #ffffff
Background Gray:  #f8fafc
Background Dark:  #0f172a  /* For future dark mode */
```

---

## 🔤 Typography

### Font Families

**Primary:** Inter
- Weights: 300, 400, 500, 600, 700, 800
- Usage: Body text, UI elements, navigation

**Display:** Poppins
- Weights: 400, 500, 600, 700, 800
- Usage: Headings, hero text, brand statements

**Monospace:** Fira Code / Monaco
- Usage: Code blocks, technical content

### Typography Scale

```css
H1: 3rem - 4rem (48px - 64px)  /* Hero headings */
H2: 2.25rem - 3rem (36px - 48px)  /* Section headings */
H3: 1.875rem - 2.25rem (30px - 36px)  /* Subsection headings */
Body: 1rem (16px)  /* Base font size */
Small: 0.875rem (14px)  /* Secondary text */
```

### Letter Spacing
- Headings: `-0.02em` (tighter for modern look)
- Body: Default

---

## 📐 Spacing & Layout

### Consistent Spacing Scale

```css
4px   - xs  (0.25rem)
8px   - sm  (0.5rem)
16px  - md  (1rem)
24px  - lg  (1.5rem)
32px  - xl  (2rem)
48px  - 2xl (3rem)
64px  - 3xl (4rem)
```

### Section Padding
- Standard sections: `py-16 md:py-20 lg:py-24`
- Compact sections: `py-12 md:py-16`

### Container Padding
- Mobile: `px-4`
- Tablet: `px-6`
- Desktop: `px-8`

---

## 🎭 Shadows

### Soft Shadow
```css
0 2px 15px -3px rgba(0, 0, 0, 0.07), 
0 10px 20px -2px rgba(0, 0, 0, 0.04)
```
**Usage:** Cards, subtle elevation

### Medium Shadow
```css
0 4px 25px -5px rgba(0, 0, 0, 0.1), 
0 10px 30px -5px rgba(0, 0, 0, 0.04)
```
**Usage:** Hovered cards, modals

### Strong Shadow
```css
0 10px 40px -10px rgba(0, 0, 0, 0.15), 
0 20px 50px -10px rgba(0, 0, 0, 0.08)
```
**Usage:** Dropdowns, elevated modals, hero elements

---

## 🔲 Border Radius

### Standard Rounding
```css
Small:  8px (0.5rem)   /* Buttons, inputs */
Medium: 12px (0.75rem) /* Cards */
Large:  16px (1rem)    /* Large cards */
XL:     24px (1.5rem)   /* Hero sections */
2XL:    32px (2rem)     /* Special elements */
```

**Philosophy:** Soft, approachable, modern

---

## 🖼️ Logo & Favicon

### Favicon
- **File:** `/client/public/favicon.svg`
- **Design:** Gradient graduation cap icon
- **Colors:** Primary indigo to secondary blue gradient

### Logo Mark
- **Icon:** Graduation cap
- **Colors:** Gradient (indigo-600 to blue-500)
- **Size:** Minimum 40px height for visibility

### Logo Text
- **Font:** Poppins, Bold (700)
- **Size:** Responsive (2xl on desktop)
- **Color:** Primary-600 or white (depending on background)

---

## 🔘 Buttons

### Primary Button
```css
Background: Gradient (primary-600 to secondary-600)
Text: White
Padding: px-6 py-3
Border Radius: 0.5rem (8px)
Shadow: Soft
Hover: Darker gradient, medium shadow
```

### Secondary Button
```css
Background: White
Text: Primary-600
Border: 2px solid primary-200
Hover: Border becomes primary-400
```

---

## 📱 Components

### Cards
- **Background:** White
- **Border Radius:** 1rem (16px)
- **Padding:** 1.5rem (24px)
- **Shadow:** Soft (default), Medium (hover)
- **Transition:** Smooth 300ms

### Input Fields
- **Border Radius:** 0.5rem (8px)
- **Focus:** Ring-2 primary-600
- **Padding:** px-4 py-3

---

## 🌟 Why Early Branding Matters

### 1. **UI Consistency**
- All components use the same color palette
- Consistent spacing prevents layout chaos
- Uniform shadows create visual hierarchy

### 2. **Developer Experience**
- Pre-defined tokens speed up development
- Less decision fatigue ("What color should this be?")
- Easy to maintain and update globally

### 3. **User Experience**
- Familiar patterns build trust
- Professional appearance increases credibility
- Accessibility through consistent contrast ratios

### 4. **Scalability**
- New components follow existing patterns
- Easy to extend with new features
- Brand guidelines prevent style drift

### 5. **Future-Proofing**
- Easy to implement dark mode later
- Theme switching becomes straightforward
- Brand refreshes are centralized

---

## 📋 Quick Reference

### Common Patterns

```jsx
// Primary Button
<button className="btn-primary">Action</button>

// Card with hover effect
<div className="card-hover">Content</div>

// Text with gradient
<h1 className="text-gradient">Heading</h1>

// Section with consistent padding
<section className="section-padding">
  <div className="container mx-auto container-padding">
    Content
  </div>
</section>
```

### Color Usage

| Element | Color | Variable |
|---------|-------|----------|
| Primary buttons | Primary-600 | `primary-600` |
| Links | Primary-600 | `primary-600` |
| Success states | Accent-500 | `accent-500` |
| Cards | White | `bg-white` |
| Backgrounds | Gray | `bg-background-gray` |

---

## 🎯 Brand Values

**Reflected in Design:**
- **Trust** → Primary indigo (professional, reliable)
- **Learning** → Secondary blue (technology, growth)
- **Modern** → Soft shadows, rounded corners (approachable)
- **Excellence** → Consistent spacing, clean typography (polished)

---

## 📝 Implementation Checklist

- [x] Custom color palette in Tailwind
- [x] Google Fonts (Inter & Poppins)
- [x] Global styles with consistent spacing
- [x] Shadow system (soft, medium, strong)
- [x] Border radius scale
- [x] Favicon with graduation cap
- [x] Button component classes
- [x] Card component styles
- [x] Typography scale
- [ ] Dark mode (future)
- [ ] Logo variants (future)

---

**Last Updated:** 2024
**Version:** 1.0.0

