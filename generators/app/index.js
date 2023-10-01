"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const { execSync } = require("child_process");

module.exports = class extends Generator {
  prompting() {
    this.log(yosay(chalk.green(`Let's create a Firefox add-on!`)));
    this.log(chalk.cyan("This generator will try to guess sensible defaults."));

    /**
     * @type {import('yeoman-generator').Question[]}
     */
    const prompts = [
      {
        type: "input",
        name: "name",
        message: "What is the name of your add-on? (any case)",
        default: "My Extension",
        validate: input => {
          if (!input) {
            return "Please enter a name for your add-on.";
          }

          return true;
        }
      },
      {
        type: "input",
        name: "id",
        message: "What is the ID of your add-on?",
        default: `myextension@example.com`.toLowerCase(),
        validate: input => {
          if (!input)
            return "For safety, we require an ID for your add-on. Please enter one.";

          if (
            !input.match(
              /^\{[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\}$/i
            ) &&
            !input.match(/^[a-z0-9-._]*@[a-z0-9-._]+$/i)
          )
            return "Your add-on ID is invalid. Please use a UUID (e.g. {11111111-2222-3333-4444-555555555555}) or an email address (e.g. myextension@example.com)";

          return true;
        }
      },
      {
        type: "input",
        name: "version",
        message: "What is the version of your add-on?",
        default: "1.0.0",
        validate: input => {
          if (!input) return "Please enter a version for your add-on.";

          if (!input.match(/^\d+\.\d+\.\d+$/))
            return "Please use a version number in the format `X.X.X`.";

          return true;
        }
      },
      {
        type: "input",
        name: "description",
        message: "What is the description of your add-on?",
        default: "My Firefox add-on"
      },
      {
        type: "input",
        name: "matches",
        message:
          "What URL pattern(s) does this add-on apply to? (comma-separated)",
        default: "*://*.mozilla.org/*",
        /**
         * @param {String} input
         */
        validate: input => {
          if (!input) return "Please enter at least one URL pattern.";

          var matches = input.split(",");

          for (const match of matches) {
            if (
              match !== "<all_urls>" &&
              !match.match(
                /^(https?|wss?|file|ftp|\*):\/\/(\*|\*\.[^*/]+|[^*/]+)\/.*$/
              ) &&
              !match.match(/^file:\/\/\/.*$/) &&
              !match.match(/^resource:\/\/(\*|\*\.[^*/]+|[^*/]+)\/.*$|^about:/)
            )
              return "One or more of your URL patterns is invalid. Please make sure they follow this pattern:\n/^(https?|wss?|file|ftp|*)://(*|*.[^*/]+|[^*/]+)/.*$/\nOR\n/^file:///.*$/\nOR\n/^resource://(*|*.[^*/]+|[^*/]+)/.*$|^about:/\nOR\n<all_urls>";
          }

          return true;
        }
      },
      {
        type: "confirm",
        name: "initialize_git_repo",
        message: "Should I initialize a Git repository for you?",
        default: true
      },
      {
        type: "checkbox",
        name: "features",
        message: "What other features would you like to include?",
        choices: [
          {
            name: "Popup",
            value: "popup"
          },
          {
            name: "Prettier",
            value: "prettier"
          }
        ]
      },
      {
        type: "list",
        name: "stylesheet",
        message: "What stylesheet language would you like to use?",
        choices: [
          {
            name: "CSS",
            value: "css"
          },
          {
            name: "Sass",
            value: "sass"
          },
          {
            name: "Less",
            value: "less"
          },
          {
            type: "separator"
          },
          {
            name: "None",
            value: "none"
          }
        ],
        when: answers => {
          return answers.features.includes("popup");
        },
        default: "css"
      },
      {
        type: "confirm",
        name: "include_script_in_popup",
        message: "Should I include a script in your popup?",
        when: answers => {
          return answers.features.includes("popup");
        },
        default: true
      },
      {
        type: "list",
        name: "package_manager",
        message:
          "Which package manager would you like to use to install Prettier?",
        choices: [
          {
            name: "npm",
            value: "npm"
          },
          {
            name: "yarn",
            value: "yarn"
          },
          {
            name: "pnpm",
            value: "pnpm"
          },
          {
            name: "Custom",
            value: "custom"
          }
        ],
        when: answers => {
          return answers.features.includes("prettier");
        },
        default: "npm"
      }
    ];

    return this.prompt(prompts).then(props => {
      this.props = props;
      this.namePlaceholder = /{{name}}/g;

      if (this.props.name.includes(" ") || this.props.name.match(/^[A-Z]/))
        this.log(
          chalk.yellow(
            `\n   ⚠️  Your add-on will be created in "${this.props.name
              .replace(/ /g, "-")
              .toLowerCase()}", the manifest will use "${
              this.props.name
            }" as the name.`
          )
        );
      this.path = this.props.name.replace(/ /g, "-").toLowerCase();
    });
  }

  writing() {
    this.fs.copy(this.templatePath("base"), this.destinationPath(this.path));
    this.fs.copy(
      this.templatePath("base", ".vscode"),
      this.destinationPath(this.path, ".vscode")
    );
    this.fs.copy(
      this.templatePath("base", ".gitignore"),
      this.destinationPath(this.path, ".gitignore")
    );

    // Copy popup files
    if (this.props.features.includes("popup")) {
      this.fs.copy(
        this.templatePath("popup", "manifest.json"),
        this.destinationPath(this.path, "manifest.json")
      );

      this.fs.copy(
        this.templatePath("popup", "popup.html"),
        this.destinationPath(this.path, "popup", "popup.html")
      );

      this.fs.copy(
        this.templatePath("popup", "README.md"),
        this.destinationPath(this.path, "README.md")
      );

      switch (this.props.stylesheet) {
        case "css":
          this.fs.copy(
            this.templatePath("extras", "css"),
            this.destinationPath(this.path, "popup", "css")
          );
          break;
        case "sass":
          this.fs.copy(
            this.templatePath("extras", "sass"),
            this.destinationPath(this.path, "popup", "sass")
          );
          break;
        case "less":
          this.fs.copy(
            this.templatePath("extras", "less"),
            this.destinationPath(this.path, "popup", "less")
          );
          break;
        default:
          this.log(
            chalk.yellow(
              "   ⚠️  You have selected to have no stylesheet, the link to the stylesheet will be removed from popup.html."
            )
          );

          // eslint-disable-next-line no-case-declarations
          let popup = this.fs.read(
            this.destinationPath(this.path, "popup", "popup.html")
          );
          popup = popup.replace(
            '\n    <link rel="stylesheet" href="css/style.css">',
            ""
          );
          this.fs.write(
            this.destinationPath(this.path, "popup", "popup.html"),
            popup
          );

          break;
      }
    }

    // eslint-disable-next-line no-negated-condition
    if (!this.props.include_script_in_popup) {
      this.log(
        chalk.yellow(
          "   ⚠️  You have selected to not include a script in your popup, the script tag will be removed from popup.html."
        )
      );

      let popup = this.fs.read(
        this.destinationPath(this.path, "popup", "popup.html")
      );
      popup = popup.replace('\n    <script src="js/script.js"></script>', "");
      this.fs.write(
        this.destinationPath(this.path, "popup", "popup.html"),
        popup
      );
    } else {
      this.fs.copy(
        this.templatePath("extras", "js"),
        this.destinationPath(this.path, "popup", "js")
      );
    }

    // Replace placeholders in manifest.json
    const matches = this.props.matches.split(",");

    let manifest = this.fs.readJSON(
      this.destinationPath(this.path, "manifest.json")
    );

    manifest.name = this.props.name;
    manifest.description = this.props.description;
    manifest.browser_specific_settings.gecko.id = this.props.id;
    manifest.content_scripts[0].matches = matches;
    manifest.version = this.props.version;

    if (this.props.features.includes("popup"))
      // eslint-disable-next-line camelcase
      manifest.browser_action.default_title = this.props.name;

    this.fs.writeJSON(
      this.destinationPath(this.path, "manifest.json"),
      manifest
    );

    // Replace {{name}} in extension.js
    let extension = this.fs.read(
      this.destinationPath(this.path, "extension.js")
    );
    extension = extension.replace(this.namePlaceholder, this.props.name);
    this.fs.write(this.destinationPath(this.path, "extension.js"), extension);

    // Replace placeholders in package.json
    let packageJson = this.fs.readJSON(
      this.destinationPath(this.path, "package.json")
    );

    packageJson.name = this.path;
    packageJson.description = this.props.description;
    packageJson.version = this.props.version;

    this.fs.writeJSON(
      this.destinationPath(this.path, "package.json"),
      packageJson
    );

    // Replace placeholders in README.md
    let readme = this.fs.read(this.destinationPath(this.path, "README.md"));

    readme = readme.replace(this.namePlaceholder, this.props.name);

    this.fs.write(this.destinationPath(this.path, "README.md"), readme);

    // Replace placeholders in popup.html
    if (this.props.features.includes("popup")) {
      let popup = this.fs.read(
        this.destinationPath(this.path, "popup", "popup.html")
      );

      popup = popup.replace(this.namePlaceholder, this.props.name);

      this.fs.write(
        this.destinationPath(this.path, "popup", "popup.html"),
        popup
      );
    }

    if (this.props.features.includes("prettier")) {
      switch (this.props.package_manager) {
        case "npm":
          execSync(`cd ${this.path} && npm install --save-dev prettier`);
          break;
        case "yarn":
          execSync(`cd ${this.path} && yarn add -D prettier`);
          break;
        case "pnpm":
          execSync(`cd ${this.path} && pnpm install -D prettier`);
          break;
        default:
          this.log(
            chalk.yellow(
              "   ⚠️  Since you chose custom, you'll have to install Prettier yourself."
            )
          );
          break;
      }

      this.fs.copy(
        this.templatePath("features", "prettier", ".prettierrc"),
        this.destinationPath(this.path, ".prettierrc")
      );

      if (this.props.package_manager !== "custom")
        this.log(chalk.green("   ✅  Prettier installed!"));
    }
  }

  end() {
    if (this.props.features.initialize_git_repo) {
      execSync(`cd ${this.path} && git init`);
      this.log(chalk.green("   ✅  Git initialized!"));
    }

    this.log("\n---\n");
    this.log(chalk.green("Your add-on is ready!"));
    this.log(chalk.green("To get started, run:"));
    this.log(chalk.cyan(`  \`cd ${this.path}\``));
    this.log(
      chalk.cyan("  `npm install` ") +
        chalk.gray("(or yarn install or pnpm install)")
    );
    this.log(
      chalk.cyan("  `npm start` ") +
        chalk.gray(
          "(or yarn start or pnpm start, depending on what you used to install dependencies)"
        )
    );
    this.log("\n---");
    this.log(
      chalk.cyan(
        "\nRefer to the README.md in your new add-on for more information."
      )
    );
  }
};
