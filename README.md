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
Just add a `data-z` attribute to a text element in the identity Additional Attributes panel. Even thought this already does the trick you would probably use some CSS to style the additional copies made by zTextify. A quick way would be to style the added layers a little darker by adding the following style-block to your Head HTML:

```html
<style>
	.z-layer:not(:first-child) {
		filter: brightness(0.7);
	}
</style>
```

### Further information can be found here:
https://bennettfeely.com/ztext/

You're done installing and enabling Hype zText

### What is different in this fork?

You can read all about the options on the [ztext.js](https://bennettfeely.com/ztext/) documentation and this fork should work accordingly. Specially the `dataset` attributes are the same. When it comes to the JavaScript side of things you have some differences and additions. In this fork`ZTextify` is `hypeDocument.zTextify` and `zDraw` is referenced as `hypeDocument.zDraw` . These commands have been moved to the Hype document scope to limit refresh and callback handling. Also, there is an option in `hypeDocument.zDraw` to purge the innerHTML cache introduced in this fork called `purgeCache` and if set to `true` it will refetch innerHTML to redraw the 3D text. This requires you to generated and define the innerHTML just before purging it. If you only want to set a new text string or avoid potential recursions when setting new content, there is an even simpler option in this fork. Just set a key called`innerHTML` in the options to whatever you want it to be when using `zDraw` to redraw.


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