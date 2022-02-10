const execa = require('execa')
const git = require('git-rev-sync')
const semver = require('semver')
const path = require('path')

const pkgJson = require('../package.json')
const baseExecOptions = { stdout: process.stdout, stderr: process.stderr, shell: true }

const currentBranch = git.branch(path.resolve(__dirname, '../'))
const newVersion = semver.inc(pkgJson.version, 'patch')
const newTag = `web-test-app-release-${newVersion}`

execa.commandSync('npm version patch', { ...baseExecOptions })

execa.commandSync('git add .', { ...baseExecOptions })
execa.commandSync(`git commit -m "chore: release ${newVersion}"`, { ...baseExecOptions })
execa.commandSync(`git tag ${newTag}`, { ...baseExecOptions })
execa.commandSync(`git push --set-upstream origin ${currentBranch}`, { ...baseExecOptions })
execa.commandSync(`git push origin ${newTag}`, { ...baseExecOptions })
