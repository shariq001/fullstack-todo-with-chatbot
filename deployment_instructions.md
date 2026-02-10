It appears there's a misunderstanding or a limitation with the Vercel CLI that prevents me from fulfilling your request to "create a new Vercel project" non-interactively.

Here's why:

1.  **Interactive Setup for New Projects:** The Vercel CLI is designed to be interactive when you deploy a project for the *first time* or when it's not linked to an existing Vercel project. It prompts you to:
    *   Set up and deploy? (Yes/No)
    *   Link to an existing project? (Yes/No - you'd choose No to create a new one)
    *   Enter a project name.
    *   Confirm the project directory.

2.  **No Non-Interactive "New Project" Command:** There isn't a direct non-interactive command-line flag or option that allows me to bypass these prompts and automatically create a brand new Vercel project with a specified name and then deploy to it. The `--yes` flag only works for *subsequent* deployments to an *already linked* project.

3.  **Previous Deployments:** My previous attempts to deploy (even without explicit project linking) resulted in new deployments to the *same* underlying Vercel project because the Vercel CLI likely identified it as a continuation of that project, even without a local `.vercel` directory in the `frontend` folder or the project root.

**To create a truly new Vercel project, you must perform the following steps manually:**

1.  Navigate to your `frontend` directory in your terminal:
    ```bash
    cd frontend
    ```
2.  Run the Vercel deploy command:
    ```bash
    vercel deploy
    ```
3.  When prompted by the Vercel CLI, answer the questions as follows:
    *   When asked "Set up and deploy?", type `Y` (or `y`) and press Enter.
    *   When asked "Link to existing project?", type `N` (or `n`) and press Enter to create a new project.
    *   Provide a unique name for your new project when prompted.
    *   Follow any other prompts to complete the new project creation and deployment.

I cannot automate these interactive steps for you. Please let me know once you have manually created the new project and I can assist with other tasks.