# AnnMarie — Shopify theme

A custom Shopify (Online Store 2.0) theme built from the Figma file **AnnMarie-Site → page "site"**.
Pages: Home, Shop (collection), Wine page (product), Household (story), Gifting (corporate gifting form), plus cart, search and 404.

## Why wines now show up as individual products

Shopify's Figma import treats a picture of five bottles as one image. In this theme, the bottles are not pictures in the layout. They are **your Shopify products**:

| Design element | Comes from |
| --- | --- |
| Shop grid cards (name, price, photo, "Bottle, 6 pack") | Each product in the collection, one card per wine |
| Big bottles at the top of Shop | "Featured wines" section: pick a product per slide |
| Wine page photos, price, size tabs, add to basket | The product's media and variants |
| Tasting notes, vintage, soil, alc, pH, TA, quote | Product metafields (see below) |

Placeholders in the design ("$XX", "Xx Items") are filled in with real data automatically.

## Connect this repo to Shopify

1. Push this repo to GitHub.
2. In Shopify admin, go to **Online Store → Themes → Add theme → Connect from GitHub**, then pick this repo and the `main` branch.
3. Click **Customize** to edit the content. Every section's text and images can be changed there.

To preview locally while you code, install Shopify CLI (`npm i -g @shopify/cli`) and run:

```
shopify theme dev --store your-store.myshopify.com
```

## Set up your store so it matches the design

**Menus** (Online Store → Navigation)
- `main-menu`: Shop → /collections/all, Household → /pages/household, Gifting → /pages/gifting
- `footer`: About Us, Shop All, Order Tracking, Corporate Gifting, Contact Us
- `socials`: Instagram, Facebook, TikTok, Spotify
- `legal`: Privacy, Terms of Service, Shipping Policy

**Pages** (Online Store → Pages)
- "Household" → template `page.household`
- "Gifting" → template `page.gifting`. Requests from the form are emailed to your store's sender email.

**Products / variants**
- Option 1 **Size**: `750mL`, `1.5L`. These show as tabs next to the wine name.
- Option 2 **Format**: `Bottle`, `6 pack`. Each one gets its own price and "Add to basket" box.
- Option names can be changed in Customize → Product page.

**Product metafields** (Settings → Custom data → Products, namespace `custom`, single-line text)

| Key | Example |
| --- | --- |
| `tasting_notes` | APRICOT · SEA SALT · GRAPEFRUIT ZEST |
| `vintage` | 2023 |
| `soil` | Zamora & Huichica Loam |
| `alcohol` | 12.5% |
| `ph` | 3.43 |
| `ta` | 6.1 g/L |
| `quote` | Made for long afternoons, silk shirts, and unhurried plans |

**Filters on the Shop page**: install the free **Shopify Search & Discovery** app and add filters (e.g. availability, price, product type).

## Fonts

The design uses **OT Jubilee (Diamond)** for headings and **Neue Haas Grotesk Display Pro** for body text. Both are paid fonts, so they're not included. Until you add them, the theme uses Cormorant Garamond and Helvetica Neue, which look similar.

To use the real fonts once you have a web licence:
1. Upload `OTJubilee-Diamond.woff2`, `NeueHaasDisplay-Light.woff2` and `NeueHaasDisplay-Roman.woff2` in **Content → Files**.
2. In **Customize → Theme settings → Typography**, tick **Use licensed brand fonts**.

## Structure

```
layout/theme.liquid        page shell
sections/                  header, footer, home-hero, home-tiles, featured-wines,
                           main-collection, image-banner, main-product, story-intro,
                           photo-trio, founder-note, gifting-hero, gifting-intro, gift-form, …
snippets/                  product-card, logo-mark, icon-basket, fonts, meta-tags
templates/*.json           which sections each page uses
assets/                    base.css, theme.js, images/SVGs exported from Figma
config/, locales/          theme settings and text strings
```
