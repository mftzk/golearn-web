export type WorkspaceFiles = Record<string, string>;

export const MAX_WORKSPACE_SOURCE_BYTES = 64 * 1024;

export function parseWorkspaceFiles(value: unknown): WorkspaceFiles | null {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return null;
  }

  const files: WorkspaceFiles = {};
  for (const [name, content] of Object.entries(value)) {
    if (typeof content !== "string") return null;
    files[name] = content;
  }
  return files;
}

export function hasExpectedWorkspaceFiles(
  files: WorkspaceFiles,
  expectedNames: string[],
): boolean {
  const actualNames = Object.keys(files).sort();
  const sortedExpectedNames = [...expectedNames].sort();
  return (
    actualNames.length === sortedExpectedNames.length &&
    actualNames.every((name, index) => name === sortedExpectedNames[index])
  );
}

export function workspaceSourceBytes(files: WorkspaceFiles): number {
  return Object.values(files).reduce(
    (total, content) => total + new TextEncoder().encode(content).length,
    0,
  );
}
