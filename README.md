## 🎨 Matercolor
**A Figma Plugin** that generates Material Color Palettes for any Color based on the latest Material Color System Guidelines.

### 👐 &nbsp;Contributing Checklist
- [x] Before planning to contribute, create a ✨ **new Issue** ✨ so that we can discuss and improve on your proposed changes.
- [x] Fork and clone this repository using `git clone https://github.com/arvindcheenu/figma-matercolor.git`
- [x] Go to this directory using `cd figma-matercolor`
- [x] Run `yarn` to install dependencies.
- [x] Run `yarn build:watch` to start webpack in watch mode.
- [x] Open <kbd>Figma</kbd> → <kbd>Plugins</kbd> → <kbd>Development</kbd> → <kbd>New Plugin...</kbd> and choose `manifest.json` file from this repo.
- [x] To change the UI of your plugin (the react code), start editing [App.tsx](./src/app/components/App.tsx).  
- [x] To interact with the Figma API edit [controller.ts](./src/plugin/controller.ts).  
- [x] For plugin development-related information, checkout [Figma API Overview](https://www.figma.com/plugin-docs/api/api-overview/).
- [x] As you make changes, create a **Draft Pull Request** referencing your issue using `#[issue-number]` and Happy Commiting!
- [x] Happy with how your code works? Finalise your changes and open up your Pull Request for **Review**.
- [x] After a few tantalizing review sessions, ✨ **have a cup of ☕ and watch as your code gets merged!** ✨

### 🧰 &nbsp;Toolings
* React + Webpack
* TypeScript
* Prettier precommit hook

### 🔮 &nbsp;Roadmap to the Future
- [ ] Generate Material Surface Colours
- [ ] Generate Color Schemes from Images
- [ ] Generate an entire Design System from Scratch
