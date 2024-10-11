# BitHive

BitHive is a cross-platform desktop application built with Tauri, Next.js, and React. It combines the power of a Rust backend with a modern React frontend to deliver a fast and efficient developer tool.

## Features

- Cross-platform support (macOS, Windows, Linux)
- Built with Tauri for a lightweight and secure desktop application
- Modern web technologies (Next.js, React) for the frontend
- Tailwind CSS and DaisyUI for styling
- React Query for efficient data fetching and state management
- Recharts for data visualization

## Screenshots

![BitHive Screenshot](./images/Bithive_screenshot.png)

### Development Info

This is a [Tauri](https://tauri.app/) project template using [Next.js](https://nextjs.org/),
bootstrapped by combining [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) and [`create tauri-app`](https://tauri.app/v1/guides/getting-started/setup).

- TypeScript frontend using Next.js React framework
- [TailwindCSS](https://tailwindcss.com/) as a utility-first atomic CSS framework
  - The example page in this template app has been updated to use only TailwindCSS
  - While not included by default, consider using
    [React Aria components](https://react-spectrum.adobe.com/react-aria/index.html)
    and/or [HeadlessUI components](https://headlessui.com/) for completely unstyled and
    fully accessible UI components, which integrate nicely with TailwindCSS
- Opinionated formatting and linting already setup and enabled
  - [ESLint](https://eslint.org/) for pure React + TypeScript linting, and
    [Biome](https://biomejs.dev/) for a combination of fast formatting, linting, and
    import sorting of JavaScript and TypeScript code
  - [clippy](https://github.com/rust-lang/rust-clippy) and
    [rustfmt](https://github.com/rust-lang/rustfmt) for Rust code
- GitHub Actions to check code formatting and linting for both TypeScript and Rust
- pnpm as the package manager
