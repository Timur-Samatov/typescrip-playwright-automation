# TypeScript Playwright Automation

This project contains automated UI and API tests for the [Parabank](https://parabank.parasoft.com) application using [Playwright](https://playwright.dev/) and TypeScript.

## Features

- **UI Testing**: Comprehensive UI tests using the **Page Object Model (POM)** pattern.
- **API Testing**: API tests driven by a custom `ParabankApiClient`.
- **TypeScript**: Type-safe test development.
- **CI/CD Integration**: Pre-configured GitHub Actions workflow.
- **Environment Management**: Secure handling of credentials and URLs using `dotenv`.

## Project Structure

```text
├── api/                # API client implementations
├── pages/              # Page Object Models (POM)
│   └── components/     # Reusable UI components
├── tests/              # Test files
│   └── ui/             # UI-specific tests
├── .github/workflows/  # CI/CD configuration
├── playwright.config.ts # Playwright configuration
├── .env.example        # Template for environment variables
└── package.json        # Project dependencies and scripts
```

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [pnpm](https://pnpm.io/) (used as the package manager)

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd typescrip-playwright-automation
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Install Playwright browsers:
   ```bash
   pnpm exec playwright install --with-deps
   ```

## Configuration

1. Copy the `.env.example` file to `.env`:

   ```bash
   cp .env.example .env
   ```

2. Open the `.env` file and fill in your credentials:
   ```env
   BASE_URL="https://parabank.parasoft.com"
   USERNAME_1="your_username"
   PASSWORD_1="your_password"
   USER_FULLNAME_1="Your Full Name"
   ```

## Running Tests

### Run all tests (headless)

```bash
pnpm test
```

### Run tests in UI mode

```bash
pnpm run test:ui
```

### Run tests in Headed mode

```bash
pnpm run test:headed
```

### Show test report

```bash
pnpm run report
```

### Run specific test files

- **UI Tests**: `pnpm exec playwright test tests/ui`

## CI/CD

The project includes a GitHub Actions workflow located in `.github/workflows/playwright.yml`. It automatically runs tests on every push and pull request to the `main` or `master` branches.

Make sure to set the following secrets in your GitHub repository:

- `USERNAME_1`
- `PASSWORD_1`
- `USER_FULLNAME_1`

## License

This project is licensed under the ISC License.
