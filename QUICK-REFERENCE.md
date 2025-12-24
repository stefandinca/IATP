# IATP Quick Reference Card

## Common Color Replacements

```html
<!-- OLD -->
class="bg-gradient-to-r from-[#0079c2] to-[#337ab7]"
class="text-[#0079c2]"
class="hover:text-[#0079c2]"
class="border-[#0079c2]"

<!-- NEW -->
class="bg-gradient-to-r from-iatp-primary to-iatp-secondary"
class="text-iatp-primary"
class="hover:text-iatp-primary"
class="border-iatp-primary"
```

## Animation Patterns

### Hero Section
```html
<div class="animate-fade-in-up">
    <h1>Your Title</h1>
</div>
```

### Cards
```html
<div class="service-card hover:animate-scale-in transition-all duration-300">
    Card Content
</div>
```

### Images
```html
<div class="image-hover-zoom rounded-3xl overflow-hidden">
    <img src="image.jpg" alt="Description">
</div>
```

### Buttons
```html
<button class="magnetic-btn bg-gradient-to-r from-iatp-primary to-iatp-secondary
               hover:shadow-xl transition-all duration-300">
    Click Me
</button>
```

## Sample Before & After

### Before:
```html
<!DOCTYPE html>
<html>
<head>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="css/styles.css">
</head>
<body>
    <div class="bg-gradient-to-r from-[#0079c2] to-[#337ab7]">
        <h1>IATP</h1>
    </div>

    <script>
        // Mobile menu code
        const btn = document.getElementById('menu-btn');
        btn.addEventListener('click', () => {
            // ...
        });
    </script>
</body>
</html>
```

### After:
```html
<!DOCTYPE html>
<html>
<head>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="tailwind.config.js"></script>
    <link rel="stylesheet" href="css/styles.css">
</head>
<body>
    <div class="bg-gradient-to-r from-iatp-primary to-iatp-secondary animate-fade-in">
        <h1 class="animate-fade-in-up">IATP</h1>
    </div>

    <script src="js/main.js"></script>
</body>
</html>
```

## Unsplash Image URLs (Copy & Paste Ready)

### Aviation/Aircraft
```
https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1600
https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=1200
https://images.unsplash.com/photo-1472289065668-ce650ac443d2?w=1600
https://images.unsplash.com/photo-1583911860205-72f8ac8ddcbe?w=1600
```

### Technology/Business
```
https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200
https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1200
```

### Team/Collaboration
```
https://images.unsplash.com/photo-1529390079861-591de354faf5?w=1200
https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1200
```

## Common Animation Classes

| Class | Effect | Use Case |
|-------|--------|----------|
| `animate-fade-in` | Fade in | General elements |
| `animate-fade-in-up` | Fade + slide up | Hero content |
| `animate-scale-in` | Scale + fade | Cards, modals |
| `animate-bounce-subtle` | Gentle bounce | Call-to-actions |
| `animate-pulse-slow` | Slow pulse | Status indicators |
| `reveal-up` | Scroll reveal | Sections |
| `stagger-item` | Staggered reveal | Lists |

## JavaScript Events (Auto-handled by main.js)

✅ Mobile menu toggle
✅ Dropdown menus
✅ Tab switching
✅ FAQ accordion
✅ Smooth scrolling
✅ Countdown timer
✅ Counter animations
✅ Scroll reveals
✅ Image lazy loading

**No inline JavaScript needed!**

## Adding a New Section Template

```html
<!-- Animated Section with Image -->
<section class="py-20 bg-gradient-to-b from-white to-gray-50 relative">
    <!-- Background Image (optional) -->
    <div class="absolute inset-0 opacity-5">
        <img src="https://images.unsplash.com/photo-[ID]?w=1600"
             alt="" class="w-full h-full object-cover">
    </div>

    <!-- Content -->
    <div class="max-w-7xl mx-auto px-6 relative z-10">
        <div class="text-center mb-16 reveal-up">
            <h2 class="text-5xl font-black text-gray-900 mb-6">
                Your <span class="text-gradient">Title</span>
            </h2>
            <p class="text-xl text-gray-600 max-w-3xl mx-auto">
                Your description
            </p>
        </div>

        <!-- Cards -->
        <div class="grid md:grid-cols-3 gap-8">
            <div class="service-card p-8 bg-white rounded-3xl shadow-lg
                        hover:shadow-xl transition-all stagger-item">
                <div class="w-16 h-16 bg-gradient-to-br from-iatp-primary
                            to-iatp-secondary rounded-2xl flex items-center
                            justify-center mb-6">
                    <i class="fas fa-icon text-white text-2xl"></i>
                </div>
                <h3 class="text-2xl font-bold text-gray-900 mb-4">Title</h3>
                <p class="text-gray-600">Description</p>
            </div>
            <!-- Repeat for more cards -->
        </div>
    </div>
</section>
```

## CSS Custom Properties (Available)

```css
--primary-blue: #0079c2;
--secondary-blue: #337ab7;
--transition-smooth: cubic-bezier(0.34, 1.56, 0.64, 1);
--transition-smooth-in: cubic-bezier(0.16, 1, 0.3, 1);
```

Use with: `transition: all 0.3s var(--transition-smooth);`

## Debugging

### Console Output
On page load, you should see:
```
IATP Website initialized successfully
```

### Common Issues
1. **Animations not working**: Check if `main.js` is loaded
2. **Colors not showing**: Verify `tailwind.config.js` is included
3. **Tabs not switching**: Check console for errors
4. **Images not loading**: Verify Unsplash URLs

## Font Classes

```html
<!-- Headings (Space Grotesk) -->
<h1 class="font-heading">Heading</h1>

<!-- Body (Inter) -->
<p class="font-body">Body text</p>
```

## Transition Utilities

```html
<!-- Smooth hover -->
<div class="transition-smooth hover:scale-105">

<!-- Smooth entrance -->
<div class="transition-smooth-in">
```

---

**Need Help?** Check `IMPLEMENTATION-GUIDE.md` for detailed instructions.
