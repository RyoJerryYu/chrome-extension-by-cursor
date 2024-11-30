# Chrome Extension with React - Project Guide

This document explains the project structure and the purpose of each file in this Chrome extension.

## Project Overview

This is a Chrome extension built with React and TypeScript. It creates a popup interface with a textarea for user input and sends the input to an API endpoint.

## File Structure

### Configuration Files

#### package.json
The npm/pnpm package configuration file:
- Defines project metadata and scripts (`build` and `dev`)
- Lists dependencies (React, TypeScript)
- Lists development dependencies (Webpack, Babel)

#### tsconfig.json
TypeScript configuration that:
- Sets ES5 as compilation target
- Enables React JSX support
- Configures strict type checking
- Sets up module resolution

#### .babelrc
Babel configuration that:
- Configures React and TypeScript presets
- Enables modern JavaScript features

#### webpack.config.js
Webpack bundler configuration:
- Sets entry point as `src/popup/index.tsx`
- Configures TypeScript/React compilation
- Sets up HTML template processing
- Copies manifest to build directory

#### .gitignore
Git ignore patterns for:
- Dependencies (node_modules)
- Build outputs (dist)
- IDE files
- Environment files
- Debug logs

### Extension Files

#### src/manifest.json
Chrome extension manifest (v3): 