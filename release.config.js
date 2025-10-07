const branch = process.env.CI_COMMIT_BRANCH;

module.exports = {
  branches: [
    "main",
    { name: "staging", prerelease: "beta" },
  ],
  plugins: [
    "@semantic-release/commit-analyzer",
    [
      "@semantic-release/release-notes-generator",
      {
        preset: "conventionalcommits",
        presetConfig: {
          types: [
            { type: "feat", section: "✨ 새로운 기능", hidden: false },
            { type: "fix", section: "🐛 버그 수정", hidden: false },
            { type: "perf", section: "⚡️ 성능 개선", hidden: false },
            { type: "refactor", section: "♻️ 리팩토링", hidden: false },
            { type: "docs", section: "📝 문서", hidden: false },
            { type: "style", section: "💄 스타일", hidden: true },
            { type: "test", section: "✅ 테스트", hidden: true },
            { type: "ci", section: "💫 CI/CD", hidden: true },
            { type: "chore", section: "📦 기타 작업", hidden: true },
          ],
        },
      },
    ],
    [
      "@semantic-release/changelog",
      {
        changelogFile: "CHANGELOG.md",
        changelogTitle: "# 릴리즈 노트",
      },
    ],
    ["@semantic-release/npm", { npmPublish: false }],
    "@semantic-release/gitlab",

    ...(branch === "main"
      ? [[
          "@semantic-release/git",
          {
            assets: ["package.json", "CHANGELOG.md"],
            message:
              "chore(release): ${nextRelease.version}\n\n${nextRelease.notes}",
          },
        ]]
      : []),
  ],
};
