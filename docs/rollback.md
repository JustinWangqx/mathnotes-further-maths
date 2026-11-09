# Roll back / 回滚到上一个版本

The version immediately before adding Learn is saved as **`before-learning-section-2026-11-09`** at commit **`d4f392b6b2fc25733fb0d7d9cc790b7e0c52fa2f`**. Enter that tag in **revision** to publish the previous version.

The version before pairing Mechanics diagrams with questions is saved as **`before-mechanics-diagrams-2026-11-05`** at commit **`db0182b426e8e0fc36f1ff3f530c9a0684e1dc2b`**. Enter that tag in **revision** to restore it.

The readable release before adding the new Mechanics and Statistics material is saved as **`before-new-material-2026-11-05`** at commit **`eed916f6b6b85962b416863b323324beeaf37d1c`**. Use that tag in **revision** to restore that version.

The version before the readability update is saved as **`before-readability-update-2026-11-05`** at commit **`9ca502b871a153b651b34ec5c5f43c16f2f662f8`**. Enter this tag in the existing workflow's **revision** input to publish it. A separate source archive was saved locally in the task's outputs folder.

The exact version before the study-efficiency changes is preserved at:

- Git tag: **`before-study-refinement-2026-11-05`**
- Commit: **`c849ed68861c8b49b9b80d2dac2f53ee631d1073`**
- Tag on GitHub: <https://github.com/JustinWangqx/mathnotes-further-maths/tree/before-study-refinement-2026-11-05>

The source was archived and rebuilt in a separate temporary directory. Its original check, production build and all 23 tests passed. The snapshot was not changed during that check. A source archive and a built-site archive were also saved locally beside this repository in the task's outputs folder.

## Restore the public website without deleting history

1. Open <https://github.com/JustinWangqx/mathnotes-further-maths/actions/workflows/deploy.yml>.
2. Choose **Run workflow** and leave the workflow branch set to **main**.
3. Enter **`before-study-refinement-2026-11-05`** in **revision**.
4. Run the workflow and wait for **build** and **deploy** to succeed.

这样会重新发布改动前的网站，保留 main 分支和所有新旧提交记录，不需要 force push。之后想回到新版，把 revision 改成 `main` 再运行即可。也可以填任意已有的 commit SHA 或 tag。

The workflow checks out the chosen source revision, installs its locked dependencies, runs its own checks/tests and publishes its build. Its run summary records the actual source commit. A future normal push to main will publish main again; use the source-restoration procedure below if you want the rollback to become the continuing development version.

## Restore source as a new commit

Work in a clean checkout. First record the current commit with a new backup tag. Restore the desired snapshot **as a new commit** rather than rewriting branch history:

```sh
git fetch origin --tags
git switch main
git pull --ff-only
git tag backup-before-source-restore
git restore --source=before-study-refinement-2026-11-05 --staged --worktree -- .
git commit -m "Restore the pre-refinement website"
git push origin main
```

This restores the earlier source tree, including the earlier workflow. All intervening commits remain in Git history. To restore a different snapshot, substitute its tag or commit in the restore command. Use a fresh backup-tag name each time. Never use `git reset --hard` or a force push for routine rollback.

## What the backup covers

The tagged source includes the original question/answer PDFs, notes, styles and build configuration. The built-site archive can be unpacked onto compatible static hosting without rebuilding. These are two recovery routes if rebuilding a historical dependency becomes difficult.

Historical confidence values, if any, live in the visitor's browser separately from the source. The readable release has removed the confidence controls. The external total-view counter also remains separate from the source snapshot.

Keep the repository history/tags and an independent copy of the archives. Rollback publication still depends on hosting availability and account access; an outage can delay publication even when the saved version is intact.
