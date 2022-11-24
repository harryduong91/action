var $dHxwU$actionscore = require("@actions/core");
var $dHxwU$fsextra = require("fs-extra");
var $dHxwU$actionsexec = require("@actions/exec");
var $dHxwU$actionsgithub = require("@actions/github");
var $dHxwU$manypkggetpackages = require("@manypkg/get-packages");
var $dHxwU$path = require("path");
var $dHxwU$semver = require("semver");
var $dHxwU$resolvefrom = require("resolve-from");
var $dHxwU$remarkparse = require("remark-parse");
var $dHxwU$remarkstringify = require("remark-stringify");
var $dHxwU$unified = require("unified");
var $dHxwU$mdastutiltostring = require("mdast-util-to-string");
var $dHxwU$changesetspre = require("@changesets/pre");
var $dHxwU$changesetsread = require("@changesets/read");

function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}



const $722bdcdaa52145c0$export$9936d2f3e27329ac = async ()=>{
    await (0, $dHxwU$actionsexec.exec)("git", [
        "config",
        "user.name",
        `"github-actions[bot]"`
    ]);
    await (0, $dHxwU$actionsexec.exec)("git", [
        "config",
        "user.email",
        `"github-actions[bot]@users.noreply.github.com"`
    ]);
};
const $722bdcdaa52145c0$export$74c527a9c7490b8d = async (branch)=>{
    await (0, $dHxwU$actionsexec.exec)("git", [
        "pull",
        "origin",
        branch
    ]);
};
const $722bdcdaa52145c0$export$4cbf152802aa238 = async (branch, { force: force  } = {})=>{
    await (0, $dHxwU$actionsexec.exec)("git", [
        "push",
        "origin",
        `HEAD:${branch}`,
        force && "--force"
    ].filter(Boolean));
};
const $722bdcdaa52145c0$export$d7827446c35b669 = async ()=>{
    await (0, $dHxwU$actionsexec.exec)("git", [
        "push",
        "origin",
        "--tags"
    ]);
};
const $722bdcdaa52145c0$export$d3ee717463943717 = async (branch)=>{
    let { stderr: stderr  } = await (0, $dHxwU$actionsexec.getExecOutput)("git", [
        "checkout",
        branch
    ], {
        ignoreReturnCode: true
    });
    let isCreatingBranch = !stderr.toString().includes(`Switched to a new branch '${branch}'`);
    if (isCreatingBranch) await (0, $dHxwU$actionsexec.exec)("git", [
        "checkout",
        "-b",
        branch
    ]);
};
const $722bdcdaa52145c0$export$aad8462122ac592b = async (pathSpec, mode = "hard")=>{
    await (0, $dHxwU$actionsexec.exec)("git", [
        "reset",
        `--${mode}`,
        pathSpec
    ]);
};
const $722bdcdaa52145c0$export$66209c4192302dcd = async (message)=>{
    await (0, $dHxwU$actionsexec.exec)("git", [
        "add",
        "."
    ]);
    await (0, $dHxwU$actionsexec.exec)("git", [
        "commit",
        "-m",
        message
    ]);
};
const $722bdcdaa52145c0$export$1c1f182f1f2a0410 = async ()=>{
    const { stdout: stdout  } = await (0, $dHxwU$actionsexec.getExecOutput)("git", [
        "status",
        "--porcelain"
    ]);
    return !stdout.length;
};













const $d84c8a14352b3580$export$9c0c644720f223a = {
    dep: 0,
    patch: 1,
    minor: 2,
    major: 3
};
async function $d84c8a14352b3580$export$23da156e58961c7a(cwd) {
    let { packages: packages  } = await (0, $dHxwU$manypkggetpackages.getPackages)(cwd);
    return new Map(packages.map((x)=>[
            x.dir,
            x.packageJson.version
        ]));
}
async function $d84c8a14352b3580$export$d87db763821f893d(cwd, previousVersions) {
    let { packages: packages  } = await (0, $dHxwU$manypkggetpackages.getPackages)(cwd);
    let changedPackages = new Set();
    for (let pkg of packages){
        const previousVersion = previousVersions.get(pkg.dir);
        if (previousVersion !== pkg.packageJson.version) changedPackages.add(pkg);
    }
    return [
        ...changedPackages
    ];
}
function $d84c8a14352b3580$export$e96eddfae9dc4214(changelog, version) {
    let ast = (0, $dHxwU$unified.unified)().use((0, ($parcel$interopDefault($dHxwU$remarkparse)))).parse(changelog);
    let highestLevel = $d84c8a14352b3580$export$9c0c644720f223a.dep;
    let nodes = ast.children;
    let headingStartInfo;
    let endIndex;
    for(let i = 0; i < nodes.length; i++){
        let node = nodes[i];
        if (node.type === "heading") {
            let stringified = (0, $dHxwU$mdastutiltostring.toString)(node);
            let match = stringified.toLowerCase().match(/(major|minor|patch)/);
            if (match !== null) {
                let level = $d84c8a14352b3580$export$9c0c644720f223a[match[0]];
                highestLevel = Math.max(level, highestLevel);
            }
            if (headingStartInfo === undefined && stringified === version) {
                headingStartInfo = {
                    index: i,
                    depth: node.depth
                };
                continue;
            }
            if (endIndex === undefined && headingStartInfo !== undefined && headingStartInfo.depth === node.depth) {
                endIndex = i;
                break;
            }
        }
    }
    if (headingStartInfo) ast.children = ast.children.slice(headingStartInfo.index + 1, endIndex);
    return {
        content: (0, $dHxwU$unified.unified)().use((0, ($parcel$interopDefault($dHxwU$remarkstringify)))).stringify(ast),
        highestLevel: highestLevel
    };
}
function $d84c8a14352b3580$export$5973a8996685cd30(a, b) {
    if (a.private === b.private) return b.highestLevel - a.highestLevel;
    if (a.private) return 1;
    return -1;
}





async function $6a90960fd3cbbc72$export$2e2bcd8739ae039(cwd = process.cwd()) {
    let preState = await (0, $dHxwU$changesetspre.readPreState)(cwd);
    let isInPreMode = preState !== undefined && preState.mode === "pre";
    let changesets = await (0, ($parcel$interopDefault($dHxwU$changesetsread)))(cwd);
    if (isInPreMode) {
        let changesetsToFilter = new Set(preState?.changesets);
        changesets = changesets.filter((x)=>!changesetsToFilter.has(x.id));
    }
    return {
        preState: isInPreMode ? preState : undefined,
        changesets: changesets
    };
}



// GitHub Issues/PRs messages have a max size limit on the
// message body payload.
// `body is too long (maximum is 65536 characters)`.
// To avoid that, we ensure to cap the message to 60k chars.
const $e2b9a38bfc5e8f85$var$MAX_CHARACTERS_PER_MESSAGE = 60000;
const $e2b9a38bfc5e8f85$var$createRelease = async (octokit, { pkg: pkg , tagName: tagName  })=>{
    try {
        let changelogFileName = (0, ($parcel$interopDefault($dHxwU$path))).join(pkg.dir, "CHANGELOG.md");
        let changelog = await (0, ($parcel$interopDefault($dHxwU$fsextra))).readFile(changelogFileName, "utf8");
        let changelogEntry = (0, $d84c8a14352b3580$export$e96eddfae9dc4214)(changelog, pkg.packageJson.version);
        if (!changelogEntry) // we can find a changelog but not the entry for this version
        // if this is true, something has probably gone wrong
        throw new Error(`Could not find changelog entry for ${pkg.packageJson.name}@${pkg.packageJson.version}`);
        await octokit.rest.repos.createRelease({
            name: tagName,
            tag_name: tagName,
            body: changelogEntry.content,
            prerelease: pkg.packageJson.version.includes("-"),
            ...$dHxwU$actionsgithub.context.repo
        });
    } catch (err) {
        // if we can't find a changelog, the user has probably disabled changelogs
        if (err.code !== "ENOENT") throw err;
    }
};
async function $e2b9a38bfc5e8f85$export$5ecf25c4fdcb0195({ script: script , githubToken: githubToken , createGithubReleases: createGithubReleases , cwd: cwd = process.cwd()  }) {
    let octokit = $dHxwU$actionsgithub.getOctokit(githubToken);
    let [publishCommand, ...publishArgs] = script.split(/\s+/);
    let changesetPublishOutput = await (0, $dHxwU$actionsexec.getExecOutput)(publishCommand, publishArgs, {
        cwd: cwd
    });
    await $722bdcdaa52145c0$export$d7827446c35b669();
    let { packages: packages , tool: tool  } = await (0, $dHxwU$manypkggetpackages.getPackages)(cwd);
    let releasedPackages = [];
    if (tool !== "root") {
        let newTagRegex = /New tag:\s+(@[^/]+\/[^@]+|[^/]+)@([^\s]+)/;
        let packagesByName = new Map(packages.map((x)=>[
                x.packageJson.name,
                x
            ]));
        for (let line of changesetPublishOutput.stdout.split("\n")){
            let match = line.match(newTagRegex);
            if (match === null) continue;
            let pkgName = match[1];
            let pkg = packagesByName.get(pkgName);
            if (pkg === undefined) throw new Error(`Package "${pkgName}" not found.` + "This is probably a bug in the action, please open an issue");
            releasedPackages.push(pkg);
        }
        if (createGithubReleases) await Promise.all(releasedPackages.map((pkg)=>$e2b9a38bfc5e8f85$var$createRelease(octokit, {
                pkg: pkg,
                tagName: `${pkg.packageJson.name}@${pkg.packageJson.version}`
            })));
    } else {
        if (packages.length === 0) throw new Error(`No package found.` + "This is probably a bug in the action, please open an issue");
        let pkg1 = packages[0];
        let newTagRegex1 = /New tag:/;
        for (let line1 of changesetPublishOutput.stdout.split("\n")){
            let match1 = line1.match(newTagRegex1);
            if (match1) {
                releasedPackages.push(pkg1);
                if (createGithubReleases) await $e2b9a38bfc5e8f85$var$createRelease(octokit, {
                    pkg: pkg1,
                    tagName: `v${pkg1.packageJson.version}`
                });
                break;
            }
        }
    }
    if (releasedPackages.length) return {
        published: true,
        publishedPackages: releasedPackages.map((pkg)=>({
                name: pkg.packageJson.name,
                version: pkg.packageJson.version
            }))
    };
    return {
        published: false
    };
}
const $e2b9a38bfc5e8f85$var$requireChangesetsCliPkgJson = (cwd)=>{
    try {
        return require((0, ($parcel$interopDefault($dHxwU$resolvefrom)))(cwd, "@changesets/cli/package.json"));
    } catch (err) {
        if (err && err?.code === "MODULE_NOT_FOUND") throw new Error(`Have you forgotten to install \`@changesets/cli\` in "${cwd}"?`);
        throw err;
    }
};
async function $e2b9a38bfc5e8f85$export$2d25641869859a6({ hasPublishScript: hasPublishScript , preState: preState , changedPackagesInfo: changedPackagesInfo , prBodyMaxCharacters: prBodyMaxCharacters , branch: branch  }) {
    let messageHeader = `This PR was opened by the [Changesets release](https://github.com/changesets/action) GitHub action. When you're ready to do a release, you can merge this and ${hasPublishScript ? `the packages will be published to npm automatically` : `publish to npm yourself or [setup this action to publish automatically](https://github.com/changesets/action#with-publishing)`}. If you're not ready to do a release yet, that's fine, whenever you add more changesets to ${branch}, this PR will be updated.
`;
    let messagePrestate = !!preState ? `⚠️⚠️⚠️⚠️⚠️⚠️

\`${branch}\` is currently in **pre mode** so this branch has prereleases rather than normal releases. If you want to exit prereleases, run \`changeset pre exit\` on \`${branch}\`.

⚠️⚠️⚠️⚠️⚠️⚠️
` : "";
    let messageReleasesHeading = `# Releases`;
    let fullMessage = [
        messageHeader,
        messagePrestate,
        messageReleasesHeading,
        ...changedPackagesInfo.map((info)=>`${info.header}\n\n${info.content}`)
    ].join("\n");
    // Check that the message does not exceed the size limit.
    // If not, omit the changelog entries of each package.
    if (fullMessage.length > prBodyMaxCharacters) fullMessage = [
        messageHeader,
        messagePrestate,
        messageReleasesHeading,
        `\n> The changelog information of each package has been omitted from this message, as the content exceeds the size limit.\n`,
        ...changedPackagesInfo.map((info)=>`${info.header}\n\n`)
    ].join("\n");
    // Check (again) that the message is within the size limit.
    // If not, omit all release content this time.
    if (fullMessage.length > prBodyMaxCharacters) fullMessage = [
        messageHeader,
        messagePrestate,
        messageReleasesHeading,
        `\n> All release information have been omitted from this message, as the content exceeds the size limit.`
    ].join("\n");
    return fullMessage;
}
async function $e2b9a38bfc5e8f85$export$b9cde0cdbf775459({ script: script , githubToken: githubToken , cwd: cwd = process.cwd() , prTitle: prTitle = "Version Packages" , commitMessage: commitMessage = "Version Packages" , hasPublishScript: hasPublishScript = false , prBodyMaxCharacters: prBodyMaxCharacters = $e2b9a38bfc5e8f85$var$MAX_CHARACTERS_PER_MESSAGE  }) {
    let repo = `${$dHxwU$actionsgithub.context.repo.owner}/${$dHxwU$actionsgithub.context.repo.repo}`;
    let branch = $dHxwU$actionsgithub.context.ref.replace("refs/heads/", "");
    let versionBranch = `changeset-release/${branch}`;
    let octokit = $dHxwU$actionsgithub.getOctokit(githubToken);
    let { preState: preState  } = await (0, $6a90960fd3cbbc72$export$2e2bcd8739ae039)(cwd);
    await $722bdcdaa52145c0$export$d3ee717463943717(versionBranch);
    await $722bdcdaa52145c0$export$aad8462122ac592b($dHxwU$actionsgithub.context.sha);
    let versionsByDirectory = await (0, $d84c8a14352b3580$export$23da156e58961c7a)(cwd);
    if (script) {
        let [versionCommand, ...versionArgs] = script.split(/\s+/);
        await (0, $dHxwU$actionsexec.exec)(versionCommand, versionArgs, {
            cwd: cwd
        });
    } else {
        let changesetsCliPkgJson = $e2b9a38bfc5e8f85$var$requireChangesetsCliPkgJson(cwd);
        let cmd = $dHxwU$semver.lt(changesetsCliPkgJson.version, "2.0.0") ? "bump" : "version";
        await (0, $dHxwU$actionsexec.exec)("node", [
            (0, ($parcel$interopDefault($dHxwU$resolvefrom)))(cwd, "@changesets/cli/bin.js"),
            cmd
        ], {
            cwd: cwd
        });
    }
    let searchQuery = `repo:${repo}+state:open+head:${versionBranch}+base:${branch}+is:pull-request`;
    let searchResultPromise = octokit.rest.search.issuesAndPullRequests({
        q: searchQuery
    });
    let changedPackages = await (0, $d84c8a14352b3580$export$d87db763821f893d)(cwd, versionsByDirectory);
    let changedPackagesInfoPromises = Promise.all(changedPackages.map(async (pkg)=>{
        let changelogContents = await (0, ($parcel$interopDefault($dHxwU$fsextra))).readFile((0, ($parcel$interopDefault($dHxwU$path))).join(pkg.dir, "CHANGELOG.md"), "utf8");
        let entry = (0, $d84c8a14352b3580$export$e96eddfae9dc4214)(changelogContents, pkg.packageJson.version);
        return {
            highestLevel: entry.highestLevel,
            private: !!pkg.packageJson.private,
            content: entry.content,
            header: `## ${pkg.packageJson.name}@${pkg.packageJson.version}`
        };
    }));
    const finalPrTitle = `${prTitle}${!!preState ? ` (${preState.tag})` : ""}`;
    // project with `commit: true` setting could have already committed files
    if (!await $722bdcdaa52145c0$export$1c1f182f1f2a0410()) {
        const finalCommitMessage = `${commitMessage}${!!preState ? ` (${preState.tag})` : ""}`;
        await $722bdcdaa52145c0$export$66209c4192302dcd(finalCommitMessage);
    }
    await $722bdcdaa52145c0$export$4cbf152802aa238(versionBranch, {
        force: true
    });
    let searchResult = await searchResultPromise;
    console.log(JSON.stringify(searchResult.data, null, 2));
    const changedPackagesInfo = (await changedPackagesInfoPromises).filter((x)=>x).sort((0, $d84c8a14352b3580$export$5973a8996685cd30));
    let prBody = await $e2b9a38bfc5e8f85$export$2d25641869859a6({
        hasPublishScript: hasPublishScript,
        preState: preState,
        branch: branch,
        changedPackagesInfo: changedPackagesInfo,
        prBodyMaxCharacters: prBodyMaxCharacters
    });
    if (searchResult.data.items.length === 0) {
        console.log("creating pull request");
        const { data: newPullRequest  } = await octokit.rest.pulls.create({
            base: branch,
            head: versionBranch,
            title: finalPrTitle,
            body: prBody,
            ...$dHxwU$actionsgithub.context.repo
        });
        return {
            pullRequestNumber: newPullRequest.number
        };
    } else {
        const [pullRequest] = searchResult.data.items;
        console.log(`updating found pull request #${pullRequest.number}`);
        await octokit.rest.pulls.update({
            pull_number: pullRequest.number,
            title: finalPrTitle,
            body: prBody,
            ...$dHxwU$actionsgithub.context.repo
        });
        return {
            pullRequestNumber: pullRequest.number
        };
    }
}



const $24f590782a7cf84a$var$getOptionalInput = (name)=>$dHxwU$actionscore.getInput(name) || undefined;
(async ()=>{
    let githubToken = process.env.GITHUB_TOKEN;
    if (!githubToken) {
        $dHxwU$actionscore.setFailed("Please add the GITHUB_TOKEN to the changesets action");
        return;
    }
    const inputCwd = $dHxwU$actionscore.getInput("cwd");
    if (inputCwd) {
        console.log("changing directory to the one given as the input");
        process.chdir(inputCwd);
    }
    let setupGitUser = $dHxwU$actionscore.getBooleanInput("setupGitUser");
    if (setupGitUser) {
        console.log("setting git user");
        await $722bdcdaa52145c0$export$9936d2f3e27329ac();
    }
    console.log("setting GitHub credentials");
    await (0, ($parcel$interopDefault($dHxwU$fsextra))).writeFile(`${process.env.HOME}/.netrc`, `machine github.com\nlogin github-actions[bot]\npassword ${githubToken}`);
    let { changesets: changesets  } = await (0, $6a90960fd3cbbc72$export$2e2bcd8739ae039)();
    let publishScript = $dHxwU$actionscore.getInput("publish");
    let hasChangesets = changesets.length !== 0;
    const hasNonEmptyChangesets = changesets.some((changeset)=>changeset.releases.length > 0);
    let hasPublishScript = !!publishScript;
    $dHxwU$actionscore.setOutput("published", "false");
    $dHxwU$actionscore.setOutput("publishedPackages", "[]");
    $dHxwU$actionscore.setOutput("hasChangesets", String(hasChangesets));
    switch(true){
        case !hasChangesets && !hasPublishScript:
            console.log("No changesets found");
            return;
        case !hasChangesets && hasPublishScript:
            {
                console.log("No changesets found, attempting to publish any unpublished packages to npm");
                let userNpmrcPath = `${process.env.HOME}/.npmrc`;
                if ((0, ($parcel$interopDefault($dHxwU$fsextra))).existsSync(userNpmrcPath)) {
                    console.log("Found existing user .npmrc file");
                    const userNpmrcContent = await (0, ($parcel$interopDefault($dHxwU$fsextra))).readFile(userNpmrcPath, "utf8");
                    const authLine = userNpmrcContent.includes("_authToken");
                    // const authLine = userNpmrcContent.split("\n").find((line) => {
                    //   // check based on https://github.com/npm/cli/blob/8f8f71e4dd5ee66b3b17888faad5a7bf6c657eed/test/lib/adduser.js#L103-L105
                    //   return /^\s*\/\/registry\.npmjs\.org\/:[_-]authToken=/i.test(line);
                    // });
                    if (authLine) console.log("Found existing auth token for the npm registry in the user .npmrc file");
                    else {
                        console.log("Didn't find existing auth token for the npm registry in the user .npmrc file, creating one");
                        (0, ($parcel$interopDefault($dHxwU$fsextra))).appendFileSync(userNpmrcPath, `\n//registry.npmjs.org/:_authToken=${process.env.NPM_TOKEN}\n`);
                    }
                } else {
                    console.log("No user .npmrc file found, creating one");
                    (0, ($parcel$interopDefault($dHxwU$fsextra))).writeFileSync(userNpmrcPath, `//registry.npmjs.org/:_authToken=${process.env.NPM_TOKEN}\n`);
                }
                const result = await (0, $e2b9a38bfc5e8f85$export$5ecf25c4fdcb0195)({
                    script: publishScript,
                    githubToken: githubToken,
                    createGithubReleases: $dHxwU$actionscore.getBooleanInput("createGithubReleases")
                });
                if (result.published) {
                    $dHxwU$actionscore.setOutput("published", "true");
                    $dHxwU$actionscore.setOutput("publishedPackages", JSON.stringify(result.publishedPackages));
                }
                return;
            }
        case hasChangesets && !hasNonEmptyChangesets:
            console.log("All changesets are empty; not creating PR");
            return;
        case hasChangesets:
            const { pullRequestNumber: pullRequestNumber  } = await (0, $e2b9a38bfc5e8f85$export$b9cde0cdbf775459)({
                script: $24f590782a7cf84a$var$getOptionalInput("version"),
                githubToken: githubToken,
                prTitle: $24f590782a7cf84a$var$getOptionalInput("title"),
                commitMessage: $24f590782a7cf84a$var$getOptionalInput("commit"),
                hasPublishScript: hasPublishScript
            });
            $dHxwU$actionscore.setOutput("pullRequestNumber", String(pullRequestNumber));
            return;
    }
})().catch((err)=>{
    console.error(err);
    $dHxwU$actionscore.setFailed(err.message);
});


