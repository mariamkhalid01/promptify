# Contributing to Promptify

We love your input! We want to make contributing to Promptify as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Adding new professional prompt presets in `prompts.json`

## Our Development Process

1.  **Fork** the repository and create your branch from `main`.
2.  If you've added code that should be tested, add tests!
3.  If you've changed APIs, update the documentation.
4.  Ensure the extension still loads correctly in **Chrome Developer Mode**.
5.  Issue a **Pull Request**.

## Adding New Prompts

The easiest way to contribute is by adding new, high-quality prompt templates to `prompts.json`.
Please ensure your templates follow the existing format:
- `id`: unique lowercase string
- `label`: descriptive name with an emoji
- `description`: short explanation of the role
- `template`: the system prompt itself, ending with `\n\n`

## Bug Reports

A great bug report includes:
- A quick summary and/or diff
- Steps to reproduce
- What you expected would happen
- What actually happened

## License

By contributing, you agree that your contributions will be licensed under its **MIT License**.
