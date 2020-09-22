# zText.js (Hype Edition)

![Hype-zText|690x487](https://playground.maxziebell.de/Hype/zText/zTextHypeEdition_2.jpg)

<sup>The cover artwork is not hosted in this repository and &copy;opyrighted by Max Ziebell</sup>

## How it works
> Ztext gives the illusion of volume by creating layers from an HTML element. There's no need to spend hours fiddling with <canvas> or forcing users to download multi-megabyte WebGL libraries. With ztext, content remains fully selectable and accessible.
> Over 96% of users use a web browser that supports the CSS transform-style property, which ztext needs to work. In unsupported browsers, ztext gracefully turns off.

<sup>Introduction from https://bennettfeely.com/ztext/</sup>


## Getting started guide

### Install Hype zText

This step is effortless if you use the CDN version mentioned at the end of this document. Just copy and paste the following line into your Head HTML:

```html
<script src="https://cdn.jsdelivr.net/gh/worldoptimizer/HypezText/zTextHypeEdition.min.js"></script>
```

### Enable Hype zText
Just add a `data-z` attribute to a text element in the identity Additional Attributes panel.

### Further information can be found here:
https://bennettfeely.com/ztext/


You're done installing and enabling Hype zText


---

**Version-History:**  
`1.0	Initial release under MIT `  
`1.1	Fixed event garbage collection `  
`1.2	Fixed redraws with zDraw `  

---

Latest version can be linked into your project using the following in the head section of your project:

```html
<script src="https://cdn.jsdelivr.net/gh/worldoptimizer/HypezText/zTextHypeEdition.min.js"></script>
```

Optionally you can also link a SRI version or specific releases. 
Read more about that on the JsDelivr (CDN) page for this extension at https://www.jsdelivr.com/package/gh/worldoptimizer/HypezText
Learn how to use the latest extension version and how to combine extensions into one file at
https://github.com/worldoptimizer/HypeCookBook/wiki/Including-external-files-and-Hype-extensions