// This is your extension's main piece of code.
// Feel free to change it as you see fit.
// You can also change the name of the file itself,
// however you'll have to update the manifest.json accordingly.
try {
    console.log("{{name}} initialized!");

    // Listen for button presses
    browser.browserAction.onClicked.addListener(() => {
        console.log("Button pressed!");
    });
} catch (error) {
    console.error("An error occurred: ", error);
}
