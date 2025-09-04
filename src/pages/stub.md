---
layout: ../layouts/About.astro
title: Markdown Test
---

# My Comprehensive Markdown Guide

## Introduction

Welcome to my complete guide on Markdown syntax! This post will walk you through all the essential Markdown features you'll need for effective documentation, blogging, and content creation.

## Basic Text Formatting

Markdown makes it easy to format your text with simple syntax:

**Bold text** is created with double asterisks or **double underscores**

_Italic text_ uses single asterisks or _single underscores_

**_Bold and italic_** combines both with triple asterisks

~~Strikethrough~~ text uses double tildes

## Headings

Markdown offers six levels of headings:

# Heading 1

## Heading 2

### Heading 3

#### Heading 4

##### Heading 5

###### Heading 6

## Lists

### Unordered Lists

- Item 1
- Item 2
  - Nested item 2.1
  - Nested item 2.2
- Item 3

### Ordered Lists

1. First item
2. Second item
   1. Nested item 2.1
   2. Nested item 2.2
3. Third item

### Task Lists

- [x] Completed task
- [ ] Incomplete task
- [ ] Another task to do

## Links and Images

[Visit my website](https://example.com)

[Jump to heading](#headings)

![Alt text for an image](https://example.com/image.jpg 'Optional title')

## Blockquotes

> This is a blockquote.
>
> It can span multiple lines.
>
> > And can be nested.

## Code

Inline code uses backticks: `const greeting = "Hello World";`

### Code Blocks

```javascript
function sayHello() {
  const greeting = 'Hello, world!'
  console.log(greeting)
  return greeting
}
```

```diff
function calculateTotal(items) {
-  const total = items.reduce((sum, item) => sum + item.price, 0);
+  const total = items.reduce((sum, item) => {
+    return sum + (item.price * (item.quantity || 1));
+  }, 0);
  return total;
}
```

## Tables

| Name     | Type    | Default | Description         |
| -------- | ------- | ------- | ------------------- |
| id       | integer | -       | Unique identifier   |
| username | string  | -       | User's display name |
| isActive | boolean | true    | Account status      |

## Horizontal Rules

Three or more hyphens, asterisks, or underscores:

---

## Footnotes

Here's a sentence with a footnote[^1].

[^1]: This is the footnote content.

## Mathematical Expressions

Inline math: \( E = mc^2 \)

Display math:

$$
\frac{d}{dx}(e^x) = e^x
$$

## Diagrams (where supported)

```mermaid
graph TD;
    A-->B;
    A-->C;
    B-->D;
    C-->D;
```

## Collapsible Sections

<details>
<summary>Click to expand</summary>

This content is hidden by default but can be expanded by clicking.

</details>

## Conclusion

This covers most Markdown features you'll need for creating rich, well-formatted content. Remember that support for some advanced features may vary depending on the platform you're using.

Happy writing!
