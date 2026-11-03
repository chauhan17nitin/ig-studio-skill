# Instagram specs

Last checked: 2026-11-02, against `ig-reel`, `ig-carousel` and `ig-caption`. Instagram changes these, so check its current guidance if something looks wrong.

| Container | Size | Files | Safe area |
|---|---|---|---|
| Reel | 1080x1920 | One MP4, H.264 and AAC | Nothing above y=230 or below y=1440, and keep the right 230px clear |
| Carousel | 1080x1350 | Up to 20 PNGs or JPEGs | Keep cover text clear of the outer 120px, and important content 160px from the top |
| Single image | 1080x1350 | One PNG or JPEG | Same as carousel |

## Captions

- 2,200 characters at most. Only about the first 125 show before "... more".
- Up to 5 specific hashtags. If you can't check whether a tag is restricted, use fewer or none.
- Links in captions aren't clickable, so point to the bio.
