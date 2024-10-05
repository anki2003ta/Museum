# Contributing to Museum

Thank you for considering contributing to **Museum**! 🎨 Your contributions help make this project better. Whether you want to report a bug, request a feature, or submit code changes, we welcome all kinds of contributions.

---

## How to Contribute

### 1. Reporting Bugs 🐛
- **Search for existing issues**: Before creating a new bug report, check if the issue has already been reported.
- **Create a detailed issue**: If you find a new bug, open an [issue](https://github.com/rishyym0927/Museum/issues) and describe the bug in detail, including steps to reproduce and any screenshots, if possible.

### 2. Suggesting Features 🚀
- **Check for existing feature requests**: Before suggesting a new feature, review the current [feature requests](https://github.com/rishyym0927/Museum/issues).
- **Submit your request**: If your feature hasn’t been requested yet, open a new [issue](https://github.com/rishyym0927/Museum/issues) and explain your suggestion.

### 3. Submitting Code Changes 🛠️
- **Fork the repository**: Start by forking the repository to your own GitHub account.
- **Create a branch**: Always work on a separate branch, not on the main branch.
  
    ```bash
    git checkout -b your-branch-name
    ```

- **Make your changes**: Ensure your code follows the guidelines outlined below.
- **Commit your changes**: Once your changes are ready, commit them using proper commit message guidelines.
  
    ```bash
    git commit -m "Your concise commit message"
    ```

- **Push your changes**: Push your branch to your forked repository.
  
    ```bash
    git push origin your-branch-name
    ```

- **Open a Pull Request (PR)**: Go to the main repository, and create a new pull request (PR) from your branch.

---

## Setting Up the Development Environment

1. **Clone the repository**:
  
    ```bash
    git clone https://github.com/rishyym0927/Museum.git
    ```

2. **Navigate to the project directory**:
  
    ```bash
    cd Museum
    ```

3. **Install dependencies**:
  
    ```bash
    npm install
    ```

4. **Start the development server**:

    ```bash
    npm run dev
    ```

---

## Code Style Guidelines

- **Consistency**: Follow the existing coding style used throughout the project.
- **Linting**: Make sure to run linters before pushing your code to ensure it meets the project’s code standards.
- **Comments**: Add comments wherever necessary to explain your code, especially for complex logic.

---

## Commit Message Guidelines

- **Format**: Use clear and concise commit messages. For example:
  
    ```
    [fix] Correct issue with exhibit sorting
    [feat] Add real-time updates for exhibits
    [refactor] Simplify exhibit management code
    ```

- **Message Structure**:
  - `[type]`: A prefix describing the type of change, such as `[feat]` for features or `[fix]` for bug fixes.
  - **Description**: A short description of what was changed.

---

## Pull Request Guidelines

- **Keep it focused**: A PR should address one issue or implement one feature. Avoid bundling multiple changes into a single PR.
- **Write a detailed description**: Explain what changes you made, why you made them, and any potential impact on the rest of the project.
- **Include screenshots**: If applicable, include screenshots to help reviewers understand UI changes.
- **Review your own PR**: Ensure you’ve checked for any issues before submitting for review.

---

## Branching Model

- **Feature branches**: Use a descriptive branch name for new features or fixes.
  
    ```bash
    git checkout -b feature/your-feature-name
    ```

- **Main branch**: The `main` branch should always reflect the production-ready state of the project. Never commit directly to the `main` branch.

---

## Review Process

1. **Pull Request Review**: Once your PR is submitted, it will be reviewed by the project maintainers. 
2. **Feedback and changes**: You may receive feedback or requested changes. Please address them promptly.
3. **Approval and merge**: Once approved, your PR will be merged into the main branch.

---

## License Information

This project is licensed under the **MIT License**. For more details, see the [LICENSE](LICENSE) file.

---

Thank you for contributing to Museum! 💻 Your efforts help improve the experience for museums and visitors alike!
