# Secure Sight Home Autos - website

A plain HTML/CSS/JavaScript site. No build step, no installs. Open `index.html`
in a browser to test it on your computer.

## Folder map

```
index.html                  Home page
shop.html                   All products (+ starter-kit rotator)
product.html                ONE template for every product (product.html?id=5)
about.html  contact.html
cart.html   checkout.html
categories/                 one small file per category (9 files, see GROUPS in data.js)
policies/                   shipping, refund, privacy, terms
css/
  base.css                  every page: header, footer, buttons, colours
  shop.css                  product cards, filters, carousels, kit rotator
  product.css               product page
  cart.css                  cart + checkout
  pages.css                 home hero, about, contact, policies
images/
  lighting/  sockets-plugs/ ...    product pictures (each folder has an IMAGE-NAMES.txt)
  hero/                     home page slider + tile pictures (IMAGE-NAMES.txt inside)
js/
  data.js                   YOUR CONTENT: store settings, categories, products, kits
  layout.js                 builds the header + footer on every page
  core.js                   currency, cart storage, product cards, toast
  shop.js                   shop + category pages, filters, sorting
  product.js  cart.js  home.js
```

Every page loads scripts in this order: `data.js` -> `layout.js` -> `core.js` -> its own file.

## Things you will edit (all in `js/data.js`)

1. **WhatsApp number** - `STORE.whatsapp`. Digits only with country code,
   e.g. `"2348012345678"`. Until you fill this in, WhatsApp buttons open a blank chat.
2. **Email and Instagram** - `STORE.email`, `STORE.instagram`.
3. **Delivery fee / free-delivery limit / warranty / return days** - also in `STORE`.

## Add a product

1. Open `js/data.js`, find `var P=[`.
2. Copy ONE product line (one line = one product).
3. Paste it at the end of the list. Put a comma after the previous line.
4. Change `id` to the next unused number and edit the other fields (each field is explained in the comment above the list).

It then appears automatically on the shop page, its category page, the home page,
search, filters and gets its own product page. No other file needs editing.

## Product pictures

1. Open `IMAGE-NAMES.txt` inside the product folder (`images/lighting/`, `images/sockets-plugs/` ...) - it lists the exact file name for every product in that category.
2. Save each picture in `images/lighting/` with that name (`.jpg` is best; `.webp`, `.png`, `.jpeg` also work).
3. Square, about 800 x 800 px, white background, under ~200 KB each.
4. Missing picture? The site simply shows the small product icon. Nothing breaks.

For a new product with a picture: add `img:"lighting/your-file-name"` (no extension) to its line in `data.js`.

## Sale prices and page numbers

- Add `old:24000` (the old price) to a product line and it gets a red SALE badge and a struck-through old price.
- `STORE.perPage` in `data.js` (now 16) sets products per page. Page numbers appear automatically when a category has more.
- Products marked `chk:1` are ones where the name on your screenshot was cut off and I completed it. Check them, fix the `n` name if needed, and delete `chk:1`.

## Home page slider

The big banner on the home page changes by itself every 5 seconds (arrows, dots, swipe on phones; it pauses while the mouse is on it).
- Slide 1 is the "Build Your Smart Home with Secure Sight" slide (built into `index.html`; edit its text there).
- The last slide (curtains) plays a video, `images/hero/curtains.mp4`, instead of a drawing. To change it, replace that file (keep the name, or edit `video:` in `HERO`). It plays muted from the start each time the slide appears, and that slide stays on screen for its own `delay` (11500 ms = the video length). Update `delay` if you use a longer or shorter video.
- The "Simplify your life" slide (slide 4) is a **working phone**: `js/phone.js` + `css/phone.css`. It plays by itself (four devices switch on, then off, one by one) and visitors can tap the switches or the floating devices. While someone is tapping, the slider waits on that slide until they have been idle for 10 seconds. It is switched on by `live:"phone"` on that slide in `HERO`; delete `live:"phone"` and the old drawing (`images/hero/art/simplify.svg`) comes back. Visitors who prefer reduced motion see it still, with everything switched on. To change the device names or status words, edit `DEV` at the top of `js/phone.js`.
- The "Smart home Tuya devices" slide (slide 3) is a **live product showroom**: `js/showroom.js` + `css/showroom.css`. Five real products float on the navy background. One is the big "hero" in the middle (with a glow and rings of signal); the others float around it with their name and price. Every ~2 seconds the next product glides to the middle and the card under it shows its real name and price from your product list. On a laptop, hovering a product brings it to the middle and holds it, and the whole display tilts toward the mouse; clicking or tapping any product opens its page. Choose the products in the `items` list of that slide in `HERO` (`js/data.js`): `{id:162, photo:"home/showroom/panel.webp", label:"Control panel"}`. The name, price and link come from the product with that `id`. The photos must be **cut-outs** (transparent background) so they float on the navy. Delete `live:"showroom"` to go back to the old drawing.
  - The five pictures in `images/home/showroom/` are TEMPORARY, taken from the pictures already on the site, and each is matched to the closest product in the list. Check each pairing, and replace them with your own cut-out photos before launch.
- Slides 2-5 come from the `HERO` list in `js/data.js`: edit the title, text, button link or colour there. Speed: `HERO_DELAY`.
- Each slide has a built-in drawing in `images/hero/art/` (SVG). Your own banner picture, when added, covers it.
- Banner pictures go in `images/hero/`. See `images/hero/IMAGE-NAMES.txt` for the exact file names and sizes.

## Home page below the slider

The home page is a designed page, not a product list. Its sections, top to bottom: Shop by category, why Secure Sight, three spotlight bands (locks, lighting, control panels), how it works, works-with and popular picks (4 products).
- **Category tiles:** edit `HOME_CATS` in `js/data.js` (order, size, one-line text, picture). Product counts update by themselves.
- **Popular picks:** edit `HOME_PICKS` in `js/data.js` (exact product names).
- **Text and buttons** of the other sections: edit them in `index.html`.
- **Real photos on a tile:** put the picture in `images/home/photos/` and list it in that tile's `photos:[...]` in `HOME_CATS` (every tile has one now). Tiles without photos show my drawing. A `.jpg` blends into the tile colour (for dark products on white); a transparent `.png` sits on the tile as it is (for white products, which go on the deeper-grey `t3` tiles).
- **Drawings:** tiles use `images/home/*.svg`; the locks band uses `images/hero/art/locks.svg`. Replace them with your own photos any time (keep the file name, or change it in `data.js` / `index.html`).
- **Name in the menu bar:** on the home page the big "SECURE SIGHT / Home Autos" glides into the menu bar when you scroll. On every other page it is already there. Screens narrower than 601px keep it out of the menu bar.

## Home page slide 1 (the product picture)

The "Build Your Smart Home" slide shows one picture of four products (smart lock, touch panel, 3-gang switch and smoke detector): `images/home/hero/lineup.webp`.
- To change it, replace that file with a new cut-out (transparent background, `.webp` or `.png`; if you use another name or type, change the file name in `index.html`).
- The soft shadow under the products is added by the page, so use a picture with no baked-in shadow.
- The picture is sized from the slide height, so it fits laptop screens.

## Phones (mobile)

The homepage is built phone-first below 760px wide:
- **Header:** a menu button (left), the brand (middle), search + cart (right), all at least 44px. The menu button opens a full-screen menu (built in `js/layout.js`, styled at the end of `css/base.css`) with Home, Shop all, the 9 categories, About, Contact and a WhatsApp button. This header is shared by every page.
- **WhatsApp button:** a green floating button on every page (not on checkout). It uses `STORE.whatsapp` in `js/data.js`, like all the other WhatsApp buttons: **until you put your number there it opens a blank chat.**
- **Slider:** arrows are hidden on phones (swipe works, and the dots are bigger to tap). Slide 1 puts the text first, then the 4 buttons as a 2x2, then the product picture.
- **Shop by category:** a compact 2-column grid on phones (the big tiles stay on laptops). The Access control tile now shows two real lock photos.
- **Popular picks:** two compact cards per row. "How it works" and "Works with" are tighter. The three bands under the slider get big tap buttons on phones (tapping the light switch turns all three lights on/off; "Leave mode" / "Home mode" buttons under the panel).
- **Speed:** pictures for slides and bands that are not showing yet load only when they are about to show (they carry `data-src` until then), the curtain video loads only when its slide is next, and nothing is downloaded on data-saver connections for that video. Tile photos are small WebP files (`-cut.webp` = transparent). There are no more failed picture requests on the homepage.
- Slide 1's optional banner picture is no longer looked for automatically (it caused 4 failed requests on every visit). To use one, put `data-banner="images/hero/slide-0-home"` back on an `<img class="slide-img">` in `index.html`.
- Product photos that are not uploaded yet still cause a few failed requests when you scroll to Popular picks; they stop as soon as you add the photos named in each `IMAGE-NAMES.txt`.

## The three bands under the slider (alive on scroll)

The locks band, the lighting band and the control-panel band come alive as you scroll to them: `js/spots.js` + `css/spots.css`.
When a band is about a quarter on screen, its text slides up one piece at a time, the picture rises into place and the animation starts. It pauses again when the band leaves the screen, and a very slight parallax makes the picture drift a little differently from the text while you scroll.
- **Locks**: the three real locks with lights running over the real keypad buttons (same stage as slide 2), plus a small tag above the middle lock that tells the story: "Scanning face..." -> "Face recognised" -> "Door unlocked".
- **Lighting**: the real 3-button Wi-Fi touch switch (`images/home/spots/switch.webp`) controls three pendant lights. It switches them on and off by itself; visitors can tap the three buttons or the bulbs to try it.
- **Control panels**: the real touch panel runs "Leave mode" and "Home mode" by itself. A pulse of light travels to each device and its little label changes (Locked, Off, Watching, Armed ... then Unlocked, On, Off). Visitors can tap the "Leave mode" and "Home mode" tiles on the panel.
- Each band is marked in `index.html` with `data-spot="locks"`, `"lights"` or `"panels"`. The old still pictures are still in the folders; delete a band's `data-spot` and that band goes back to its still picture.
- Visitors who prefer reduced motion see every band at once, still.
- The pictures use the temporary product photos already on the site (see the showroom note above): replace them with your own cut-out photos before launch.

## Change the menu or footer

Edit `js/layout.js` once. Every page updates.

## Add a new category page

1. Add an entry to `GROUPS` in `data.js` (new `slug`, `name`, `subs`).
2. Copy `categories/lighting.html` to `categories/<your-slug>.html`.
3. In the new file, change the `<title>`, and change `data-group="lighting"` to your slug.
4. Give the new `GROUPS` entry an `icon` (the inside of a 24x24 outline SVG). The header Shop menu and the footer update by themselves.

## Put it online on Cloudflare Pages

1. Unzip the folder.
2. Cloudflare dashboard -> **Workers & Pages** -> **Create** -> **Pages** -> **Upload assets**.
3. Name the project, click **Create**, drag the whole unzipped `secure-sight` folder in (the folder that contains `index.html`), click **Deploy**.
4. To update later: open the project -> **Create deployment** -> upload the folder again.
5. Custom domain: project -> **Custom domains** -> **Set up a domain**.

Cloudflare removes `.html` from addresses automatically (`/shop.html` becomes `/shop`).
All links in this site are relative, so they keep working either way.

## How the cart works

The cart and wishlist are saved in the visitor's own browser
(localStorage), so they follow the visitor from page to page. Checkout takes
no payment: it builds a WhatsApp message containing the order and customer details.
