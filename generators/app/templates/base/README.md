# Congratulations!

You have successfully scaffolded a new Firefox extension called **`{{name}}`** using **[Yeoman](https://yeoman.io/)** and **generator-firefox**!

## What's in here?

The directory structure of your new extension is as follows:

```text
.
├── .vscode
│   └── settings.json
├── icons
│   ├── 16.png
│   ├── 48.png
│   └── 128.png
├── .gitignore
├── extension.js
├── manifest.json
├── package.json
└── README.md (this file)
```

In the `manifest.json` file, you can change the name, description, version, and other metadata of your extension. You can also add permissions, content scripts, and other features to your extension.

For more information on how to develop Firefox extensions, please refer to the **[official documentation](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions)**.

Your extension code is located in the `extension.js` file. You can start writing your extension code in this file.

The `icons` directory contains icons for your extension. Right now, they're just placeholders. You can replace them with your own icons, if you wish.

You can safely ignore the `package.json`, it just contains the `web-ext` development dependency, which is used to package your extension into a `.zip` file.

## Testing your extension

### Using `web-ext` (recommended)

This method requires you have **[Node.js](https://nodejs.org/)** installed on your system, I recommend using the latest LTS version.

Now, with that out of the way, let's get into how to test your extension.

1. Open a terminal and navigate to the directory where you have scaffolded your extension.
2. Make sure you have all the development dependencies installed by running `npm install`.
3. Run `npm start` to start the development server.
4. A new Firefox window will open with your extension loaded in it. You can make changes to your extension code and the changes will be automatically reloaded in the Firefox window.

And there you go, you're all set up!

> **But I'm not using the stable version of Firefox!**
>
> No worries, there are other ways to start it up with a different version of Firefox.
>
> Here are all the `start` scripts available to you:
>
> - `npm start` - starts the development server with the stable version of Firefox.
> - `npm run start:beta` - starts the development server with the beta version of Firefox.
> - `npm run start:nightly` - starts the development server with the nightly version of Firefox.
> - `npm run start:developeredition` - starts the development server with the developer edition of Firefox.

### Manually (for advanced users)

**Fair warning, this is an advanced method. If you don't know what you're doing, I recommend using `web-ext`.**

To test your extension, you can load it as a temporary add-on in Firefox. Follow these steps to do so:

1. Open Firefox and navigate to `about:debugging`.
2. Click on `This Firefox` in the left sidebar.
3. Click on the `Load Temporary Add-on...` button.
4. Navigate to the directory where you have scaffolded your extension and select the `manifest.json` file.

Your extension will now be loaded in Firefox. You can click on the `Inspect` button to open the developer tools for your extension.

## Packaging your extension

### Using `web-ext` (recommended)

This method requires you have **[Node.js](https://nodejs.org/)** installed on your system, I recommend using the latest LTS version.

Now, with that out of the way, let's get into how to package your extension.

1. Open a terminal and navigate to the directory where you have scaffolded your extension.
2. Run `npm run package` to package your extension into a `.zip` file. The `.zip` file will be located in the `web-ext-artifacts` directory.

### Manually

This method is not super recommended, but it's here if you want to use it.

Follow the steps listed on this **[MDN page](https://extensionworkshop.com/documentation/publish/package-your-extension/)** to package your extension into a `.zip` file manually.

---

I'm sure you're dying to get started, so go!

Make your wildest extension dreams come true!

**Have fun! 🎉**
