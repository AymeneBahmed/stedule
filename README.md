This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Run Playwright Tests

If you're using Debian/Ubuntu based distros, first install Playwright OS-specific dependencies:

```bash
npx playwright install-deps
```

Then, you can just run tests with the following command:

```bash
npx playwright test
```

If you're NOT using a distro that uses `apt`, the best solution is to run the tests inside an **Ubuntu Container** using `distrobox`.  
For example, with `dnf`:

```bash
# Install distrobox and podman
sudo dnf install -y distrobox podman

# Install Ubuntu v24.04 image
distrobox create -i ubuntu:24.04 --name playwright-env\n

# Now you can run Debian/Ubuntu commands such as apt inside the Ubuntu Container
distrobox enter playwright-env
```
